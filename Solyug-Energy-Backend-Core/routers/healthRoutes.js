import express from 'express';
import { SolarLead } from '../models/SolarLead.js';

const healthRouter = express.Router();

healthRouter.get('/health', async (req, res) => {
  try {
    // Test MongoDB connection with a lightweight ping
    await SolarLead.db.admin().ping();
    res.status(200).json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

export default healthRouter;
