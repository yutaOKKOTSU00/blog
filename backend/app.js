import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { sequelize } from './models/index.js';
import postsRouter from './routes/post.js';
import usersRouter from './routes/user.js';
import commentsRouter from './routes/comment.js';

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(morgan('dev'));
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
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
    console.error('Failed to sync database (first pass):', error);

    if (error.name === 'SequelizeUnknownConstraintError') {
      console.log('Retrying sync with force: true to recover schema conflict.');
      try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized with force: true');
      } catch (forceError) {
        console.error('Failed forced sync database:', forceError);
      }
    }
  }
}

app.get('/', (req, res) => {
  res.json({ message: 'welcome to the Blog ' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(` Server running on http://localhost:${PORT}`);
  await initDb();
});
