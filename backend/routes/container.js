const verifyJWT = require("../middleware/authJwt.js").verifytoken;

const db = require("../config/sql_util.js");
const SECRET = require("../config/auth.config.js").secret;

module.exports = function(app) {

    app.post('/create-container', (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const userid = req.body.userid;
        console.log("Name: " + name);
        console.log("description: " + description);
        console.log("id: " + userid);

        db.query('INSERT INTO container (name, description, userid) VALUES (?,?,?)',
            [name, description, userid],
            (err, result) => {
                if(err) {

                    res.status(500);
                    console.log(err);
                    res.send({ error: 'Something went terribly wrong.' });
                } else {
                    res.status(200).send("Container successfully inserted.");
                }
            });
    }) 

}
