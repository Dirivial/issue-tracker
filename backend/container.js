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


app.listen(3002, () => {
    console.log("Server running on 3002");
});
