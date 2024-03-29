const db = require("../config/sql_util.js");
require("dotenv").config();

const PATH = "/issue";

module.exports = function (app) {
  app.post(PATH + "/create", (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const position = req.body.position;
    const listid = req.body.listid;
    const due = req.body.due;

    db.query(
      "INSERT INTO issue (name, description, position, done, listid, due) VALUES (?,?,?,?,?,?)",
      [name, description, position, false, listid, due],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.sendStatus(500);
        } else {
          return res.status(201).send({
            id: result.insertId,
          });
        }
      }
    );
  });

  app.get(PATH + "/", (req, res) => {
    if (!req.query?.listid) return res.sendStatus(400);

    db.query(
      "SELECT * FROM issue WHERE listid = (?)",
      [req.query.listid],
      (err, result) => {
        if (err) {
          return res.sendStatus(500);
        } else {
          return res.status(200).send(result);
        }
      }
    );
  });

  app.post(PATH + "/organize", (req, res) => {
    if (!req.body.issues) return res.sendStatus(400);

    const issues = req.body.issues;
    const ids = issues.map((issue) => issue.id);
    let i = 0;

    var query = db.query("SELECT * FROM issue WHERE id IN (?)", [ids]);
    query
      .on("error", function (err) {
        console.log(err);
        res.status(500);
      })
      .on("result", function (result) {
        db.query(
          "UPDATE issue SET position = (?), listid = (?) WHERE id = (?)",
          [issues[i].position, issues[i].listid, issues[i].id],
          (err, result) => {
            if (err) {
              console.log(err);
              res.status(500);
            }
          }
        );
        i += 1;
      })
      .on("end", function (end) {
        return res.send();
      });
  });

  app.post(PATH + "/multi", (req, res) => {
    if (!req.body.listids) return res.sendStatus(400);
    if (req.body.listids.length === 0) return res.sendStatus(200);

    const ids = req.body.listids;

    db.query(
      "SELECT * FROM issue WHERE listid IN (?)",
      [ids],
      (err, result) => {
        if (err) {
          return res.sendStatus(500);
        } else {
          return res.status(200).send(result);
        }
      }
    );
  });

  app.get(PATH + "/remove", (req, res) => {
    if (!req.query?.issueid) return res.sendStatus(400);

    db.query(
      "DELETE FROM issue WHERE id = (?)",
      [req.query.issueid],
      (err, result) => {
        if (err) {
          return res.sendStatus(500);
        } else {
          return res.status(200);
        }
      }
    );
  });

  app.post(PATH + "/update", (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const position = req.body.position;
    const done = req.body.done;
    const listid = req.body.listid;
    const issueid = req.body.issueid;
    const due = req.body.due;

    db.query(
      "UPDATE issue SET name = ?, description = ?, position = ?, done = ?, listid = ?, due = ? WHERE id = (?)",
      [name, description, position, done, listid, due, issueid],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else {
          return res.sendStatus(200);
        }
      }
    );
  });
};
