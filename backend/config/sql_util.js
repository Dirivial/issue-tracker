const mysql = require("mysql");
const settings = {
  connectionLimit: 10,
  user: process.env.MYSQLUSER,
  host: process.env.MYSQL_URL,
  port: process.env.MYSQLPORT,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
};

var db = mysql.createPool(settings);

db.on("connection", (c) => {
  console.log("Connection established");

  c.on("error", (err) => {
    console.error(new Date(), "MySQL error", err.code);
  });

  c.on("close", (err) => {
    console.error(new Date(), "MySQL close", err);
  });
});

module.exports = db;
