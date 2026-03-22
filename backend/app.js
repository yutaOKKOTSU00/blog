import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { sequelize } from './models/index.js';
import postsRouter from './routes/post.js';
import usersRouter from './routes/user.js';
import commentsRouter from './routes/comment.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postsRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', commentsRouter);
app.use('/api/comments', commentsRouter);

async function initDb() {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Failed to sync database:', error);
  }
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initDb();
});