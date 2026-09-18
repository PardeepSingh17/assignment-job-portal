const express = require("express");
const cors = require("cors");

const jobRoutes = require("./Routes/jobRoutes");
const applicationRoutes = require("./Routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Job Application Portal API is running",
  });
});

app.use("/jobs", jobRoutes);
app.use("/", applicationRoutes);

module.exports = app;