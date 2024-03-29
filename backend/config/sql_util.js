const mysql = require("mysql2");
var db = mysql.createPool(
  "mysql://" +
    process.env.MYSQLUSER +
    ":" +
    process.env.MYSQLPASSWORD +
    "@" +
    process.env.MYSQLHOST +
    ":" +
    process.env.MYSQLPORT +
    "/" +
    process.env.MYSQLDATABASE
);

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
