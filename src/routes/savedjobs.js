const { Router } = require("express");
const sqlite3 = require("sqlite3");

// Initialize database connection
const db = new sqlite3.Database(
  process.env.NODE_ENV === "production"
    ? "/app/nycjobs.sqlite"
    : "nycjobs.sqlite"
);

const router = Router();

// Route to get the saved jobs for later.
router.get("/saved", (req, res) => {
  db.all('SELECT * FROM "savedjobs";', (err, rows) => {
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
