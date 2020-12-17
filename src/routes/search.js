const { Router } = require("express");
const sqlite3 = require("sqlite3");
const { escapeSqlString } = require("../util");

const db = new sqlite3.Database(
  process.env.NODE_ENV === "production"
    ? "/app/nycjobs.sqlite"
    : "nycjobs.sqlite"
);

const router = Router();

// Search for first 50 jobs
router.get("/search", (req, res) => {
  // Replace both apostrophes with nothing
  const query = escapeSqlString(req.query.q);

  db.all(
    `SELECT * FROM "jobs" WHERE "Business Title" LIKE "%${query}%" LIMIT 50;`,
    (err, rows) => {
      // Send status code 500 if there was an error
      if (err) {
        console.error(err);
        res.status(500).send("Could not get jobs!");
      }

      // Otherwise, send the rows in JSON
      res.json(rows);
    }
  );
});

module.exports = router;
