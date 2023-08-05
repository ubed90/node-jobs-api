const express = require("express");
const { createJob, deleteJob, getJob, getAllJobs, updateJob } = require("../controllers/jobs");

const router = express.Router();

router.route("/").post(createJob).get(getAllJobs);
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;