import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users/", usersRoutes)
app.use("/api/auth", authRoutes);
app.get("/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState });
});

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  app.listen(PORT, () => {
    console.log(`✅ API running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("❌ Failed to start:", err.message);
  process.exit(1);
});
