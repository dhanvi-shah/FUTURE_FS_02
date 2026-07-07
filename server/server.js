import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { env, corsOrigins } from './config/env.js';
import authRouter from './routers/authRouter.js';
import leadRouter from './routers/leadRouter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { seedIfEmpty } from './seed/seedIfEmpty.js';

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      if (env.isDev && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Mini CRM API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/leads', leadRouter);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  await seedIfEmpty();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
};

start();
