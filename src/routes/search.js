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

// Route to search for the first 50 jobs that match a search query.
router.get("/search", (req, res) => {
  const query = escapeSqlString(req.query.q);

  db.all(
    `SELECT * FROM "jobs" WHERE "Business Title" LIKE "%${query}%" LIMIT 50;`,
    (err, rows) => {
      // Send status code 500 if there was an error
      if (err) {
        console.error(err);
        res.status(500).send("Could not get jobs!");
      }

      // Otherwise, send the search results to the frontend
      res.json(rows);
    }
  );
});

module.exports = router;
