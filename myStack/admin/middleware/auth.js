const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const dbHandler = require('../utility/dbHandler.js');
const serverConstants = require("../utility/serverConstants.js");

exports.checkAuth = (req, res, next) => {
    if (req.cookies.accessToken == undefined)
        res.redirect('/login');
    else
        next();
};

exports.checkAlreadyLogged = (req, res, next) => {
    if (req.cookies.accessToken != undefined)
        res.redirect('/');
    else
        next();
};

exports.confirmToken = (req, res, next) => {
    jwt.verify(req.cookies.accessToken,serverConstants.JWT_SECRET_KEY, (err, data) => {
        if (err) {
            res.render('errorPage', {'errorMessage': 'Authorization Failure!'});
            return;
        }
        next();
    });
};

exports.checkAdmin = (req, res, next) => {
    if (req.cookies.accessToken != undefined) {
        jwt.verify(req.cookies.accessToken, serverConstants.JWT_SECRET_KEY, (err, data) => {
            if (err || data.role != 'admin') {
                res.render('errorPage', {'errorMessage': 'Unauthorized!'});
                return;
            }
            next();
        });
    }
    else
        res.render('errorPage', {'errorMessage': 'Unauthorized!'});
};
