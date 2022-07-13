const db = require("../config/sql_util.js");
require('dotenv').config();

const PATH = '/issue';

module.exports = function(app) {
    app.post(PATH + '/create', (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const position = req.body.position;
        const listid = req.body.listid;

        db.query('INSERT INTO issue (name, description, position, done, listid) VALUES (?,?,?,?,?)',
            [name, description, position, false, listid],
            (err, result) => {
                if(err) {
                    console.error(err);
                    return res.sendStatus(500);
                } else {
                    return res.sendStatus(201);
                }
            });
    });

    app.get(PATH + '/get-in', (req, res) => {
        if (!req.query?.listid) return res.sendStatus(400);

        db.query('SELECT * FROM issue WHERE listid = (?)',
            [req.query.listid],
            (err, result) => {
                if(err) {
                    return res.sendStatus(500);
                } else {
                    return res.status(200).send(result);
                }
            })
    });
}

