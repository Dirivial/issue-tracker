const mysql = require("mysql");
const settings = {
    connectionLimit: 10,
    user: 'alch',
    host: 'localhost',
    password: 'pizza123',
    database: 'issue-tracker',
}

var db = mysql.createPool(settings); 

db.on('connection', (c) => {
    console.log('Connection established');

    c.on('error', (err) => {
        console.error(new Date(), 'MySQL error', err.code);
    });

    c.on('close', (err) => {
        console.error(new Date(), 'MySQL close', err);
    });
})

module.exports = db;
