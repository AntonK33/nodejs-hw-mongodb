import mongoose from "mongoose";
import "dotenv/config"; 

const { MONGODB_URL } = process.env; 

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔥 Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Выход из процесса при ошибке
  }
};
