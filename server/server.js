import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { validateProductionEnv } from './config/env.js';
import { isOriginAllowed } from './config/cors.js';
import authRouter from './routers/authRouter.js';
import leadRouter from './routers/leadRouter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { seedIfEmpty } from './seed/seedIfEmpty.js';

const PORT = Number(process.env.PORT) || 5001;
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }

      console.warn(`CORS blocked for origin: ${origin}`);
      callback(null, false);
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
  validateProductionEnv();
  await connectDB();
  await seedIfEmpty();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
