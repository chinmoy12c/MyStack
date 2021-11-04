const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const serverConstants = require("../serverConstants.js");

exports.checkAuth = (req, res, next) => {
    if (req.cookies.accessToken != undefined)
        next();
    else
        res.redirect('/login');
};

exports.checkAdmin = (req, res, next) => {
    if (req.cookies.accessToken != undefined) {
        jwt.verify(req.cookies.accessToken, serverConstants.SECRET_KEY, (err, data) => {
            if (err || data.role != 'admin') {
                res.render('errorPage', {'errorMessage': 'Unauthorized!'});
            }
            next();
        });
    }
    else
        res.render('errorPage', {'errorMessage': 'Unauthorized!'});
};

exports.loginUser = (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password;
    if (email == '') res.render('errorPage', {'errorMessage': 'Username required!'});
    else if (password == '') res.render('errorPage', {'errorMessage': 'Password required!'});

    const accessToken = jwt.sign({email: email, role: 'admin'}, serverConstants.SECRET_KEY);
    res.cookie('accessToken', accessToken);
    res.redirect('/');
};