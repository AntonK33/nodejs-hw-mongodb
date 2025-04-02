import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import errorHandler from './middelwares/errorHandler.js';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { notFoundRoute } from './middelwares/notFoundRoute.js';
import { UPLOAD_DIR } from './constants/index.js';

export const setupServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('tiny'));
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  
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

  app.use(router);
  app.use(errorHandler);
  app.use(notFoundRoute);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
  });

};
