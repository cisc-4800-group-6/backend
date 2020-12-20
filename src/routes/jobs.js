const { Router } = require("express");
const sqlite3 = require("sqlite3");
const { escapeSqlString } = require("../util");

// Initialize database connection
const db = new sqlite3.Database(
  process.env.NODE_ENV === "production"
    ? "/app/nycjobs.sqlite"
    : "nycjobs.sqlite"
);

const router = Router();

// Route to get featured jobs.
router.get("/", (req, res) => {
  db.all('SELECT * FROM "jobs";', (err, rows) => {
    // Send status code 500 if there was an error
    if (err) {
      console.error(err);
      res.status(500).send("Could not get jobs!");
    }

    // Otherwise, send the rows in JSON
    res.json(rows);
  });
});

// Route to create a new job posting.
router.post("/", (req, res) => {
  // Store data from POST request body.
  const {
    businessTitle,
    agency,
    location,
    fpTime,
    hours,
    postDate,
    jobDesc,
    miniQual,
    prefSkill,
    addInfo,
    rContact,
  } = req.body;

  // Get the most recently used custom job ID for posted jobs.
  // Because we imported the table, no primary key was properly set for some reason,
  // and we will need to use our own ID counter starting from 1,000,000.
  db.get('SELECT LatestJobID FROM "customdata";', (err, row) => {
    if (err) {
      console.error("Could not get latest job ID");
      res.sendStatus(500);
    }

    const latestJobId = row.LatestJobID; // The most recently created job
    const newJobId = latestJobId + 1; // Increment new job ID by 1 for the soon to be created job

    // Add the new job posting into the database with the new job ID
    db.run(
      `INSERT INTO "jobs" ("Job ID", "Business Title", "Agency", "Work Location", 
      "Full-Time/Part-Time indicator", "Hours/Shift", "Posting Date",
      "Job Description", "Minimum Qual Requirements", 
      "Preferred Skills", "Additional Information", 
      "Recruitment Contact") VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`,
      [
        newJobId,
        escapeSqlString(businessTitle),
        escapeSqlString(agency),
        escapeSqlString(location),
        escapeSqlString(fpTime),
        escapeSqlString(hours),
        escapeSqlString(postDate),
        escapeSqlString(jobDesc),
        escapeSqlString(miniQual),
        escapeSqlString(prefSkill),
        escapeSqlString(addInfo),
        escapeSqlString(rContact),
      ],
      (err) => {
        // Send status code 500 if there was an error
        if (err) {
          console.error(err);
          res.sendStatus(500);
        }

        // Update the latest job ID with the newly created job ID.
        db.run(`UPDATE customdata SET LatestJobID=${newJobId};`, () => {
          // Send the new job ID for the frontend to use to redirect to the new job posting
          res.status(200).send(`${newJobId}`);
        });
      }
    );
  });
});

module.exports = router;
