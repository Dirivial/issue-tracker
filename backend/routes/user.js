const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("../config/sql_util.js");
const SECRET = require("../config/auth.config.js").secret;


module.exports = function(app) {

    app.post('/auth/create', (req, res) => {
        const mail = req.body.mail;
        const name = req.body.username;
        const password = bcrypt.hashSync(req.body.password, 8);

        db.query('INSERT INTO usario (name, password, mail) VALUES (?,?,?)',
            [name, password, mail],
            (err, result) => {
                if(err) {
                    res.status(500);
                    res.send({ error: 'Amogus' });
                } else {
                    res.send("Values inserted.");
                }
            });
    });

    app.post('/auth/verify', (req, res) => {
        const mail = req.body.mail;
        const password = req.body.password;

        db.query('SELECT * FROM usario WHERE mail = ?',
            [mail],
            (err, result) => {
                if (err) {
                    res.status(500);
                    res.send({ error: "Uh oh" });
                } else {
                    if(!result[0]) {
                        res.status(401).send({ error: "E-mail does not exist." });
                    } else {
                        if (bcrypt.compareSync(password, result[0].password)) {
                            const token = jwt.sign({ userid: result[0].id }, SECRET, {
                                expiresIn: 86400 // 24 hours
                            });
                            res.status(200).send({ 
                                userid: result[0].id,
                                name: result[0].name,
                                mail: result[0].mail,
                                token: token
                            });
                        } else {
                            res.status(401).send({ error: "Wrong password." });
                        }
                    }
                }
            }
        );
    });
}

