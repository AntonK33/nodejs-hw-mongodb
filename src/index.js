import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
import "dotenv/config";
import express from "express";

const runApp = async () => {

    setupServer();

    await initMongoConnection();
    
};
runApp();