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
var request = require('request');
var jwt = require('jwt-simple');
var methodOverride = require('method-override');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  firstName: String,
  lastName: String,
  facebook: String,
  google: String,
  linkedin: String
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
        return next();
      }
    } catch (err) {
      return next();
    }
  } else {
    return res.send(401);
  }
}

function createJwtToken(user) {
  var payload = {
    user: user,
    iat: new Date().getTime(),
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
      var token = createJwtToken(user);
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

app.post('/auth/google', function(req, res, next) {
  var accessToken = req.body.accessToken;
  var profile = req.body.profile;

  request.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken, function (e, r, tokenInfo) {
    console.log(tokenInfo);
    if (tokenInfo.user_id !== profile.user_id) {
      return res.send(400, 'Invalid Token');
    }
    User.findOne({ google: profile.user_id }, '-password', function(err, existingUser) {
      if (existingUser) {
        var token = createJwtToken(existingUser);
        return res.send(token);
      }
      var user = new User({
        google: profile.user_id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName
      });
      user.save(function(err) {
        if (err) return next(err);
        var token = createJwtToken(user);
        res.send(token);
      });
    });
  });
});


app.post('/auth/linkedin', function(req, res, next) {

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

  User.findOne({ facebook: profile.id }, '-password', function(err, existingUser) {
    if (existingUser) {
      var token = createJwtToken(existingUser);
      return res.send(token);
    }
    var user = new User({
      facebook: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name
    });
    user.save(function(err) {
      if (err) return next(err);
      var token = createJwtToken(user);
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