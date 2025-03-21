import express from "express";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";
import mongoose from "mongoose";
import morgan from "morgan";
import "dotenv/config"; 
//import dotenv from "dotenv";
import contactsRouter from "./routers/contactsRouter.js";
import errorHandler from "./middelwares/errorHandler.js";

export const setupServer = () => {
  //  dotenv.config(); 
  const app = express(); 
  app.use(cors());
  app.use(express.json());
  app.use(morgan("tiny"));
    
    //     const logger = pino({
    //     level: "info",
    //     transport: {
    //         target: "pino-pretty",
    //         options: { colorize: true }
    //     }
    // });

    // // Middleware логирования с исправлением ошибки
    // app.use(pinoHttp({
    //     logger,
    //     autoLogging: {
    //         ignorePaths: ["/"],
    //         ignore: (req, res) => res && res.statusCode === 404 // Проверяем, что res не undefined
    //     }
  // }));
  app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
  app.use("/api/contacts", contactsRouter);
  
    app.use(errorHandler);
    app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
  });
  
    app.use((err, req, res, next) => {
      const { status = 500, message = "Server error" } = err;
      res.status(status).json({ message });
    });

    
    const PORT = process.env.PORT || 3000;
    const MONGODB_URL = process.env.MONGODB_URL; 

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
  
