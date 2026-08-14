import { z } from "zod";
import { Exercise } from "../models/Exercise.js";

const ExerciseQuerySchema = z.object({
  search: z.string().optional(),
  type: z.string().optional(),
  difficulty: z.string().optional(),
  muscle: z.string().optional(),
  isPopular: z.string().transform(val => val === 'true').optional()
});

export const getExercises = async (req, res) => {
  try {
    const validatedQuery = ExerciseQuerySchema.parse(req.query);
    const { search, type, difficulty, muscle, isPopular } = validatedQuery;

    const filter = {};
    
    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (muscle) filter.musclesWorked = muscle;
    if (typeof isPopular === 'boolean') filter.isPopular = isPopular;
    
    if (search) {
      filter.$text = { $search: search };
    }

    const exercises = await Exercise.find(filter)
      .sort({ isPopular: -1, name: 1 })
      .select('-animationData');

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: error.flatten().fieldErrors
      });
    }
    
    console.error("[Get Exercises Error]", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercises"
    });
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: "Exercise not found"
      });
    }

    res.status(200).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error("[Get Exercise Error]", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch exercise"
    });
  }
};

export const seedExercises = async (req, res) => {
  try {
    await Exercise.deleteMany({});

    const initialExercises = [
      // Yoga Poses
      {
        name: "Mountain Pose",
        sanskritName: "Tadasana",
        type: "Yoga Pose",
        difficulty: "Beginner",
        description: "The foundational standing pose in yoga, focusing on alignment, grounding, and building a strong base for all other poses.",
        steps: [
          "Stand with your feet together, toes pointing forward",
          "Engage your thigh muscles and lift your kneecaps slightly",
          "Roll your shoulders back and down, opening your chest",
          "Let your arms hang naturally at your sides, palms facing inward",
          "Lengthen the spine, keeping the neck in line with the rest of the body",
          "Gaze softly straight ahead"
        ],
        benefits: [
          "Improves posture and body awareness",
          "Strengthens thighs, knees, and ankles",
          "Tones abdomen and buttocks",
          "Improves balance and focus",
          "Calms the mind"
        ],
        precautions: [
          "Avoid if you have severe ankle injuries",
          "Use a wall for support if needed",
          "Keep knees soft, not locked"
        ],
        injuryRisks: ["Ankle strain if not aligned properly"],
        breathingTechnique: "Steady natural breathing through the nose, using diaphragmatic breaths",
        musclesWorked: ["Full Body", "Quads", "Core"],
        affectedRegions: ["Full Body"],
        durationSeconds: 60,
        calories: 5,
        equipment: ["Mat", "None"],
        tags: ["standing", "balance", "foundational", "beginner-friendly"],
        isPopular: true
      },
      {
        name: "Downward-Facing Dog",
        sanskritName: "Adho Mukha Svanasana",
        type: "Yoga Pose",
        difficulty: "Beginner",
        description: "An energizing inversion that stretches the entire back body, strengthens the arms and shoulders, and improves circulation.",
        steps: [
          "Start on your hands and knees in a tabletop position",
          "Tuck your toes and lift your hips toward the ceiling",
          "Straighten your legs as much as comfortable (knees can be bent)",
          "Press your palms firmly into the floor, spreading your fingers wide",
          "Lengthen the spine and let your head hang naturally",
          "Draw your shoulder blades down your back"
        ],
        benefits: [
          "Stretches shoulders, hamstrings, calves, and spine",
          "Strengthens arms, shoulders, and wrists",
          "Improves circulation and digestion",
          "Relieves back pain and tension",
          "Calms the nervous system"
        ],
        precautions: [
          "Modify with bent knees if hamstrings are tight",
          "Avoid if you have wrist injuries - use blocks under hands",
          "Avoid if you have high blood pressure",
          "Come down slowly if you feel dizzy"
        ],
        injuryRisks: ["Wrist strain", "Shoulder impingement if forced"],
        breathingTechnique: "Deep ujjayi breathing, inhaling to lengthen, exhaling to deepen the stretch",
        musclesWorked: ["Upper Back", "Lower Back", "Shoulders", "Triceps", "Hamstrings", "Calves"],
        affectedRegions: ["Upper Back", "Lower Back", "Shoulders", "Legs"],
        durationSeconds: 60,
        calories: 8,
        equipment: ["Mat", "Yoga Block"],
        tags: ["inversion", "stretching", "energizing", "full-body"],
        isPopular: true
      },
      {
        name: "Warrior I",
        sanskritName: "Virabhadrasana I",
        type: "Yoga Pose",
        difficulty: "Beginner",
        description: "A powerful standing pose that builds strength in the legs and core, while opening the chest and shoulders.",
        steps: [
          "From standing, step your left foot back about 3-4 feet",
          "Turn your left foot out slightly (about 45 degrees)",
          "Bend your right knee, aligning it over your ankle",
          "Square your hips and torso forward",
          "Raise your arms overhead, palms facing each other",
          "Gaze softly upward"
        ],
        benefits: [
          "Strengthens legs, ankles, and arms",
          "Stretches hips, groins, shoulders, and chest",
          "Improves focus and concentration",
          "Increases stamina and endurance",
          "Improves circulation"
        ],
        precautions: [
          "Avoid if you have knee injuries",
          "Keep front knee over ankle, not past toes",
          "Keep hips level and facing forward"
        ],
        injuryRisks: ["Knee strain if knee goes past toes"],
        breathingTechnique: "Steady breathing, exhale to sink deeper into the pose",
        musclesWorked: ["Glutes", "Quads", "Hamstrings", "Shoulders", "Core"],
        affectedRegions: ["Legs", "Hips", "Shoulders"],
        durationSeconds: 45,
        calories: 10,
        equipment: ["Mat", "None"],
        tags: ["standing", "strength", "balance", "hip-opener"],
        isPopular: true
      },
      {
        name: "Warrior II",
        sanskritName: "Virabhadrasana II",
        type: "Yoga Pose",
        difficulty: "Beginner",
        description: "A powerful standing pose that builds strength, stability, and focus. Opens the hips and chest while strengthening the legs.",
        steps: [
          "From standing, step your feet wide apart (about 3-4 feet)",
          "Turn your right foot out 90 degrees, left foot slightly in",
          "Bend your right knee, aligning it over your right ankle",
          "Extend your arms parallel to the floor, reaching out through the fingertips",
          "Gaze over your right middle finger",
          "Keep your hips open and torso upright"
        ],
        benefits: [
          "Strengthens legs, ankles, and arms",
          "Stretches hips, groins, shoulders, and chest",
          "Improves focus and concentration",
          "Increases stamina and endurance",
          "Improves circulation"
        ],
        precautions: [
          "Avoid if you have knee injuries",
          "Keep front knee over ankle, not past toes",
          "Keep hips level and facing forward"
        ],
        injuryRisks: ["Knee strain if knee goes past toes"],
        breathingTechnique: "Steady breathing, exhale to sink deeper into the pose",
        musclesWorked: ["Glutes", "Quads", "Hamstrings", "Shoulders", "Core"],
        affectedRegions: ["Legs", "Hips", "Shoulders"],
        durationSeconds: 45,
        calories: 10,
        equipment: ["Mat", "None"],
        tags: ["standing", "strength", "balance", "hip-opener"],
        isPopular: true
      },
      {
        name: "Tree Pose",
        sanskritName: "Vrksasana",
        type: "Yoga Pose",
        difficulty: "Beginner",
        description: "A balancing pose that improves focus, stability, and ankle strength while stretching the hips and inner thighs.",
        steps: [
          "Start in Mountain Pose",
          "Shift your weight to your right foot",
          "Place your left foot on your right inner thigh (avoid placing on the knee)",
          "Press your foot and thigh against each other",
          "Bring your hands to your heart center in prayer position",
          "Gaze at a fixed point in front of you to help with balance"
        ],
        benefits: [
          "Improves balance and coordination",
          "Strengthens ankles, knees, and thighs",
          "Stretches hips and inner thighs",
          "Calms the mind and improves focus",
          "Improves posture"
        ],
        precautions: [
          "Use a wall for support if needed",
          "Place foot on calf or ankle if thigh is too difficult",
          "Keep standing leg soft, not locked"
        ],
        injuryRisks: ["Ankle sprain if balance is lost"],
        breathingTechnique: "Slow, steady natural breathing",
        musclesWorked: ["Glutes", "Quads", "Core", "Ankles"],
        affectedRegions: ["Legs", "Hips"],
        durationSeconds: 30,
        calories: 6,
        equipment: ["Mat", "None"],
        tags: ["balance", "standing", "focus", "hip-opener"],
        isPopular: true
      },
      {
        name: "Cobra Pose",
        sanskritName: "Bhujangasana",
        type: "Yoga Pose",
        difficulty: "Beginner",
        description: "A gentle backbend that strengthens the spine, opens the chest, and improves posture.",
        steps: [
          "Lie on your stomach, legs extended behind you",
          "Place your hands on the floor under your shoulders",
          "Press your palms into the floor, lifting your chest off the mat",
          "Keep your elbows close to your sides",
          "Lengthen the front of your body",
          "Keep your hips and legs on the floor"
        ],
        benefits: [
          "Strengthens the spine and back muscles",
          "Opens the chest and shoulders",
          "Improves posture",
          "Relieves back pain",
          "Stimulates digestion"
        ],
        precautions: [
          "Avoid if you have back injuries",
          "Don't force the backbend - only lift as high as comfortable",
          "Keep hips grounded"
        ],
        injuryRisks: ["Lower back strain if forced"],
        breathingTechnique: "Inhale to lift, exhale to lower",
        musclesWorked: ["Upper Back", "Lower Back", "Chest", "Shoulders"],
        affectedRegions: ["Back", "Chest", "Shoulders"],
        durationSeconds: 30,
        calories: 7,
        equipment: ["Mat", "None"],
        tags: ["backbend", "strengthening", "posture"],
        isPopular: true
      },
      {
        name: "Child's Pose",
        sanskritName: "Balasana",
        type: "Yoga Pose",
        difficulty: "Beginner",
        description: "A resting pose that gently stretches the back, hips, and thighs while calming the nervous system. Perfect for relaxation between poses.",
        steps: [
          "Start on your hands and knees in a tabletop position",
          "Sit back onto your heels, knees wide, big toes touching",
          "Fold forward, resting your forehead on the floor",
          "Extend your arms forward, or rest them alongside your body",
          "Relax your shoulders and let your chest sink toward the floor"
        ],
        benefits: [
          "Relieves back pain and tension",
          "Stretches hips, thighs, and ankles",
          "Calms the nervous system and reduces stress",
          "Relieves fatigue",
          "Gently stretches the shoulders"
        ],
        precautions: [
          "Avoid if you have knee injuries",
          "Place a blanket under knees for comfort",
          "Place a pillow under your forehead if needed"
        ],
        injuryRisks: [],
        breathingTechnique: "Deep abdominal breathing, focusing on long, slow exhales",
        musclesWorked: ["Upper Back", "Lower Back", "Glutes"],
        affectedRegions: ["Back", "Hips"],
        durationSeconds: 90,
        calories: 3,
        equipment: ["Mat", "Yoga Strap"],
        tags: ["resting", "gentle", "relaxation", "beginner-friendly"],
        isPopular: true
      },
      {
        name: "Cat-Cow Pose",
        sanskritName: "Marjaryasana-Bitilasana",
        type: "Yoga Pose",
        difficulty: "Beginner",
        description: "A gentle spinal twist that alternates between flexion and extension, improving spinal mobility and relieving back tension.",
        steps: [
          "Start on your hands and knees in a tabletop position",
          "Inhale, lift your head and tailbone, letting your belly drop (Cow Pose)",
          "Exhale, tuck your chin and tailbone, rounding your back (Cat Pose)",
          "Continue alternating between the two poses",
          "Move slowly and with your breath"
        ],
        benefits: [
          "Improves spinal mobility",
          "Relieves back pain and tension",
          "Stretches the back and neck",
          "Strengthens the core",
          "Calms the mind"
        ],
        precautions: [
          "Avoid if you have severe back injuries",
          "Move slowly and gently"
        ],
        injuryRisks: [],
        breathingTechnique: "Inhale for Cow, exhale for Cat",
        musclesWorked: ["Upper Back", "Lower Back", "Core"],
        affectedRegions: ["Back", "Spine"],
        durationSeconds: 60,
        calories: 5,
        equipment: ["Mat", "None"],
        tags: ["mobility", "spine", "warm-up"],
        isPopular: true
      },
      {
        name: "Bridge Pose",
        sanskritName: "Setu Bandhasana",
        type: "Yoga Pose",
        difficulty: "Beginner",
        description: "A gentle backbend that strengthens the glutes, legs, and core, while opening the chest and shoulders.",
        steps: [
          "Lie on your back, knees bent, feet flat on the floor",
          "Place your arms alongside your body, palms down",
          "Inhale, lift your hips toward the ceiling",
          "Clasp your hands under your back if comfortable",
          "Lengthen your spine",
          "Exhale, lower your hips back to the floor"
        ],
        benefits: [
          "Strengthens glutes, legs, and core",
          "Opens the chest and shoulders",
          "Improves posture",
          "Relieves back pain",
          "Calms the mind"
        ],
        precautions: [
          "Avoid if you have neck or back injuries",
          "Use a block under your sacrum for support if needed"
        ],
        injuryRisks: ["Neck strain if not aligned properly"],
        breathingTechnique: "Inhale to lift, exhale to lower",
        musclesWorked: ["Glutes", "Hamstrings", "Core", "Chest"],
        affectedRegions: ["Legs", "Hips", "Chest", "Spine"],
        durationSeconds: 45,
        calories: 8,
        equipment: ["Mat", "Yoga Block"],
        tags: ["backbend", "strength", "glutes"],
        isPopular: true
      },
      {
        name: "Triangle Pose",
        sanskritName: "Trikonasana",
        type: "Yoga Pose",
        difficulty: "Beginner",
        description: "A standing pose that stretches the legs, hips, and spine, while strengthening the core and improving balance.",
        steps: [
          "From standing, step your feet wide apart (about 3-4 feet)",
          "Turn your right foot out 90 degrees, left foot slightly in",
          "Inhale, extend your arms parallel to the floor",
          "Exhale, reach your right hand toward your right shin, ankle, or floor",
          "Extend your left arm toward the ceiling",
          "Gaze up at your left hand"
        ],
        benefits: [
          "Stretches legs, hips, and spine",
          "Strengthens core and legs",
          "Improves balance and posture",
          "Relieves back pain",
          "Stimulates digestion"
        ],
        precautions: [
          "Avoid if you have back injuries",
          "Use a block under your hand if you can't reach the floor",
          "Keep your spine straight"
        ],
        injuryRisks: ["Lower back strain if not aligned properly"],
        breathingTechnique: "Steady, deep breathing",
        musclesWorked: ["Quads", "Hamstrings", "Glutes", "Core"],
        affectedRegions: ["Legs", "Hips", "Spine"],
        durationSeconds: 45,
        calories: 9,
        equipment: ["Mat", "Yoga Block"],
        tags: ["standing", "stretching", "balance"],
        isPopular: true
      },
      
      // Gym / Calisthenics Exercises
      {
        name: "Push-Up",
        type: "Calisthenics",
        difficulty: "Beginner",
        description: "The classic bodyweight exercise for building upper body strength. Works the chest, shoulders, and triceps while engaging the core.",
        steps: [
          "Start in a high plank position, hands slightly wider than shoulder-width",
          "Keep your body in a straight line from head to heels",
          "Lower your chest toward the floor",
          "Push back up to the starting position",
          "Keep your core engaged throughout"
        ],
        benefits: [
          "Strengthens chest, shoulders, and triceps",
          "Engages and strengthens the core",
          "Improves upper body endurance",
          "Builds functional strength",
          "Can be done anywhere without equipment"
        ],
        precautions: [
          "Modify on knees if full push-ups are too difficult",
          "Keep your body in a straight line, don't let hips sag or rise",
          "Start with fewer reps and build up"
        ],
        injuryRisks: ["Shoulder pain", "Wrist strain"],
        breathingTechnique: "Inhale on the way down, exhale on the way up",
        musclesWorked: ["Chest", "Shoulders", "Triceps", "Core"],
        affectedRegions: ["Chest", "Shoulders", "Arms", "Core"],
        sets: 3,
        reps: 12,
        restSeconds: 60,
        calories: 20,
        equipment: ["Bodyweight", "None"],
        tags: ["bodyweight", "upper-body", "core", "strength"],
        isPopular: true
      },
      {
        name: "Bench Press",
        type: "Gym Exercise",
        difficulty: "Intermediate",
        description: "The classic chest exercise. Builds strength in the chest, shoulders, and triceps while improving upper body pushing power.",
        steps: [
          "Lie flat on a bench, feet firmly on the floor",
          "Grip the bar slightly wider than shoulder-width",
          "Unrack the bar and hold it directly over your chest",
          "Lower the bar slowly to your mid-chest",
          "Press the bar back up to the starting position",
          "Keep your back flat on the bench, shoulders pinned down"
        ],
        benefits: [
          "Builds chest, shoulders, and triceps",
          "Improves upper body strength and power",
          "Increases muscle mass in the upper body",
          "Enhances pushing strength for daily activities",
          "Improves bone density in the upper body"
        ],
        precautions: [
          "Always use a spotter for heavy sets",
          "Don't arch your back excessively",
          "Control the bar on the way down",
          "Start with light weight to learn proper form"
        ],
        injuryRisks: ["Shoulder injury", "Wrist strain", "Chest muscle strain"],
        breathingTechnique: "Exhale on the press, inhale on the way down",
        musclesWorked: ["Chest", "Shoulders", "Triceps"],
        affectedRegions: ["Chest", "Shoulders", "Arms"],
        sets: 4,
        reps: 10,
        restSeconds: 90,
        calories: 35,
        equipment: ["Barbell", "Bench"],
        tags: ["chest", "upper-body", "strength", "barbell"],
        isPopular: true
      },
      {
        name: "Barbell Squat",
        type: "Gym Exercise",
        difficulty: "Intermediate",
        description: "The king of all lower body exercises. Builds overall leg strength, core stability, and functional movement patterns.",
        steps: [
          "Position the barbell across your upper back, not on your neck",
          "Step back from the rack, feet shoulder-width apart, toes slightly turned out",
          "Engage your core, keep your chest up",
          "Bend at the hips and knees, lowering your body as if sitting in a chair",
          "Go down until your thighs are at least parallel to the floor",
          "Push through your heels to stand back up"
        ],
        benefits: [
          "Builds quadriceps, hamstrings, and glutes",
          "Strengthens core and back",
          "Improves functional strength and mobility",
          "Increases testosterone and growth hormone",
          "Burns a lot of calories"
        ],
        precautions: [
          "Keep your back straight and chest up throughout",
          "Knees should track over toes, not collapse inward",
          "Start with light weight to master form",
          "Have a spotter when lifting heavy"
        ],
        injuryRisks: ["Lower back injury", "Knee pain", "Shoulder strain"],
        breathingTechnique: "Inhale on the way down, exhale on the way up",
        musclesWorked: ["Quads", "Hamstrings", "Glutes", "Core", "Lower Back"],
        affectedRegions: ["Legs", "Core", "Back"],
        sets: 4,
        reps: 8,
        restSeconds: 120,
        calories: 40,
        equipment: ["Barbell", "Mat"],
        tags: ["leg-day", "compound", "strength", "barbell"],
        isPopular: true
      },
      {
        name: "Deadlift",
        type: "Gym Exercise",
        difficulty: "Advanced",
        description: "The ultimate full-body exercise. Builds strength in the legs, back, core, and grip. Develops functional movement patterns.",
        steps: [
          "Stand with your feet shoulder-width apart, barbell over mid-foot",
          "Hinge at the hips, bend your knees, and grip the bar with an overhand grip",
          "Keep your back straight, chest up",
          "Lift the bar by extending your hips and knees",
          "Stand tall, then lower the bar back to the floor with control"
        ],
        benefits: [
          "Builds full-body strength",
          "Strengthens back, legs, core, and grip",
          "Improves functional movement patterns",
          "Increases muscle mass",
          "Burns a lot of calories"
        ],
        precautions: [
          "Keep your back straight at all times",
          "Start with light weight to learn proper form",
          "Avoid rounding your back",
          "Use proper form to avoid injury"
        ],
        injuryRisks: ["Lower back injury", "Knee pain", "Shoulder strain"],
        breathingTechnique: "Inhale before lifting, exhale as you lift",
        musclesWorked: ["Full Body", "Quads", "Hamstrings", "Glutes", "Lower Back", "Core"],
        affectedRegions: ["Full Body", "Legs", "Back", "Core"],
        sets: 4,
        reps: 6,
        restSeconds: 180,
        calories: 50,
        equipment: ["Barbell"],
        tags: ["full-body", "compound", "strength", "barbell"],
        isPopular: true
      },
      {
        name: "Plank",
        type: "Calisthenics",
        difficulty: "Beginner",
        description: "A core strengthening exercise that builds stability in the abs, shoulders, and lower back.",
        steps: [
          "Start in a high plank position, hands under shoulders",
          "Keep your body in a straight line from head to heels",
          "Engage your core",
          "Hold the position"
        ],
        benefits: [
          "Strengthens the core",
          "Improves posture",
          "Strengthens shoulders and wrists",
          "Improves balance and stability",
          "Reduces lower back pain"
        ],
        precautions: [
          "Modify on knees if full plank is too difficult",
          "Keep your body in a straight line"
        ],
        injuryRisks: ["Shoulder pain", "Wrist strain"],
        breathingTechnique: "Steady natural breathing",
        musclesWorked: ["Core", "Shoulders", "Abs", "Obliques"],
        affectedRegions: ["Core", "Shoulders"],
        durationSeconds: 60,
        calories: 10,
        equipment: ["Bodyweight", "None"],
        tags: ["core", "strength", "balance"],
        isPopular: true
      },
      {
        name: "Bicep Curl",
        type: "Gym Exercise",
        difficulty: "Beginner",
        description: "A classic upper-body exercise that targets the biceps and forearms, improving arm strength and definition.",
        steps: [
          "Stand with feet shoulder-width apart, dumbbells in hands at sides",
          "Engage your core, keep your chest up",
          "Curl the dumbbells up toward your shoulders",
          "Lower them back down with control"
        ],
        benefits: [
          "Strengthens biceps and forearms",
          "Improves grip strength",
          "Increases muscle mass in the arms",
          "Enhances functional strength for daily activities"
        ],
        precautions: [
          "Keep your elbows close to your sides",
          "Use a weight you can control",
          "Avoid swinging the weights"
        ],
        injuryRisks: ["Shoulder pain", "Elbow pain"],
        breathingTechnique: "Exhale on the curl, inhale on the way down",
        musclesWorked: ["Biceps", "Forearms"],
        affectedRegions: ["Arms"],
        sets: 3,
        reps: 15,
        restSeconds: 60,
        calories: 15,
        equipment: ["Dumbbells"],
        tags: ["arms", "strength", "dumbbell"],
        isPopular: true
      },
      {
        name: "Tricep Extension",
        type: "Gym Exercise",
        difficulty: "Beginner",
        description: "An upper-body exercise that targets the triceps, improving arm strength and definition.",
        steps: [
          "Stand or sit tall, holding a dumbbell with both hands overhead",
          "Keep your elbows close to your head",
          "Lower the dumbbell behind your head",
          "Extend your arms back up"
        ],
        benefits: [
          "Strengthens triceps",
          "Improves upper body strength",
          "Increases muscle mass in the arms",
          "Enhances pushing strength"
        ],
        precautions: [
          "Keep your elbows close to your head",
          "Use a weight you can control",
          "Avoid arching your back"
        ],
        injuryRisks: ["Shoulder pain", "Elbow pain"],
        breathingTechnique: "Exhale on the extension, inhale on the way down",
        musclesWorked: ["Triceps"],
        affectedRegions: ["Arms"],
        sets: 3,
        reps: 12,
        restSeconds: 60,
        calories: 12,
        equipment: ["Dumbbells"],
        tags: ["arms", "strength", "dumbbell"],
        isPopular: true
      },
      {
        name: "Crunch",
        type: "Calisthenics",
        difficulty: "Beginner",
        description: "A classic core exercise that targets the abdominal muscles.",
        steps: [
          "Lie on your back, knees bent, feet flat on the floor",
          "Place your hands behind your head or crossed on your chest",
          "Engage your core, lift your upper body off the floor",
          "Lower back down with control"
        ],
        benefits: [
          "Strengthens the abs",
          "Improves core stability",
          "Increases muscle mass in the abdominal region"
        ],
        precautions: [
          "Don't pull on your neck",
          "Keep your lower back on the floor",
          "Move slowly and with control"
        ],
        injuryRisks: ["Neck strain"],
        breathingTechnique: "Exhale on the lift, inhale on the way down",
        musclesWorked: ["Abs"],
        affectedRegions: ["Core"],
        sets: 3,
        reps: 20,
        restSeconds: 45,
        calories: 8,
        equipment: ["Bodyweight", "Mat"],
        tags: ["core", "abs", "strength"],
        isPopular: true
      },
      
      // Stretching Exercises
      {
        name: "Hamstring Stretch (Seated)",
        type: "Stretching",
        difficulty: "Beginner",
        description: "A classic stretch targeting the hamstrings and lower back. Perfect for improving flexibility in the posterior chain.",
        steps: [
          "Sit on the floor with one leg extended straight",
          "Bend the other knee, placing the sole of the foot against your inner thigh",
          "Lengthen your spine, reach forward with both hands",
          "Reach toward your toes without rounding your back",
          "Hold the stretch for 30-60 seconds",
          "Switch sides"
        ],
        benefits: [
          "Stretches hamstrings and glutes",
          "Improves flexibility in the lower back",
          "Reduces risk of hamstring injury",
          "Improves posture",
          "Relieves tension in the lower back"
        ],
        precautions: [
          "Don't bounce or force the stretch",
          "Keep your back straight, don't round forward",
          "If you can't reach your toes, reach as far as comfortable"
        ],
        injuryRisks: ["Lower back strain if stretched too aggressively"],
        breathingTechnique: "Deep, steady breathing, exhale to deepen the stretch",
        musclesWorked: ["Hamstrings", "Lower Back", "Glutes"],
        affectedRegions: ["Legs", "Lower Back"],
        durationSeconds: 60,
        calories: 2,
        equipment: ["Mat", "Yoga Strap"],
        tags: ["flexibility", "lower-body", "cool-down"],
        isPopular: true
      },
      {
        name: "Hip Flexor Stretch",
        type: "Stretching",
        difficulty: "Beginner",
        description: "A stretch targeting the hip flexors, important for maintaining good posture and reducing back pain.",
        steps: [
          "Start in a lunge position with your back knee on the floor",
          "Engage your core, keep your torso upright",
          "Slightly push your hips forward",
          "Hold the stretch for 30-60 seconds",
          "Switch sides"
        ],
        benefits: [
          "Stretches the hip flexors",
          "Improves hip mobility",
          "Reduces lower back pain",
          "Improves posture"
        ],
        precautions: [
          "Keep your torso upright",
          "Don't let your front knee go past your toes"
        ],
        injuryRisks: [],
        breathingTechnique: "Deep, steady breathing",
        musclesWorked: ["Hip Flexors"],
        affectedRegions: ["Hips"],
        durationSeconds: 60,
        calories: 2,
        equipment: ["Mat", "None"],
        tags: ["flexibility", "hips", "cool-down"],
        isPopular: true
      },
      {
        name: "Neck Stretch",
        type: "Stretching",
        difficulty: "Beginner",
        description: "A gentle stretch targeting the neck muscles, perfect for relieving tension and improving mobility.",
        steps: [
          "Sit or stand tall",
          "Tilt your head to the right, bringing your ear toward your shoulder",
          "Hold the stretch for 15-30 seconds",
          "Switch sides",
          "Tilt your head forward, bringing your chin toward your chest",
          "Tilt your head back, looking up toward the ceiling"
        ],
        benefits: [
          "Relieves neck tension",
          "Improves neck mobility",
          "Reduces stress",
          "Improves posture"
        ],
        precautions: [
          "Don't force the stretch",
          "Move slowly and gently"
        ],
        injuryRisks: [],
        breathingTechnique: "Steady natural breathing",
        musclesWorked: ["Neck"],
        affectedRegions: ["Neck"],
        durationSeconds: 30,
        calories: 1,
        equipment: ["None"],
        tags: ["flexibility", "neck", "cool-down"],
        isPopular: true
      },
      {
        name: "Chest Stretch",
        type: "Stretching",
        difficulty: "Beginner",
        description: "A stretch targeting the chest muscles, perfect for improving posture and relieving shoulder tension.",
        steps: [
          "Stand in a doorway or use a wall",
          "Place your forearms on the doorframe or wall, elbows at 90 degrees",
          "Step forward slightly, feeling the stretch in your chest",
          "Hold the stretch for 30-60 seconds"
        ],
        benefits: [
          "Stretches the chest muscles",
          "Improves posture",
          "Relieves shoulder tension",
          "Reduces risk of shoulder injury"
        ],
        precautions: [
          "Don't force the stretch",
          "Keep your shoulders relaxed"
        ],
        injuryRisks: [],
        breathingTechnique: "Deep, steady breathing",
        musclesWorked: ["Chest"],
        affectedRegions: ["Chest", "Shoulders"],
        durationSeconds: 60,
        calories: 2,
        equipment: ["None"],
        tags: ["flexibility", "chest", "cool-down"],
        isPopular: true
      }
    ];

    const seeded = await Exercise.insertMany(initialExercises);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${seeded.length} exercises!`,
      count: seeded.length,
      data: seeded
    });
  } catch (error) {
    console.error("[Seed Exercises Error]", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed exercises",
      error: error.message
    });
  }
};
