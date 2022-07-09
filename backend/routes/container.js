const jwt = require("jsonwebtoken");
const db = require("../config/sql_util.js");
require('dotenv').config();

const PATH = '/container';

module.exports = function(app) {

    app.post(PATH + '/create', (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const userid = req.body.userid;

        db.query('INSERT INTO container (name, description, userid) VALUES (?,?,?)',
            [name, description, userid],
            (err, result) => {
                if(err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    return res.status(200).send("Container successfully inserted.");
                }
            });
    });

    app.get(PATH + '/my-containers', (req, res) => {

        db.query('SELECT * from container WHERE userid = (?)',
            [req.userid],
            (err, result) => {
                if(err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    return res.status(200).send({ containers: result });
                }
            });
    });
}
