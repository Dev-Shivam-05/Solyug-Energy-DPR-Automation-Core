// Import Express router factory to create modular route handlers
import express from 'express';

// Import the controller function that handles lead creation logic
import { createResidentialLead } from '../controllers/leadController.js';

// Initialize a new Express router instance (modular, reusable route container)
const router = express.Router();

// Define POST route for /api/v1/leads
// This endpoint is the entry point for all new solar lead submissions
// Method: POST | Path: /api/v1/leads | Body: JSON matching SolarIntakeSchema
router.post('/leads', createResidentialLead);

// Export the router to be mounted in the main app (index.js)
export default router;