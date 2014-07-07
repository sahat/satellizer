/**
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

var _ = require('lodash');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var express = require('express');
var logger = require('morgan');
var jwt = require('jwt-simple');
var methodOverride = require('method-override');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
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

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false);
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (isMatch) return done(null, user);
      return done(null, false);
    });
  });
}));

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

mongoose.connect('localhost');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('tokenSecret', 'keyboard cat');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, '../../client')));

app.post('/api/login', passport.authenticate('local', { session: false }), function(req, res) {
  var payload = {
    prn: req.user.id,
    exp: moment().add('days', 7).valueOf()
  };
  var token = jwt.encode(payload, app.get('tokenSecret'));
  res.send({ token: token });
});

app.post('/api/signup', function(req, res, next) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
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