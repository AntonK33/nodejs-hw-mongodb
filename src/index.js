import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import 'dotenv/config';

const runApp = async () => {
  setupServer();

  await initMongoConnection();
};
runApp();
