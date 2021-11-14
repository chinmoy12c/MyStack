const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const dbHandler = require('.//dbHandler.js');
const serverConstants = require("./serverConstants.js");

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

exports.getUserData = (req, res) => {
    var userData;
    jwt.verify(req.cookies.accessToken, serverConstants.JWT_SECRET_KEY, (err, data) => {
        if (err) {
            res.render('errorPage', {'errorMessage': 'Unauthorized!'});
            return;
        }
        
        userData = data;
    });

    return userData;
};
