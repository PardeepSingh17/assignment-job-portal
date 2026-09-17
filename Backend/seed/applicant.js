const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Applicant = require("../Models/Applicant");

dotenv.config();

const applicant = {
  name: "Demo Applicant",
  email: "demo@example.com",
};

const seedApplicant = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const existingApplicant = await Applicant.findOne({
      email: applicant.email,
    });

    if (existingApplicant) {
      console.log("Applicant already exists");
      console.log("Applicant ID:", existingApplicant._id);

      await mongoose.connection.close();
      process.exit(0);
    }

    const newApplicant = await Applicant.create(applicant);

    console.log("Applicant created successfully");
    console.log("Applicant ID:", newApplicant._id);

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Applicant seed error:", error);
    process.exit(1);
  }
};

seedApplicant();