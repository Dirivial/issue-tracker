const db = require("../config/sql_util.js");
require('dotenv').config();

const PATH = '/issue';

module.exports = function(app) {
    app.post(PATH + '/create', (req, res) => {
        const name = req.body.username;
        const description = req.body.description;
        const containerID = req.body.containerid;

        db.query('INSERT INTO issue (name, description, containerID) VALUES (?,?,?)',
            [name, description, containerID],
            (err, result) => {
                if(err) {
                    return res.sendStatus(500);
                } else {
                    return res.sendStatus(201);
                }
            });
    });
}

