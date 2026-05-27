// Import Zod for runtime validation of incoming request payloads
import { z } from "zod";

// Import the Mongoose model for interacting with the SolarLead collection
import { SolarLead } from "../models/SolarLead.js";

// Import the pure function that calculates solar metrics from raw inputs
import { calculateSolarMetrics } from "../utils/solarMath.js";

// Import the background dispatcher that handles async email/n8n tasks
import { dispatchBackgroundTasks } from "../services/backgroundDispatcher.js";

// ============================================================================
// STEP 1: DEFINE THE VALIDATION SCHEMA (Zod)
// This acts as the "gatekeeper" - no invalid data proceeds beyond this point
// ============================================================================
const SolarIntakeSchema = z.object({
  // Client identity fields - all required, with basic format constraints
  clientName: z.string().min(2, "Name must be at least 2 characters").max(100),
  phoneNumber: z
    .string()
    .regex(/^\+91[6-9]\d{9}$/, "Phone must be Indian format: +919876543210"),
  email: z.string().email("Please enter a valid email address"),

  // Location fields - required for regional subsidy/tariff calculations later
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State name is required"),
  roofOwnership: z.enum(["Own", "Rented"], {
    errorMap: () => ({
      message: "Roof ownership must be either 'Own' or 'Rented'",
    }),
  }),

  // Structural inputs - the raw numbers that drive the solar math engine
  monthlyBill: z
    .number()
    .positive("Monthly bill must be greater than zero")
    .max(100000, "Bill amount seems unrealistically high"),
  roofAreaSqFt: z
    .number()
    .positive("Roof area must be greater than zero")
    .max(10000, "Roof area seems unrealistically large for residential"),
});

// ============================================================================
// STEP 2: THE MAIN CONTROLLER FUNCTION
// This is the "brain" of the intake pipeline: validate → compute → persist → respond → dispatch
// ============================================================================
export const createResidentialLead = async (req, res) => {
  // Wrap entire logic in try/catch to handle unexpected errors gracefully
  try {
    // ------------------------------------------------------------------------
    // A. VALIDATE INCOMING PAYLOAD (Fail fast, before any business logic)
    // ------------------------------------------------------------------------
    // .parse() throws a ZodError if any field fails validation
    // We destructure the validated, sanitized data for use below
    const validatedData = SolarIntakeSchema.parse(req.body);

    // ------------------------------------------------------------------------
    // B. COMPUTE SOLAR METRICS (Pure in-memory math, zero I/O, <1ms)
    // ------------------------------------------------------------------------
    // Pass the raw structural inputs to our deterministic math engine
    // Returns an object with all calculated recommendations (kW, savings, payback, etc.)
    const solarCalculations = calculateSolarMetrics(
      validatedData.monthlyBill,
      validatedData.roofAreaSqFt,
    );

    // ------------------------------------------------------------------------
    // C. PERSIST TO MONGODB (The "Safe-First" System of Record)
    // ------------------------------------------------------------------------
    // Prepare the full document to save, merging validated inputs + calculated outputs
    const leadDocument = {
      clientProfile: {
        name: validatedData.clientName,
        phone: validatedData.phoneNumber,
        email: validatedData.email,
        city: validatedData.city,
        state: validatedData.state,
        roofOwnership: validatedData.roofOwnership,
      },
      siteInputs: {
        monthlyBill: validatedData.monthlyBill,
        roofAreaSqFt: validatedData.roofAreaSqFt,
      },
      solarRecommendations: solarCalculations,
      // Critical: Start with PENDING_DISPATCH so our safety-net cron can recover failures
      dispatchStatus: {
        state: "PENDING_DISPATCH",
      },
    };

    // Execute the database write with write concern 'majority'
    // This ensures the data is replicated to at least 2 MongoDB nodes before we proceed
    // Guaranteeing durability even if the primary node crashes immediately after
    const newLead = await SolarLead.create([leadDocument], { w: "majority" });
    const savedLead = newLead[0]; // .create() returns an array, even for single docs

    // ------------------------------------------------------------------------
    // D. SEND HTTP 201 RESPONSE TO CLIENT (Sub-200ms mandate achieved)
    // ------------------------------------------------------------------------
    // The user's browser receives confirmation BEFORE any background work starts
    // This is the key to perceived performance and scalability
    res.status(201).json({
      success: true,
      message: "Solar assessment generated successfully. Your report is ready.",
      data: {
        id: savedLead.id, // Virtual property returns _id as hex string
        clientName: savedLead.clientProfile.name,
        recommendations: savedLead.solarRecommendations,
        pdfReady: true, // Flag for frontend to enable the "Download PDF" button
      },
    });

    // ------------------------------------------------------------------------
    // E. NON-BLOCKING BACKGROUND DISPATCH (Fire-and-forget, with safety net)
    // ------------------------------------------------------------------------
    // Convert Mongoose doc to plain JS object for background processing
    const leadPayload = savedLead.toObject();

    // Dispatch async tasks (email PDF, n8n webhook) WITHOUT awaiting them
    // If these fail, the document remains in PENDING_DISPATCH for cron recovery
    // We use .catch(console.error) to prevent unhandled promise rejections
    dispatchBackgroundTasks(leadPayload).catch((err) =>
      console.error("[Background Dispatch Error]", err),
    );

    // Controller function ends here - HTTP response already sent, event loop free
  } catch (error) {
    // ------------------------------------------------------------------------
    // GLOBAL ERROR HANDLING: Differentiate validation errors from system errors
    // ------------------------------------------------------------------------

    // Case 1: Zod validation failed - return 400 with field-specific errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors, // Frontend can map these to form fields
      });
    }

    // Case 2: Mongoose validation or database error - return 422 or 500
    if (error.name === "ValidationError" || error.name === "MongoServerError") {
      return res.status(422).json({
        success: false,
        message: "Data persistence failed",
        error: error.message,
      });
    }

    // Case 3: Unexpected system error - log internally, return generic 500 to client
    console.error("[Lead Creation Fatal Error]", {
      message: error.message,
      stack: error.stack,
      body: req.body, // Log the payload for debugging (sanitize PII in production)
    });

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
};
