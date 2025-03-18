import mongoose from "mongoose";
import "dotenv/config"; 

const { MONGO_URL } = process.env; 

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔥 Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Выход из процесса при ошибке
  }
};
