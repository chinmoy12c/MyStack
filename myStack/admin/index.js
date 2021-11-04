const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');

const auth = require('./middleware/auth.js');

const app = express();

app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(multer().array());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', auth.checkAuth, (req, res) => {});

app.get('/login', auth.checkAuth, (req, res) => {});

app.post('/loginUser', (req, res) => {
   auth.loginUser(req, res);
});

app.get('/register', auth.checkAdmin, (req, res) => {
   res.render('register');
});

app.post('/registerUser', auth.checkAdmin, (req, res) => {
   auth.registerUser(req, res);
});

var server = app.listen(5000, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port);
});