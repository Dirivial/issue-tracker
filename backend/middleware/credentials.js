const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  console.log("Origin being checked", origin);
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", origin);
    console.log("We got here.", origin);
  }
  next();
};

module.exports = credentials;
