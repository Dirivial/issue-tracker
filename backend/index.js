const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: 'alch',
    host: 'localhost',
    password: 'pizza123',
    database: 'issue-tracker',
});


app.post('/create', (req, res) => {
    const mail = req.body.mail;
    const name = req.body.username;
    const password = req.body.password;

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


app.listen(3001, () => {
    console.log("Server running on 3001");
});
