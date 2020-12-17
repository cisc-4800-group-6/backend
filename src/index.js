const express = require("express");
const cors = require("cors");
const baseJobsRoute = require("./routes/jobs");
const searchRoute = require("./routes/search");
const jobPageRoute = require("./routes/jobpage");
const savedJobsRoute = require("./routes/savedjobs");

const PORT = 8080;

if (process.env.NODE_ENV === "production") {
  console.log("Running NYC Jobs Finder in production mode.");
} else {
  console.log("Running NYC Jobs Finder in development mode.");
}

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Initialize routes
app.use("/jobs", baseJobsRoute);
app.use("/jobs", searchRoute);
app.use("/jobs", savedJobsRoute);
app.use("/job", jobPageRoute);

// Start listening for API calls
app.listen(PORT, () => {
  console.log(`NYC Jobs Finder listening at http://localhost:${PORT}`);
});
