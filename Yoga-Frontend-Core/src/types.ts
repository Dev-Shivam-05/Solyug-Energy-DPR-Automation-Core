export type MuscleGroup =
  | "Neck"
  | "Shoulders"
  | "Chest"
  | "Upper Back"
  | "Lower Back"
  | "Biceps"
  | "Triceps"
  | "Forearms"
  | "Abs"
  | "Obliques"
  | "Core"
  | "Glutes"
  | "Quads"
  | "Hamstrings"
  | "Calves"
  | "Hip Flexors"
  | "Adductors"
  | "Abductors"
  | "Full Body"
  | "Lats"
  | "Traps";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ExerciseType =
  | "Yoga Pose"
  | "Asana"
  | "Gym Exercise"
  | "Stretching"
  | "Rehabilitation"
  | "Mobility"
  | "Calisthenics";

export type Equipment =
  | "None"
  | "Bodyweight"
  | "Mat"
  | "Dumbbells"
  | "Barbell"
  | "Kettlebell"
  | "Resistance Band"
  | "Bench"
  | "Pull-Up Bar"
  | "Yoga Block"
  | "Yoga Strap";

export interface Exercise {
  _id: string;
  name: string;
  sanskritName?: string;
  type: ExerciseType;
  difficulty: Difficulty;
  description: string;
  steps: string[];
  benefits: string[];
  precautions: string[];
  injuryRisks: string[];
  breathingTechnique?: string;
  musclesWorked: MuscleGroup[];
  affectedRegions: MuscleGroup[];
  durationSeconds: number;
  sets?: number;
  reps?: number;
  restSeconds?: number;
  calories?: number;
  equipment?: Equipment[];
  animationId?: string;
  animationData?: any;
  tags: string[];
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}
