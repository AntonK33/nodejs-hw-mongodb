import express from "express";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";
import mongoose from "mongoose";
import "dotenv/config"; 
im contactsRouter

export const setupServer = () => {
    
    const app = express();

    const PORT = process.env.PORT || 3000;
    const MONGODB_URL = process.env.
    app.use(cors());
    app.use(express.json());
    app.use(express.json());
        const logger = pino({
        transport: {
        target: "pino-pretty",
        options: { colorize: true }
        }
    });
    app.use(pinoHttp({ logger }));
    app.use("/api/contacts", contactsRouter);
    app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
    });

    mongoose.connect(MONGODB_URL)
     .then(() => {
        console.log('Database connection successful');
        app.listen(PORT, () => {
        console.log(`Server is running. Use our API on port: ${PORT}`);
    });
    })
    .catch(error => {
        console.log(error.message);
        process.exit(1);
    });

};







// app.use((err, req, res, next) => {
//   const { status = 500, message = "Server error" } = err;
//   res.status(status).json({ message });
// });

// const { MONGODB_DB, PORT } = process.env;

// mongoose.connect(MONGODB_DB)
//   .then(() => {
//     console.log('Database connection successful');
//     app.listen(PORT, () => {
//     console.log(`Server is running. Use our API on port: ${PORT}`);
// });
//   })
//   .catch(error => {
//     console.log(error.message);
//     process.exit(1);
//   })
//     ;
  
