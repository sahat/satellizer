/**
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

var _ = require('lodash');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var express = require('express');
var logger = require('morgan');
var jwt = require('jwt-simple');
var methodOverride = require('method-override');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  facebook: {
    id: Number,
    email: String,
    firstName: String,
    lastName: String,
    displayName: String,
    link: String,
    locale: String
  },
  google: String,
  twitter: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, done) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return done(err);
    done(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

function ensureAuthenticated(req, res, next) {
  if (req.headers.authorization) {
    var token = req.headers.authorization.split(' ')[1];
    try {
      var decoded = jwt.decode(token, app.get('tokenSecret'));
      if (decoded.exp <= Date.now()) {
        res.send(400, 'Access token has expired');
      } else {
        User.findById(decoded.prn, '-password', function(err, user) {
          req.user = user;
          return next();
        });
      }
    } catch (err) {
      return next();
    }
  } else {
    return res.send(401);
  }
}

function getJwtToken(user) {
  var payload = {
    prn: user._id,
    exp: moment().add('days', 7).valueOf()
  };
  return jwt.encode(payload, app.get('tokenSecret'));
}

mongoose.connect('localhost');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('tokenSecret', 'keyboard cat');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '../../client')));
app.use(express.static(path.join(__dirname, '../../..')));

app.post('/auth/login', function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) return res.send(401, 'User does not exist');
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) return res.send(401, 'Invalid email and/or password');
      var token = getJwtToken(user);
      res.send({ token: token });
    });
  });
});

app.post('/auth/signup', function(req, res, next) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});

app.post('/auth/facebook', function(req, res, next) {
  var profile = req.body.profile;
  var signedRequest = req.body.signedRequest;
  var encodedSignature = signedRequest.split('.')[0];
  var payload = signedRequest.split('.')[1];

  var appSecret = '298fb6c080fda239b809ae418bf49700';

  var expectedSignature = crypto.createHmac('sha256', appSecret).update(payload).digest('base64');
  expectedSignature = expectedSignature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  if (encodedSignature !== expectedSignature) {
    return res.send(400, 'Bad signature');
  }


  User.findOne({ 'facebook.id': profile.id }, function(err, existingUser) {
    if (existingUser) return res.send(existingUser);
    var user = new User();
    user.facebook.id = profile.id;
    user.facebook.email = profile.email;
    user.facebook.firstName = profile.first_name;
    user.facebook.lastName = profile.last_name;
    user.facebook.displayName = profile.name;
    user.facebook.link = profile.link;
    user.facebook.locale = profile.locale;
    user.save(function(err) {
      if (err) return next(err);
      var token = getJwtToken(user);
      res.send(token);
    });
  });
});

app.get('/api/me', ensureAuthenticated, function(req, res) {
  res.send(req.user);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.send(500, { error: err.message });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});