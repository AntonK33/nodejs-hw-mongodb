import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import "dotenv/config"; 
import contactsRouter from "./routers/contactsRouter.js";
import errorHandler from "./middelwares/errorHandler.js";

export const setupServer = () => {
  //  dotenv.config(); 
  const app = express(); 
  app.use(cors());
  app.use(express.json());
  app.use(morgan("tiny"));
    
    app.get("/", (req, res) => {
    res.json({ message: "Server is running. Use /api/contacts for data." });
    });
  
  app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
  });
  app.use((req, res, next) => {
  req.url = req.url.trim(); 
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








