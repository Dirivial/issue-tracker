const db = require("../config/sql_util.js");
require('dotenv').config();

const PATH = '/issueList';

module.exports = function(app) {

    app.post(PATH + '/create', (req, res) => {
        const name = req.body.name;
        const position = req.body.position;
        const containerID = req.body.containerid;

        db.query('INSERT INTO issueList (name, position, containerID) VALUES (?,?,?)',
            [name, position, containerID],
            (err, result) => {
                if(err) {
                    return res.sendStatus(500);
                } else {
                    return res.status(201).send({
                        name: name,
                        position: position,
                        containerid: containerID,
                        id: result.insertId
                    });
                }
            });
    });

    app.get(PATH + '/', (req, res) => {
        if (!req.query?.containerid) return res.sendStatus(400);

        db.query('SELECT * FROM issueList WHERE containerid = (?)',
            [req.query.containerid],
            (err, result) => {
                if(err) {
                    return res.sendStatus(500);
                } else {
                    return res.status(200).send(result);
                }
            })
    });

    app.post(PATH + '/update', (req, res) => {

        const name = req.body.name;
        const position = req.body.position;
        const id = req.body.id;
        
        db.query('UPDATE issueList SET name = ?, position = ? WHERE id = ?',
            [name, position, id],
            (err, result) => {
                if(err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    return res.sendStatus(200);
                }
            });
    });

    app.get(PATH + '/remove', (req, res) => {
        if (!req.query?.listid) return res.sendStatus(400);
        
        db.query('DELETE FROM issueList WHERE id = (?)',
            [req.query.listid],
            (err, result) => {
                if(err) {
                    console.log(err);
                    return res.sendStatus(500);
                } else {
                    return res.sendStatus(200);
                }
            });
    });
}
