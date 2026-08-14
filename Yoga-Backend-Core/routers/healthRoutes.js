import express from "express";
import mongoose from "mongoose";

const healthRouter = express.Router();

healthRouter.get("/health", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: "unhealthy",
        database: "disconnected",
        error: "MongoDB connection not ready",
        readyState: mongoose.connection.readyState
      });
    }
    await mongoose.connection.db.admin().ping();
    res.status(200).json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
    });
  }
});

export default healthRouter;
