require('dotenv').config({ path: "./config/.env" });
require('express-async-errors');

// ! Security Packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const express = require('express');
const app = express();


// connectDB
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// MW
const authMiddleware = require("./middleware/authentication");

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

// ! Secutity PAckage Invocation
app.set('trust proxy', 1);
app.use(rateLimit({
  windowMs: 15*60*1000,
  max: 100
}))
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
