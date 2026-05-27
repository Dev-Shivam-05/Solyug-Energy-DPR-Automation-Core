import mongoose from "mongoose";

const SolarLeadSchema = new mongoose.Schema(
  {
    clientProfile: {
      name: { type: String, required: true, trim: true },
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

    siteInputs: {
      monthlyBill: {
        type: Number,
        required: true,
        min: [0, "Bill cannot be negative"],
        max: [100000, "Bill seems unrealistically high"],
      },
      roofAreaSqFt: {
        type: Number,
        required: true,
        min: [0, "Area cannot be negative"],
        max: [10000, "Roof area seems unrealistically large"],
      },
    },

    solarRecommendations: {
      systemCapacityKw: { type: Number, required: true },
      monthlyGenerationUnits: { type: Number, required: true },
      monthlySavingsInr: { type: Number, required: true },
      totalSystemCostInr: { type: Number, required: true },
      paybackYears: { type: Number, required: true },
      lifetimeNetProfitInr: { type: Number, required: true },
    },

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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

SolarLeadSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

SolarLeadSchema.index({ "dispatchStatus.state": 1, createdAt: -1 });
SolarLeadSchema.index({ "solarRecommendations.systemCapacityKw": -1 });

SolarLeadSchema.index(
  { "clientProfile.phone": 1, "clientProfile.email": 1 },
  { unique: false },
);

export const SolarLead = mongoose.model("SolarLead", SolarLeadSchema);
