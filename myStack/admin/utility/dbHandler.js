const db = require('mysql');
const process = require('child_process');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const serverConstants = require('./serverConstants.js');

const connection = db.createConnection({
    host: serverConstants.dbHost,
    user: serverConstants.dbUser,
    password: serverConstants.dbPassword,
    database: serverConstants.database
});

exports.registerUserDetails = (req, res, email, password) => {
    connection.query('SELECT email FROM users WHERE email = ?',
    [email], 
    (error, result, fields) => {
        if (error) {
            res.render('errorPage', {'errorMessage' : 'Registration failed! Please try again.'});
            // connection.end();
            return;
        }
        if (result.length > 0) {
            res.render('errorPage', {'errorMessage' : 'This user already exists!'});
            // connection.end();
        }
        else {
            const volume = crypto.randomBytes(16).toString("hex");
            const cmd = `${serverConstants.scriptsDir}/createCaddyHash.sh -c ${serverConstants.caddyPassGenContainer} -p ${password} && \ ` +
                        `${serverConstants.scriptsDir}/createVolume.sh ${volume}`;
            process.exec(cmd,
            (err, stdout, stderr) => {
                if (err || stderr) {
                    res.render('errorPage', {'errorMessage' : 'Registration failed! Please try again.'});
                    console.log(err ? err : stderr);
                    return;
                }
                const caddyPass = stdout.split('\n')[0].trim();
                password = crypto.createHash('md5').update(password+serverConstants.HASH_SECRET_KEY).digest('hex');
                connection.query('INSERT INTO users (email, password, caddyPass, volume, type) VALUES (?, ?, ?, ?, ?)',
                [email, password, caddyPass, volume, 'user'],
                (error, result, fields) => {
                    if (error) {
                        res.render('errorPage', {'errorMessage' : 'Registration failed! Please try again.'});
                        console.log(err ? err : stderr);
                        return;
                    }
                    res.send('Registered!');
                });
            });
        }
    });
};

exports.checkLoginDetails = (req, res, email, password) => {
    password = crypto.createHash('md5').update(password+serverConstants.HASH_SECRET_KEY).digest('hex');
    connection.query('SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, result, fields) => {
        if (err) {
            res.render('errorPage', {'errorMessage' : 'Login failed! Please try again.'});
            return;
        }

        if (result.length == 0) {
            res.render('errorPage', {'errorMessage' : 'Username or Password wrong!'});
            return;
        }

        const accessToken = jwt.sign({
            email: result[0].email,
            role: result[0].type,
            caddyPass: result[0].caddyPass,
            volume: result[0].volume
        }, serverConstants.JWT_SECRET_KEY);
        res.cookie('accessToken', accessToken);
        res.redirect('/');
    });
};
