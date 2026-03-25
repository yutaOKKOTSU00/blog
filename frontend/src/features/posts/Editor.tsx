// ─────────────────────────────────────────────
// Editor.tsx — Éditeur Markdown avec toolbar et aperçu
// Aucune dépendance externe requise
// ─────────────────────────────────────────────

import { useRef, useState, useCallback } from 'react'
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  Code, List, ListOrdered, Minus, Eye, Edit3,
  Link2, Quote, RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Rendu Markdown simplifié (sans lib externe) ────────────────────────────
function renderMarkdown(md: string): string {
  if (!md.trim()) return ''

  return md
    // Blocs de code (avant le reste pour ne pas interpréter leur contenu)
    .replace(
      /```(\w+)?\n?([\s\S]*?)```/gm,
      '<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto text-sm font-mono"><code>$2</code></pre>',
    )
    // Titres
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
    // Séparateur
    .replace(/^---$/gm, '<hr class="border-gray-200 my-6">')
    // Citations
    .replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-4 border-blue-300 pl-4 py-0.5 text-gray-600 italic my-4 bg-blue-50 rounded-r-lg">$1</blockquote>',
    )
    // Code inline
    .replace(/`([^`]+)`/g, '<code class="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Gras + italique combiné
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,     '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em>$1</em>')
    .replace(/_(.+?)_/g,           '<em>$1</em>')
    // Liens
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )
    // Listes à puces
    .replace(/^- (.+)$/gm,    '<li class="ml-5 list-disc text-gray-700 my-0.5">$1</li>')
    // Listes numérotées
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-gray-700 my-0.5">$1</li>')
    // Paragraphes (lignes qui ne sont pas déjà des balises HTML)
    .replace(/^(?!<[a-z])(.+)$/gm, '<p class="text-gray-700 leading-relaxed mb-3">$1</p>')
    // Sauts de ligne multiples → un seul
    .replace(/(<\/p>|<\/h[1-6]>|<\/blockquote>|<\/pre>|<\/li>)\n(<p|<h)/g, '$1$2')
}

// ── Types ──────────────────────────────────────────────────────────────────
interface EditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minRows?: number
}

type Mode = 'write' | 'preview'

// ── Composant ──────────────────────────────────────────────────────────────
export function Editor({
  value,
  onChange,
  placeholder = 'Écrivez votre article en Markdown…',
  className,
  minRows = 20,
}: EditorProps) {
  const [mode, setMode] = useState<Mode>('write')
  const taRef = useRef<HTMLTextAreaElement>(null)

  // Insère du texte autour de la sélection courante
  const wrap = useCallback(
    (before: string, after = '') => {
      const ta = taRef.current
      if (!ta) return
      const s = ta.selectionStart
      const e = ta.selectionEnd
      const selected = value.slice(s, e) || (after ? 'texte' : '')
      const next = value.slice(0, s) + before + selected + after + value.slice(e)
      onChange(next)
      requestAnimationFrame(() => {
        ta.focus()
        ta.setSelectionRange(s + before.length, s + before.length + selected.length)
      })
    },
    [value, onChange],
  )

  // Préfixe le début de la ligne courante
  const prefix = useCallback(
    (p: string) => {
      const ta = taRef.current
      if (!ta) return
      const s = ta.selectionStart
      const lineStart = value.lastIndexOf('\n', s - 1) + 1
      // Retire le préfixe s'il est déjà présent (toggle)
      if (value.slice(lineStart).startsWith(p)) {
        const next = value.slice(0, lineStart) + value.slice(lineStart + p.length)
        onChange(next)
        requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s - p.length, s - p.length) })
      } else {
        const next = value.slice(0, lineStart) + p + value.slice(lineStart)
        onChange(next)
        requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + p.length, s + p.length) })
      }
    },
    [value, onChange],
  )

  // Raccourcis clavier
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (ctrl && e.key === 'b') { e.preventDefault(); wrap('**', '**') }
      if (ctrl && e.key === 'i') { e.preventDefault(); wrap('_', '_') }
      if (ctrl && e.key === 'k') { e.preventDefault(); wrap('[', '](url)') }
      // Tab → 2 espaces
      if (e.key === 'Tab') {
        e.preventDefault()
        const ta = e.currentTarget
        const s = ta.selectionStart
        onChange(value.slice(0, s) + '  ' + value.slice(s))
        requestAnimationFrame(() => ta.setSelectionRange(s + 2, s + 2))
      }
      // Enter → continue liste
      if (e.key === 'Enter') {
        const ta = e.currentTarget
        const s = ta.selectionStart
        const lineStart = value.lastIndexOf('\n', s - 1) + 1
        const line = value.slice(lineStart, s)
        const listMatch = line.match(/^(\s*)(- |\d+\. )/)
        if (listMatch) {
          e.preventDefault()
          const next = value.slice(0, s) + '\n' + listMatch[1] + listMatch[2] + value.slice(s)
          onChange(next)
          const pos = s + 1 + listMatch[1].length + listMatch[2].length
          requestAnimationFrame(() => ta.setSelectionRange(pos, pos))
        }
      }
    },
    [wrap, value, onChange],
  )

  // Nombre de mots
  const wordCount = value.split(/\s+/).filter(Boolean).length

  // Définition des outils
  type ToolSep = { sep: true }
  type ToolBtn = {
    sep?: false
    icon: React.ReactNode
    title: string
    action: () => void
    active?: boolean
  }
  type Tool = ToolSep | ToolBtn

  const tools: Tool[] = [
    { icon: <Bold size={13} />,        title: 'Gras (Ctrl+B)',    action: () => wrap('**', '**') },
    { icon: <Italic size={13} />,      title: 'Italique (Ctrl+I)', action: () => wrap('_', '_') },
    { sep: true },
    { icon: <Heading1 size={13} />,    title: 'Titre H1',         action: () => prefix('# ') },
    { icon: <Heading2 size={13} />,    title: 'Titre H2',         action: () => prefix('## ') },
    { icon: <Heading3 size={13} />,    title: 'Titre H3',         action: () => prefix('### ') },
    { sep: true },
    { icon: <Code size={13} />,        title: 'Code inline',      action: () => wrap('`', '`') },
    {
      icon: <span className="font-mono text-[10px] leading-none tracking-tighter">```</span>,
      title: 'Bloc de code',
      action: () => wrap('```\n', '\n```'),
    },
    { icon: <Quote size={13} />,       title: 'Citation',         action: () => prefix('> ') },
    { sep: true },
    { icon: <List size={13} />,        title: 'Liste à puces',    action: () => prefix('- ') },
    { icon: <ListOrdered size={13} />, title: 'Liste numérotée',  action: () => prefix('1. ') },
    { sep: true },
    { icon: <Link2 size={13} />,       title: 'Lien (Ctrl+K)',    action: () => wrap('[', '](url)') },
    {
      icon: <Minus size={13} />,
      title: 'Séparateur horizontal',
      action: () => onChange(value + '\n\n---\n\n'),
    },
  ]

  return (
    <div className={cn('border border-gray-200 rounded-xl overflow-hidden bg-white', className)}>

      {/* ── Barre d'outils ──────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 flex-wrap min-h-[42px]">

        {/* Tabs Écrire / Aperçu */}
        <div className="flex items-center mr-2 border border-gray-200 rounded-lg overflow-hidden bg-white shrink-0">
          {(['write', 'preview'] as Mode[]).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors',
                mode === m ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700',
              )}
            >
              {m === 'write' ? <><Edit3 size={10} /> Écrire</> : <><Eye size={10} /> Aperçu</>}
            </button>
          ))}
        </div>

        {/* Boutons de formatage — masqués en aperçu */}
        {mode === 'write' && (
          <>
            {tools.map((tool, i) =>
              'sep' in tool && tool.sep ? (
                <div key={i} className="w-px h-4 bg-gray-300 mx-1 shrink-0" />
              ) : (
                <button
                  key={i}
                  type="button"
                  title={(tool as ToolBtn).title}
                  onClick={(tool as ToolBtn).action}
                  className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors shrink-0"
                >
                  {(tool as ToolBtn).icon}
                </button>
              ),
            )}
          </>
        )}

        {/* Compteur de mots + bouton reset */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400">{wordCount} mot{wordCount > 1 ? 's' : ''}</span>
          {value && (
            <button
              type="button"
              title="Effacer tout"
              onClick={() => { if (confirm('Effacer tout le contenu ?')) onChange('') }}
              className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
            >
              <RotateCcw size={11} />
            </button>
          )}
        </div>
      </div>

      {/* ── Zone d'écriture ─────────────────────────────────────── */}
      {mode === 'write' ? (
        <textarea
          ref={taRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={minRows}
          spellCheck
          className={cn(
            'w-full px-5 py-4 text-sm text-gray-800 leading-7',
            'font-mono resize-y focus:outline-none bg-white',
            'placeholder:text-gray-400 placeholder:font-sans',
          )}
          style={{ minHeight: `${minRows * 1.75}rem` }}
        />
      ) : (
        <div className="min-h-[400px] px-5 py-4 bg-white">
          {value.trim() ? (
            <div
              className="prose prose-gray max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
            />
          ) : (
            <p className="text-gray-400 italic text-sm mt-4">
              Aucun contenu à prévisualiser — commencez à écrire dans l'onglet "Écrire".
            </p>
          )}
        </div>
      )}

      {/* ── Pied de l'éditeur : aide ──────────────────────────── */}
      {mode === 'write' && (
        <div className="px-5 py-2 border-t border-gray-100 bg-gray-50 flex flex-wrap gap-x-4 gap-y-0.5">
          {[
            ['**gras**', 'Ctrl+B'],
            ['_italique_', 'Ctrl+I'],
            ['[lien](url)', 'Ctrl+K'],
            ['# Titre', 'H1-H3'],
            ['`code`', 'inline'],
          ].map(([syntax, shortcut]) => (
            <span key={syntax} className="text-[10px] text-gray-400">
              <code className="font-mono">{syntax}</code>{' '}
              <span className="opacity-60">({shortcut})</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
