const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require('dotenv').config();

const db = require("../config/sql_util.js");


module.exports = function(app) {

    app.post('/register', (req, res) => {
        const mail = req.body.mail;
        const name = req.body.username;
        const password = bcrypt.hashSync(req.body.password, 8);

        db.query('INSERT INTO usario (name, password, mail) VALUES (?,?,?)',
            [name, password, mail],
            (err, result) => {
                if(err) {
                    if(err.code === 'ER_DUP_ENTRY') {
                        return res.status(409).send('Email already exists');
                    } else {
                        return res.status(500).send('Error when querying database');
                    }
                } else {
                    res.sendStatus(201);
                }
            });
    });

    app.post('/logout', (req, res) => {
        // Remember to delete the token in the client
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(204);
        const refreshToken = cookies.jwt;

        // Is refreshToken in db
        db.query('UPDATE usario SET token = ? WHERE token = ?',
            [null, refreshToken],
            (err, result) => {
                if (err) {
                    return res.sendStatus(500);
                } else {
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
                    return res.sendStatus(204);
                }
            });
    });

    app.get('/refresh', (req, res) => {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.sendStatus(401);
        const refreshToken = cookies.jwt;

        db.query('SELECT * FROM usario WHERE token = ?',
            [refreshToken],
            (err, result) => {
                if (err) {
                    return res.sendStatus(403);
                } else {
                    // Verify token
                    jwt.verify(
                        refreshToken,
                        process.env.REFRESH_TOKEN_SECRET,
                        (err, decoded) => {
                            // Check errors and if the user is correct
                            if (err || result[0].id !== decoded.userid) return res.sendStatus(403);

                            // Generate new access token
                            const token = jwt.sign(
                                { userid: result[0].id },
                                process.env.ACCESS_TOKEN_SECRET, 
                                { expiresIn: '300s' }
                            )
                            res.status(200).send({ userid: result[0].id, token: token });
                        }
                    )
                }
            });
    });

    app.post('/login', (req, res) => {
        const mail = req.body.mail;
        const password = req.body.password;

        db.query('SELECT * FROM usario WHERE mail = ?',
            [mail],
            (err, result) => {
                if (err) {
                    return res.status(500).send({ error: "Could not access database" });
                } else {

                    // Check if user exists
                    if(!result[0]) return res.status(401).send({ error: "E-mail does not exist." });

                    // Check password
                    if (!bcrypt.compareSync(password, result[0].password)) return res.status(403).send({ error: "Wrong password." });
                    
                    // Generate tokens
                    const userid = result[0].id;
                    const token = jwt.sign(
                        { userid },
                        process.env.ACCESS_TOKEN_SECRET, 
                        { expiresIn: '300s' }
                    );
                    const refreshToken = jwt.sign(
                        { userid },
                        process.env.REFRESH_TOKEN_SECRET, 
                        { expiresIn: '1d' }
                    );

                    // Store refresh token in db.
                    db.query('UPDATE usario SET token = ? WHERE id = ?', [refreshToken, result[0].id], (err, result) => {
                        if(err) {
                            res.status(500);
                            res.send({error: "Could not store refresh token in database"})
                        } else {
                            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000});
                            res.status(200).send({ userid, token });
                        }
                    });
                }
            }
        );
    });
}

