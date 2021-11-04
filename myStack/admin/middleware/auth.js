const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const dbHandler = require('../utility/dbHandler.js');
const serverConstants = require("../utility/serverConstants.js");

exports.checkAuth = (req, res, next) => {
    if (req.cookies.accessToken != undefined)
        res.render('index');
    else
        res.render('login');
};

exports.checkAdmin = (req, res, next) => {
    if (req.cookies.accessToken != undefined) {
        jwt.verify(req.cookies.accessToken, serverConstants.CADDY_SECRET_KEY, (err, data) => {
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
    dbHandler.checkLoginDetails(req, res, email, password);
};

exports.registerUser = (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password;
    if (email == '') res.render('errorPage', {'errorMessage': 'Username required!'});
    else if (password == '') res.render('errorPage', {'errorMessage': 'Password required!'});
    dbHandler.registerUserDetails(req, res, email, password);
};