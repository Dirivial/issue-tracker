const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const corsOptions = require("./config/corsOptions.js");
const credentials = require("./middleware/credentials.js");

const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

const app = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my issue-tracker" });
});

app.get("/nice", (_, res) => {
  res.json({ message: "Yo." });
});

// Routes
require("./routes/user")(app);

app.use(verifyJWT);
require("./routes/container.js")(app);
require("./routes/issueList.js")(app);
require("./routes/issue.js")(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
