const db = require('mysql');
const process = require('child_process');
const crypto = require('crypto');
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
            const cmd = 'docker exec '+serverConstants.caddyPassGenContainer+' caddy hash-password -plaintext "'+password+'" && \ ' + 
                        'docker volume create '+volume;
            process.exec(cmd,
            (err, stdout, stderr) => {
                if (err || stderr) {
                    res.render('errorPage', {'errorMessage' : 'Registration failed! Please try again.'});
                    console.log(err ? err : stderr);
                    return;
                }
                const caddyPass = stdout.split('\n')[0].trim();
                password = crypto.createHash('md5').update(password+serverConstants.HASH_SECRET_KEY).digest('hex');
                connection.query('INSERT INTO users (email, password, caddyPass, volume) VALUES (?, ?, ?, ?)',
                [email, password, caddyPass, volume],
                (error, result, fields) => {
                    if (error) {
                        res.render('errorPage', {'errorMessage' : 'Registration failed! Please try again.'});
                        console.log(err ? err : stderr);
                        return;
                    }
                    res.redirect('/');
                });
            });
        }
    });
};