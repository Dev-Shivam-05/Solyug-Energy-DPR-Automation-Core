import { z } from "zod";

import { SolarLead } from "../models/SolarLead.js";

import { calculateSolarMetrics } from "../utils/solarMath.js";

import { dispatchBackgroundTasks } from "../services/backgroundDispatcher.js";

const SolarIntakeSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters").max(100),
  phoneNumber: z
    .string()
    .regex(/^\+91[6-9]\d{9}$/, "Phone must be Indian format: +919876543210"),
  email: z.string().email("Please enter a valid email address"),

  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State name is required"),
  roofOwnership: z.enum(["Own", "Rented"], {
    errorMap: () => ({
      message: "Roof ownership must be either 'Own' or 'Rented'",
    }),
  }),

  monthlyBill: z
    .number()
    .positive("Monthly bill must be greater than zero")
    .max(100000, "Bill amount seems unrealistically high"),
  roofAreaSqFt: z
    .number()
    .positive("Roof area must be greater than zero")
    .max(10000, "Roof area seems unrealistically large for residential"),
});

export const createResidentialLead = async (req, res) => {
  try {
    const validatedData = SolarIntakeSchema.parse(req.body);

    const solarCalculations = calculateSolarMetrics(
      validatedData.monthlyBill,
      validatedData.roofAreaSqFt,
    );

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

      dispatchStatus: {
        state: "PENDING_DISPATCH",
      },
    };

    const newLead = await SolarLead.create([leadDocument], { w: "majority" });
    const savedLead = newLead[0];

    res.status(201).json({
      success: true,
      message: "Solar assessment generated successfully. Your report is ready.",
      data: {
        id: savedLead.id,
        clientName: savedLead.clientProfile.name,
        recommendations: savedLead.solarRecommendations,
        pdfReady: true,
      },
    });

    const leadPayload = savedLead.toObject();

    dispatchBackgroundTasks(leadPayload).catch((err) =>
      console.error("[Background Dispatch Error]", err),
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      });
    }

    if (error.name === "ValidationError" || error.name === "MongoServerError") {
      return res.status(422).json({
        success: false,
        message: "Data persistence failed",
        error: error.message,
      });
    }

    console.error("[Lead Creation Fatal Error]", {
      message: error.message,
      stack: error.stack,
      body: req.body,
    });

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
};