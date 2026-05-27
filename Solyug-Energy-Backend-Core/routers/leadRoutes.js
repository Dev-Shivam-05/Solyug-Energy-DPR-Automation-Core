import express from "express";

import { createResidentialLead } from "../controllers/leadController.js";

const router = express.Router();

router.post("/leads", createResidentialLead);

export default router;
