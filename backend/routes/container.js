const db = require("../config/sql_util.js");
const SECRET = require("../config/auth.config.js").secret;

module.exports = function(app) {

    app.post('/create-container', (req, res) => {
        const name = req.body.username;
        const description = req.body.description;
        const userid = req.body.userid;

        db.query('INSERT INTO (name, description, userid) VALUES (?,?,?)',
            [name, description, userid],
            (err, result) => {
                if(err) {
                    res.status(500);
                    res.send({ error: 'Amogus' });
                } else {
                    res.send("Values inserted.");
                }
            });
    }) 

}
