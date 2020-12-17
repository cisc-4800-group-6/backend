const { Router } = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.NODE_ENV === "production"
    ? "/app/nycjobs.sqlite"
    : "nycjobs.sqlite"
);

const router = Router();

// Get saved jobs
router.get("/saved", (req, res) => {
  db.all(`SELECT * FROM "savedjobs";`, (err, rows) => {
    // Send status code 500 if there was an error
    if (err) {
      console.error(err);
      res.status(500).send("Could not get jobs!");
    }

    // Otherwise, send the rows in JSON
    res.json(rows);
  });
});

module.exports = router;
