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

    app.get(PATH + '/', (req, res) => {
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

    app.post(PATH + '/multi', (req, res) => {
        if (!req.body.listids) return res.sendStatus(400);
        if (req.body.listids.length === 0) return res.sendStatus(200);

        const ids = req.body.listids;

        db.query('SELECT * FROM issue WHERE listid IN (?)',
            [ids],
            (err, result) => {
                if(err) {
                    return res.sendStatus(500);
                } else {
                    return res.status(200).send(result);
                }
            })
    });

    app.get(PATH + '/remove', (req, res) => {
        if (!req.query?.issueid) return res.sendStatus(400);
        
        db.query('DELETE FROM issue WHERE id = (?)',
            [req.query.issueid],
            (err, result) => {
                if(err) {
                    return res.sendStatus(500);
                } else {
                    return res.status(200);
                }
            });
    });

    app.post(PATH + '/update', (req, res) => {

        const name = req.body.name;
        const description = req.body.description;
        const position = req.body.position;
        const done = req.body.done;
        const listid = req.body.listid;
        const issueid = req.body.issueid;
        
        db.query('UPDATE issue SET (?,?,?,?) WHERE id = (?)',
            [name, description, position, done, listid, issueid],
            (err, result) => {
                if(err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    return res.status(200);
                }
            });
    });
}

