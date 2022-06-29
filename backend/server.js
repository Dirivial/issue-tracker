const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.use(cors());
app.use(express.json());
//app.use(express.urlsencoded({ extended: true }));

app.use(cookieSession({
    name: "Issue-tracker",
    secret: "I-GOT-ISSUES",
    httpOnly: true
    })
);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to my issue-tracker" });
});

// Routes
require("./routes/user")(app);
require("./routes/container.js")(app);
require("./routes/issue.js")(app);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});
