const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("../Models/job");

dotenv.config();

const jobs = [
  {
    id: "job-1",
    title: "Frontend Developer",
    company: "Nova Labs",
    location: "Remote",
    description: "Build and maintain our React-based dashboard.",
    questions: [
      {
        id: "q1",
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        id: "q2",
        label: "Years of React experience",
        type: "number",
        required: true,
      },
      {
        id: "q3",
        label: "Preferred work mode",
        type: "dropdown",
        required: true,
        options: ["Remote", "Hybrid", "On-site"],
      },
      {
        id: "q4",
        label: "Why do you want this role?",
        type: "textarea",
        required: false,
      },
    ],
  },

  {
    id: "job-2",
    title: "Content Writer",
    company: "Brightside Media",
    location: "Hybrid",
    description: "Write long-form articles and marketing copy.",
    questions: [
      {
        id: "q1",
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        id: "q2",
        label: "Portfolio URL",
        type: "text",
        required: true,
      },
      {
        id: "q3",
        label: "Topics you can write about",
        type: "checkbox",
        required: true,
        options: ["Tech", "Finance", "Health", "Travel", "Lifestyle"],
      },
      {
        id: "q4",
        label: "Sample pitch",
        type: "textarea",
        required: true,
      },
    ],
  },

  {
    id: "job-3",
    title: "Sales Associate",
    company: "PeakReach",
    location: "On-site",
    description: "Drive outbound sales and manage client relationships.",
    questions: [
      {
        id: "q1",
        label: "Full name",
        type: "text",
        required: true,
      },
      {
        id: "q2",
        label: "Do you have a driver's license?",
        type: "boolean",
        required: true,
      },
      {
        id: "q3",
        label: "Highest education",
        type: "dropdown",
        required: true,
        options: ["High School", "Bachelor's", "Master's", "Other"],
      },
      {
        id: "q4",
        label: "Notice period (in days)",
        type: "number",
        required: false,
      },
    ],
  },
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Job.deleteMany({});

    await Job.insertMany(jobs);

    console.log("Jobs seeded successfully");

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedJobs();