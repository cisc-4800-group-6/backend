const { Router } = require("express");
const sqlite3 = require("sqlite3");
const { escapeSqlString } = require("../util");

const db = new sqlite3.Database(
  process.env.NODE_ENV === "production"
    ? "/app/nycjobs.sqlite"
    : "nycjobs.sqlite"
);

const router = Router();

// Featured jobs
router.get("/", async (req, res) => {
  db.all('SELECT * FROM "jobs" LIMIT 50;', (err, rows) => {
    // Send status code 500 if there was an error
    if (err) {
      console.error(err);
      res.status(500).send("Could not get jobs!");
    }

    // Otherwise, send the rows in JSON
    res.json(rows);
  });
});

//post onto the database
router.post("/", (req, res) => {
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

  db.get('SELECT LatestJobID FROM "customdata";', (err, row) => {
    if (err) {
      console.error("Could not get latest job ID");
      res.sendStatus(500);
    }

    // Because we imported the table, no primary key was properly set for some reason.
    // Thus, we must get the new job ID manually.
    const latestJobId = row.LatestJobID;
    const newJobId = latestJobId + 1;

    console.log(latestJobId);

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
        if (err) {
          console.error(err);
          res.sendStatus(500);
        }

        db.run(`UPDATE customdata SET LatestJobID=${newJobId};`, () => {
          res.status(200).send(`${newJobId}`);
        });
      }
    );
  });
});

module.exports = router;
