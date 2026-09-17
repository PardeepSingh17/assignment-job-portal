const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },

    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Applicant",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    answers: {
      type: [answerSchema],
      required: true,
    },

    status: {
      type: String,
      enum: ["submitted", "reviewing", "rejected", "accepted"],
      default: "submitted",
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index(
  { applicant: 1, job: 1 },
  { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);