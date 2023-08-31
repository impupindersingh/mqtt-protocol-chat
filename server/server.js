// Importing packages
import express from "express";
import mongoose from "mongoose";
import mqttConfig from "./utils/mqtt.js";
import apiRoutes from "./routes/api.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connection to MongoDB is established 🤝");
});

// Middlewares
app.use(express.json());
app.use(cors());

// Use API routes
app.use("/api", apiRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`___________________________________________`);
  console.log(`Made with ❤  by Ashish`);
  console.log(`___________________________________________`);
  console.log(`Server is up and running on port ${PORT} 🚀`);
});

// MQTT Setup
mqttConfig.getClient();
