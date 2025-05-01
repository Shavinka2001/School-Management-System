import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/AuthRoute.js"; // Make sure this path is correct

dotenv.config();
console.log("Loaded TOKEN_KEY:", process.env.TOKEN_KEY); // Debug line

const app = express();
const { MONGODB_URI, PORT } = process.env;

// MongoDB connection
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB is connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Correct CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 your frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // 👈 needed for cookies/auth
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/", authRoute);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
