import { setupServer } from "./server.js";
import { initMongoConnection } from './db/initMongoConnection.js';
import 'dotenv/config';

const runApp = async () => {

  await initMongoConnection();

  setupServer();

};
runApp();
