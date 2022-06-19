const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());

const SECRET = "I-got-issues";

const db = mysql.createConnection({
    user: 'alch',
    host: 'localhost',
    password: 'pizza123',
    database: 'issue-tracker',
});


app.post('/create', (req, res) => {
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
}) 

app.post('/verify', (req, res) => {
    const mail = req.body.mail;
    const password = req.body.password;

    db.query('SELECT * FROM usario WHERE mail = ?',
        [mail],
        (err, result) => {
            if (err) {
                res.status(500);
                res.send({ error: "Uh oh" });
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
                    res.status(400).send({ error: "Wrong password" });
                }
            }
        }
    );
})

app.listen(3001, () => {
    console.log("Server running on 3001");
});
