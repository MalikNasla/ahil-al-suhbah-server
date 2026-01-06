import express from "express";

const app = express();

// Lets the server read JSON bodies later when we add POST routes
app.use(express.json());

// A simple health check so we know the server is running
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

export default app;
