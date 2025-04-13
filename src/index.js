import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
// import { bootstrap } from './bootstrap/bootstrap.js';
import 'dotenv/config';

// const runApp = async () => {
//   await initMongoConnection();
//   void bootstrap();
//   setupServer();
// };
// runApp();

//import { initMongoDB } from './db/initMongoDB.js';
//import { startServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

export const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

void bootstrap();
