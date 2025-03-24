import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import "dotenv/config";
import express from "express";

const runApp = async () => {
    
    setupServer();

    const app = express();
    await initMongoConnection(); // Подключение к базе
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port: ${PORT}`);
         });
    };
runApp();