const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');

const auth = require('./middleware/auth.js');
const authUtil = require('./utility/authUtil.js');
const instanceHandler = require('./utility/instanceHandler');

const app = express();

app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(multer().array());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', auth.checkAuth, (req, res) => {
   res.render('index');
});

app.get('/login', auth.checkAlreadyLogged, (req, res) => {
   res.render('login');
});

app.post('/loginUser', auth.checkAlreadyLogged, (req, res) => {
   authUtil.loginUser(req, res);
});

app.get('/register', auth.checkAdmin, (req, res) => {
   res.render('register');
});

app.post('/registerUser', auth.checkAdmin, (req, res) => {
   authUtil.registerUser(req, res);
});

app.get('/launchStack', auth.checkAuth, auth.confirmToken, (req, res) => {
   const stack = req.query.stack;
   const containerName = instanceHandler.resolveContainer(stack);
   if (containerName == 'NOT_FOUND') res.render('errorPage', {'errorMessage': 'Invalid container!'});
   instanceHandler.runContainer(req, res, containerName);
});

var server = app.listen(5000, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port);
});