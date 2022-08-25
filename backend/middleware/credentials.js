const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", true);
  next();
};

module.exports = credentials;
