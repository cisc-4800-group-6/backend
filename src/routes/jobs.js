const { Router } = require("express");
const SqlString = require("sqlstring");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.NODE_ENV === "production"
    ? "/app/nycjobs.sqlite"
    : "nycjobs.sqlite"
);

const router = Router();

// Featured jobs
router.get("/", (req, res) => {
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

  db.run(
    `INSERT INTO "jobs" ("Business Title", "Agency", "Work Location", 
      "Full-Time/Part-Time indicator", "Hours/Shift", "Posting Date",
      "Job Description", "Minimum Qual Requirements", 
      "Preferred Skills", "Additional Information", 
      "Recruitment Contact") VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      SqlString.escape(businessTitle),
      SqlString.escape(agency),
      SqlString.escape(location),
      SqlString.escape(fpTime),
      SqlString.escape(hours),
      SqlString.escape(postDate),
      SqlString.escape(jobDesc),
      SqlString.escape(miniQual),
      SqlString.escape(prefSkill),
      SqlString.escape(addInfo),
      SqlString.escape(rContact),
    ],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Cannot add job");
      }

      res.json({ status: "okay" });
    }
  );
});

module.exports = router;
