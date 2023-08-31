// Importing packages
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;

// Middlewares
app.use(express.json());
app.use(cors());

// Use API routes

// Start Server
app.listen(PORT, () => {
  console.log(`___________________________________________`);
  console.log(`Server is up and running on port ${PORT} 🚀`);
});

// MQTT Setup
