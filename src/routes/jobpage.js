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

// Route to get data for each individual job page.
router.get("/:id", (req, res) => {
  const id = escapeSqlString(req.params.id);

  db.all(
    `SELECT * FROM "jobs" WHERE "Job ID" = ${id} LIMIT 1;`,
    (err, rows) => {
      // Send status code 500 if there was an error
      if (err) {
        console.error(err);
        res.status(500).send(`Could not get job info with ID ${id}.`);
      }

      // Otherwise, send the rows in JSON
      res.json(rows[0]);
    }
  );
});

// Route to save a job for later.
router.post("/:id/save", (req, res) => {
  const id = escapeSqlString(req.params.id);
  const businessTitle = escapeSqlString(req.body["Business Title"]);
  const agency = escapeSqlString(req.body["Agency"]);

  db.run(
    `INSERT INTO "savedjobs" VALUES ("${id}", "${businessTitle}", "${agency}")`,
    (err) => {
      // Send status code 500 if there was an error
      if (err) {
        console.error(err);
        res.status(500).send(`Could not save job with ID ${id}.`);
      }

      // Otherwise, send 200 OK
      res.status(200).send();
    }
  );
});

// Route to unsave a saved job.
router.delete("/:id/save", (req, res) => {
  const id = escapeSqlString(req.params.id);

  db.run(`DELETE FROM "savedjobs" WHERE "Job ID" = ${id}`, (err) => {
    // Send status code 500 if there was an error
    if (err) {
      console.error(err);
      res.status(500).send(`Could not unsave job with ID ${id}.`);
    }

    // Otherwise, send 200 OK
    res.status(200).send();
  });
});

// Route to check if a job is saved.
router.get("/:id/saved", (req, res) => {
  const id = escapeSqlString(req.params.id);

  db.all(`SELECT * FROM "savedjobs" WHERE "Job ID" = ${id}`, (err, rows) => {
    // Send status code 500 if there was an error
    if (err) {
      console.error(err);
      res.status(500).send(`Could not check if job with ID ${id} is saved.`);
    }

    // Otherwise, send result
    if (rows.length > 0) {
      res.status(200).send(true);
    } else {
      res.status(200).send(false);
    }
  });
});

// Route to delete a job posting from the database.
router.delete("/:id", (req, res) => {
  const id = escapeSqlString(req.params.id);

  db.run(`DELETE FROM "jobs" WHERE "Job ID" = ${id};`, (err) => {
    // Send status code 500 if there was an error
    if (err) {
      console.error(err);
      res.status(500).send(`Could not delete job with ID ${id}.`);
    }

    // Otherwise, send success
    res.sendStatus(200);
  });
});

module.exports = router;
