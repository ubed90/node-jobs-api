const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const getAllJobs = async (req, res) => {
  const { userId: createdBy } = req.user;
  const jobs = await Job.find({ createdBy }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, nbHits: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.find({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job with Id ${jobId}`);
  }

  return res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  return res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company or position cannot be empty");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if(!job) {
    throw new NotFoundError(`No job with Id ${jobId}`);
  }

  return res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
    } = req;

    const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId });

    if (!job) {
        throw new NotFoundError(`No job with Id ${jobId}`);
    }

    return res.status(StatusCodes.OK).send()
    
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
