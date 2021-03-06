const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');

const auth = require('./middleware/auth.js');
const authUtil = require('./utility/authUtil.js');
const instanceHandler = require('./utility/instanceHandler');
const dbHandler = require('./utility/dbHandler.js');

const app = express();

app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(multer().array());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', auth.checkAuth, async (req, res) => {
   const instances = await dbHandler.getInstances(req, res);
   instances.forEach(instance => {
      instance.icon = instanceHandler.resolveStackIcon(instance.stackName);
      console.log(instanceHandler.resolveStackIcon(instance.stackName));
   });
   res.render('index', {instances : instances});
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

app.get('/logout', (req, res) => {
   res.clearCookie('accessToken');
   res.redirect('/');
});

app.get('/launchStack', auth.checkAuth, auth.confirmToken, (req, res) => {
   const stack = req.query.stack;
   const containerName = instanceHandler.resolveContainer(stack);
   if (containerName == 'NOT_FOUND') res.render('errorPage', {'errorMessage': 'Invalid container!'});
   instanceHandler.runContainer(req, res, containerName);
});

app.post('/stopContainer', auth.checkAuth, auth.confirmToken, async (req, res) => {
   const instanceId = parseInt(req.body.instanceId);
   if (isNaN(instanceId)) res.end();
   const instance = await dbHandler.deleteInstance(req, res, instanceId);
   if (instance == null) res.end();
   instanceHandler.stopContainer(req, res, instance);
   res.end();
});

const server = app.listen(5000);