const mongoose = require("mongoose");

const Job = require("../Models/job");
const Applicant = require("../Models/Applicant");
const Application = require("../Models/Application");

const validateAnswers = require("../Utils/validateAnswer");

// POST /jobs/:id/apply
const applyToJob = async (req, res) => {
  try {
    const { applicantId, answers } = req.body;
    const jobId = req.params.id;

    // 1. Validate basic request data
    if (!applicantId || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "applicantId and answers are required",
      });
    }

    // 2. Find the job
    const job = await Job.findOne({ id: jobId });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(applicantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicantId",
      });
    }

    // 3. Find the applicant
    const applicant = await Applicant.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    // 4. Validate answers against the job's questions
    const validation = validateAnswers(
      job.questions,
      answers
    );

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid application answers",
        errors: validation.errors,
      });
    }

    // 5. Check if applicant already applied
    const existingApplication = await Application.findOne({
      applicant: applicant._id,
      job: job._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    // 6. Create application
    const application = await Application.create({
      applicant: applicant._id,
      job: job._id,
      answers,
    });

    // 7. Return created application
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Apply to job error:", error);

    // Handle duplicate index race condition
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};

const applyToAll = async (req, res) => {
  try {
    const { applicantId, applications } = req.body;

    if (!applicantId || !Array.isArray(applications)) {
      return res.status(400).json({
        success: false,
        message: "applicantId and applications are required",
      });
    }

    if (applications.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one application is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(applicantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicantId",
      });
    }

    const applicant = await Applicant.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    const errors = [];
    const validatedApplications = [];

    for (const item of applications) {
      const { jobId, answers } = item;

      if (!jobId || !Array.isArray(answers)) {
        errors.push({
          jobId,
          message: "jobId and answers are required",
        });
        continue;
      }

      const job = await Job.findOne({ id: jobId });

      if (!job) {
        errors.push({
          jobId,
          message: "Job not found",
        });
        continue;
      }

      const validation = validateAnswers(
        job.questions,
        answers
      );

      if (!validation.isValid) {
        errors.push({
          jobId,
          message: "Invalid application answers",
          details: validation.errors,
        });
        continue;
      }

      const existingApplication = await Application.findOne({
        applicant: applicant._id,
        job: job._id,
      });

      if (existingApplication) {
        errors.push({
          jobId,
          message: "You have already applied to this job",
        });
        continue;
      }

      validatedApplications.push({
        applicant: applicant._id,
        job: job._id,
        answers,
      });
    }

    // Do not submit anything if any selected application has an error
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some applications could not be submitted",
        errors,
      });
    }

    const createdApplications = await Application.insertMany(
      validatedApplications
    );

    res.status(201).json({
      success: true,
      message: `${createdApplications.length} applications submitted successfully`,
      data: createdApplications,
    });
  } catch (error) {
    console.error("Bulk application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit applications",
    });
  }
};

const getApplications = async (req, res) => {
  try {
    const { applicantId } = req.query;

    if (!applicantId) {
      return res.status(400).json({
        success: false,
        message: "applicantId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(applicantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid applicantId",
      });
    }

    const applicant = await Applicant.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    const applications = await Application.find({
      applicant: applicant._id,
    })
      .populate("job", "id title company location description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

module.exports = {
  applyToJob,
  applyToAll,
  getApplications
};