import cors from 'cors';
import express from 'express';

import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { adminRoutes } from './modules/admin/admin.routes.js';
import { eventbriteImportRoutes } from './modules/admin/eventbrite/eventbrite-import.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { categoriesRoutes } from './modules/categories/categories.routes.js';
import { eventsRoutes } from './modules/events/events.routes.js';
import { newsletterRoutes } from './modules/newsletter/newsletter.routes.js';
import axios from 'axios';

const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());

app.use((req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    // eslint-disable-next-line no-console
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - started}ms)`);
  });
  next();
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get('/api/test-eventbrite', async (_req, res) => {
  try {
    const response = await axios.get(
      'https://www.eventbriteapi.com/v3/organizations/',
      {
        headers: {
          Authorization: `Bearer ${process.env.EVENTBRITE_API_TOKEN}`,
        },
      },
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', eventbriteImportRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use(errorHandler);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${env.PORT}`);
  // eslint-disable-next-line no-console
  console.log('Request logs appear below when the frontend calls /api/*');
});
