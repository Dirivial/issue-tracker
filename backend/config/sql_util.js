const mysql = require("mysql");
const settings = {
    user: 'alch',
    host: 'localhost',
    password: 'pizza123',
    database: 'issue-tracker',
} 
var db;


function connectToDatabase() {
    if(!db) {
        db = mysql.createConnection(settings);

        db.connect(function(err) {
            if(!err) {
                console.log('Connection to database established.');
            } else {
                console.log('Error upon connecting to database');
            }
        });
    }
    return db;
}

module.exports = connectToDatabase();
