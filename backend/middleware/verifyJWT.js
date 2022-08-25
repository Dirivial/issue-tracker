const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  console.log("Verifying JWT...");
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  console.log("JWT verified.");

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.userid = decoded.userid;
    next();
  });
};

module.exports = verifyJWT;
