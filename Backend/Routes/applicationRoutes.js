const express = require("express");

const {
  applyToJob,
  applyToAll,
  getApplications,
} = require("../Controllers/applicationController");

const router = express.Router();

router.post("/jobs/:id/apply", applyToJob);
router.post("/applications/bulk", applyToAll);
router.get("/applications", getApplications);

module.exports = router;