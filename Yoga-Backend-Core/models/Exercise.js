import mongoose from "mongoose";

const muscleGroupEnum = [
  "Neck", "Shoulders", "Chest", "Upper Back", "Lower Back", 
  "Biceps", "Triceps", "Forearms", "Abs", "Obliques", "Core",
  "Glutes", "Quads", "Hamstrings", "Calves", "Hip Flexors", 
  "Adductors", "Abductors", "Full Body", "Lats", "Traps"
];

const difficultyEnum = ["Beginner", "Intermediate", "Advanced"];

const exerciseTypeEnum = [
  "Yoga Pose", "Asana", "Gym Exercise", "Stretching", 
  "Rehabilitation", "Mobility", "Calisthenics"
];

const equipmentEnum = [
  "None", "Bodyweight", "Mat", "Dumbbells", "Barbell", "Kettlebell", 
  "Resistance Band", "Bench", "Pull-Up Bar", "Yoga Block", "Yoga Strap"
];

const ExerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    sanskritName: {
      type: String,
      trim: true,
      default: null
    },
    type: {
      type: String,
      enum: exerciseTypeEnum,
      required: true,
      index: true
    },
    difficulty: {
      type: String,
      enum: difficultyEnum,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    steps: [{
      type: String,
      required: true
    }],
    benefits: [{
      type: String,
      required: true
    }],
    precautions: [{
      type: String,
      default: []
    }],
    injuryRisks: [{
      type: String,
      default: []
    }],
    breathingTechnique: {
      type: String,
      default: null
    },
    musclesWorked: [{
      type: String,
      enum: muscleGroupEnum,
      required: true
    }],
    affectedRegions: [{
      type: String,
      enum: muscleGroupEnum,
      default: []
    }],
    durationSeconds: {
      type: Number,
      default: 30
    },
    sets: {
      type: Number,
      default: null
    },
    reps: {
      type: Number,
      default: null
    },
    restSeconds: {
      type: Number,
      default: 60
    },
    calories: {
      type: Number,
      default: 0
    },
    equipment: [{
      type: String,
      enum: equipmentEnum,
      default: ["None"]
    }],
    animationId: {
      type: String,
      default: null
    },
    animationData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    tags: [{
      type: String,
      index: true
    }],
    isPopular: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

ExerciseSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const Exercise = mongoose.model("Exercise", ExerciseSchema);
