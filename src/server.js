import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';
import errorHandler from './middelwares/errorHandler.js';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { notFoundRoute } from './middelwares/notFoundRoute.js';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerUIExptess from 'swagger-ui-express';

export const setupServer = () => {
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve('docs', 'swagger.json'), 'utf-8'),
  );
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('tiny'));
  app.use(cookieParser());
  app.use(
    '/api-docs',
    swaggerUIExptess.serve,
    swaggerUIExptess.setup(swaggerDocument),
  );
  app.use('/uploads', express.static(UPLOAD_DIR));
  //app.use('/api-docs', swaggerDocs());

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
