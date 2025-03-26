import express from 'express';
import cors from 'cors';

import morgan from 'morgan';
import 'dotenv/config';
import contactsRouter from './routers/contactsRouter.js';
import errorHandler from './middelwares/errorHandler.js';
import notFoundHandler from './middelwares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('tiny'));

  app.get('/', (req, res) => {
    res.json({ message: 'Server is running. Use /api/contacts for data.' });
  });

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  app.use((req, res, next) => {
    req.url = req.url.trim();
    next();
  });

  app.use('/contacts', contactsRouter);

  app.use(errorHandler);
  app.use(notFoundHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
  });
};
