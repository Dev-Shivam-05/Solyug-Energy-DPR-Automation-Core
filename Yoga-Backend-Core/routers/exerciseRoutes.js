import express from "express";
import { getExercises, getExerciseById, seedExercises } from "../controllers/exerciseController.js";

const router = express.Router();

router.get("/exercises", getExercises);
router.get("/exercises/seed", seedExercises); // Note: In production, protect this route!
router.get("/exercises/:id", getExerciseById);

export default router;
