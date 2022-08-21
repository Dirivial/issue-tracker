const db = require("../config/sql_util.js");
require("dotenv").config();

const PATH = "/container";

module.exports = function (app) {
  app.post(PATH + "/create", (req, res) => {
    const name = req.body.name;
    const userid = req.body.userid;

    db.query(
      "INSERT INTO container (name, userid) VALUES (?,?)",
      [name, userid],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else {
          return res.sendStatus(201);
        }
      }
    );
  });

  app.get(PATH + "/my-containers", (req, res) => {
    db.query(
      "SELECT * FROM container WHERE userid = (?)",
      [req.userid],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else {
          return res.status(200).send({ containers: result });
        }
      }
    );
  });

  app.get(PATH + "/get", (req, res) => {
    if (!req.query?.id) return res.sendStatus(400);

    db.query(
      "SELECT * FROM container WHERE id = (?)",
      [req.query.id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else {
          return res.status(201).send({
            name: result[0].name,
            creatorid: result[0].userid,
          });
        }
      }
    );
  });

  app.post(PATH + "/remove", (req, res) => {
    const containerid = req.body.containerid;
    const userid = req.body.userid;

    db.query(
      "DELETE FROM container WHERE (id, userid) = (?,?)",
      [containerid, userid],
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

  app.post(PATH + "/update", (req, res) => {
    const name = req.body.name;
    const id = req.body.id;

    db.query(
      "UPDATE container SET name = ?, WHERE id = ?",
      [name, id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else {
          return res.sendStatus(201);
        }
      }
    );
  });
};
