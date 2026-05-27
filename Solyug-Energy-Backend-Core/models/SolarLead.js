import mongoose from "mongoose";

const SolarLeadSchema = new mongoose.Schema(
  {
    // 1. The Raw Client Data (Exactly as validated)
    clientProfile: {
      name: { type: String, required: true, trim: true }, // trim removes accidental whitespace
      phone: {
        type: String,
        required: true,
        index: true,
        validate: {
          validator: (v) => /^\+?[1-9]\d{1,14}$/.test(v),
          message: (props) =>
            `${props.value} is not a valid international phone number!`,
        },
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
          validator: (v) => /\S+@\S+\.\S+/.test(v),
          message: "Please enter a valid email address",
        },
      },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      roofOwnership: { type: String, enum: ["Own", "Rented"], required: true },
    },

    // 2. The Raw Structural Inputs
    siteInputs: {
      monthlyBill: {
        type: Number,
        required: true,
        min: [0, "Bill cannot be negative"],
        max: [100000, "Bill seems unrealistically high"], // Prevent data entry errors
      },
      roofAreaSqFt: {
        type: Number,
        required: true,
        min: [0, "Area cannot be negative"],
        max: [10000, "Roof area seems unrealistically large"], // 10k sq ft = ~930 sq m, reasonable max for residential
      },
    },

    // 3. The Math Engine Outputs (The Recommendations)
    solarRecommendations: {
      systemCapacityKw: { type: Number, required: true },
      monthlyGenerationUnits: { type: Number, required: true },
      monthlySavingsInr: { type: Number, required: true },
      totalSystemCostInr: { type: Number, required: true },
      paybackYears: { type: Number, required: true },
      lifetimeNetProfitInr: { type: Number, required: true },
    },

    // 4. The Outbox / Dispatch Safety Net
    dispatchStatus: {
      state: {
        type: String,
        enum: [
          "PENDING_DISPATCH",
          "FULLY_DISPATCHED",
          "PARTIAL_FAILURE",
          "FAILED",
        ],
        default: "PENDING_DISPATCH",
        index: true,
      },
      emailPdfSent: { type: Boolean, default: false },
      n8nWebhookSent: { type: Boolean, default: false },
      lastRetryAttempt: { type: Date, default: null },
      failureReason: { type: String, default: null },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Allow virtuals to appear in JSON output
    toObject: { virtuals: true },
  },
);

// Add a virtual property to expose _id as 'id' for frontend convenience
SolarLeadSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// High-performance indexes for the operations dashboard
SolarLeadSchema.index({ "dispatchStatus.state": 1, createdAt: -1 });
SolarLeadSchema.index({ "solarRecommendations.systemCapacityKw": -1 });
// Add a compound index for duplicate detection (phone + email)
SolarLeadSchema.index(
  { "clientProfile.phone": 1, "clientProfile.email": 1 },
  { unique: false },
);

export const SolarLead = mongoose.model("SolarLead", SolarLeadSchema);
