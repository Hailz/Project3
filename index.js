var express = require('express');
var bodyParser = require('body-parser');
require("dotenv").config();
var path = require('path');


// JSON web token dependencies, including a secret key to sign the token
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var secret = process.env.SECRET;

var app = express();

// mongoose models and connection
var mongoose = require('mongoose');
var User = require('./models/user');
// var Comments = require('./models/comments');
// var Excuses = require('./models/excuses');
// var Favorites = require('./models/favorites');
mongoose.connect('mongodb://localhost/Project3');

// decode POST data in JSON and URL encoded formats
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('morgan')('dev'));


app.use('/api/users', expressJWT({secret: secret}).unless({
    path: [{ url: '/api/users', methods: ['POST'] }]
}), require('./controllers/users'));

app.use('/api/excuses', require('./controllers/excuses'));
// app.use('/api/comments', require('./controllers/comments'));
// app.use('/api/favorites', require('./controllers/favorites'));

// this middleware will check if expressJWT did not authorize the user, and return a message
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ message: 'You need an authorization token to view this information.' });
    }
});

// POST /api/auth - if authenticated, return a signed JWT
app.post('/api/auth', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
        // return 401 if error or no user
        if (err || !user) return res.status(401).send({ message: 'User not found' });

        // attempt to authenticate a user
        var isAuthenticated = user.authenticated(req.body.password);
        // return 401 if invalid password or error
        if (err || !isAuthenticated) return res.status(401).send({ message: 'User not authenticated' });

        // sign the JWT with the user payload and secret, then return
        var token = jwt.sign(user.toJSON(), secret);

        return res.send({ user: user, token: token });
    });
});

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Controllers
app.use('/twilioClient', require('./controllers/twilioClient'));


var server = app.listen(process.env.PORT || 3000);

module.exports = server;
