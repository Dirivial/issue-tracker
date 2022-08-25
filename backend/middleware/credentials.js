const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
    console.log("We got here.", origin);
  }
  res.header("Access-Control-Allow-Origin", origin);
  next();
};

module.exports = credentials;
