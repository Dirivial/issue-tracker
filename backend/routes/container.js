const db = require("../config/sql_util.js");
const verifyJWT = require('../middleware/verifyJWT');


module.exports = function(app) {

    app.post('/create-container', (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const userid = req.body.userid;

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
