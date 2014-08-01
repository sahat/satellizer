/**
 * (c) 2014 Sahat Yalkabov
 * License: MIT
 */

var _ = require('lodash');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var logger = require('morgan');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var querystring = require('querystring');

var config = {
  tokenSecret: 'keyboard cat',
  facebookSecret: '298fb6c080fda239b809ae418bf49700',
  googleSecret: 'xGxxgKAObIRUwOKycySkL9Fi',
  linkedinSecret: '7bDltzdHlP9b42xy',
  twitterSecret: ''
};

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  firstName: String,
  lastName: String,
  facebook: String,
  google: String,
  linkedin: String,
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
      var decoded = jwt.decode(token, config.tokenSecret);
      if (decoded.exp <= Date.now()) {
        res.send(400, 'Access token has expired');
      } else {
        req.user = decoded.user;
        return next();
      }
    } catch (err) {
      return res.send(500, 'Error parsing token');
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
  return jwt.encode(payload, config.tokenSecret);
}

mongoose.connect('localhost');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
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
  var tokenEndpoint = 'https://accounts.google.com/o/oauth2/token';
  var userinfoEndpoint = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    grant_type: 'authorization_code',
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.googleSecret,
    redirect_uri: req.body.redirectUri
  };

  request.post(tokenEndpoint, {
    json: true,
    form: params
  }, function(error, response, data) {
    var accessToken = data.access_token;
    var idToken = data.id_token;

    var jwtToken = idToken.split('.');
    var payload = new Buffer(jwtToken[1], 'base64').toString();

    User.findOne({ google: payload.sub }, function(err, existingUser) {
      if (existingUser) {
        var token = createJwtToken(existingUser);
        return res.send(token);
      }

      var authorizationHeader = { Authorization: 'Bearer ' + accessToken };
      request.get({
        url: userinfoEndpoint,
        headers: authorizationHeader,
        json: true
      }, function(error, response, profile) {
        var user = new User({
          google: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name
        });
        user.save(function(err) {
          if (err) return next(err);
          var token = createJwtToken(user);
          res.send(token);
        });
      });
    });
  });
});

app.post('/auth/linkedin', function(req, res, next) {

  var url = 'https://www.linkedin.com/uas/oauth2/accessToken';
  var params = {
    grant_type: 'authorization_code',
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.linkedinSecret,
    redirect_uri: req.body.redirectUri
  };

  console.log(params);

  request.post(url, { form: params, json: true }, function(err, response, data) {
    var accessToken = data.access_token;
    var url = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name)';
    var params = {
      oauth2_access_token: accessToken,
      format: 'json'
    };
    request.get({ url: url, qs: params, json: true }, function(error, response, profile) {
      User.findOne({ linkedin: profile.id }, function(err, existingUser) {
        if (existingUser) {
          var token = createJwtToken(existingUser);
          return res.send(token);
        }
        var user = new User({
          linkedin: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName
        });
        user.save(function(err) {
          if (err) return next(err);
          var token = createJwtToken(user);
          res.send(token);
        });
      });

    });
  });
});

app.post('/auth/facebook', function(req, res, next) {
  var url = 'https://graph.facebook.com/oauth/access_token';
  var params = querystring.stringify({
    redirect_uri: req.body.redirectUri,
    client_secret: config.facebookSecret,
    client_id: req.body.clientId,
    code: req.body.code
  });

  request.get([url, params].join('?'), function(error, response, data) {
    var accessToken = querystring.parse(data).access_token;
    var graphApiUrl = 'https://graph.facebook.com/me';
    var params = {
      access_token: accessToken
    };
    request.get({
      url: graphApiUrl,
      qs: params,
      json: true
    }, function(error, response, profile) {
      User.findOne({ facebook: profile.id }, function(err, existingUser) {
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
  });
});

app.get('/auth/twitter', function(req, res, next) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var callbackUrl = encodeURIComponent('http://localhost:3000/auth/twitter');
  var consumerKey = 'vdrg4sqxyTPSRdJHKu4UVVdeD';
  var consumerSecret = 'cUIobhRgRlXsFyObUMg3tBq56EgGSwabmcavQP4fncABvotRMA';
  var oauth;

  // Handle twitter callback here
  if (req.query.oauth_token && req.query.oauth_verifier) {
    oauth = {
      consumer_key: 'vdrg4sqxyTPSRdJHKu4UVVdeD',
      consumer_secret: 'cUIobhRgRlXsFyObUMg3tBq56EgGSwabmcavQP4fncABvotRMA',
      token: req.query.oauth_token,
      verifier: req.query.oauth_verifier
    };
    request.post({ url: accessTokenUrl, oauth: oauth }, function(error, response, body) {
      var profile = querystring.parse(body);
      User.findOne({ twitter: profile.user_id }, function(err, existingUser) {
        if (existingUser) {
          var token = createJwtToken(existingUser);
          return res.redirect('http://localhost:3000?token=' + token);
        }
        var user = new User({
          twitter: profile.user_id,
          firstName: profile.screen_name,
        });
        user.save(function(err) {
          if (err) return next(err);
          var token = createJwtToken(user);
          console.log('here is your JWT token', token);
          console.log(user);
          res.redirect('http://localhost:3000?token=' + token);
        });
      });
    });
  } else {
    oauth = {
      consumer_key: 'vdrg4sqxyTPSRdJHKu4UVVdeD',
      consumer_secret: 'cUIobhRgRlXsFyObUMg3tBq56EgGSwabmcavQP4fncABvotRMA',
      callback: 'http://localhost:3000/auth/twitter'
    };
    request.post({ url: requestTokenUrl, oauth: oauth }, function (error, response, body) {
      var token = querystring.parse(body);
      res.redirect('https://api.twitter.com/oauth/authenticate?oauth_token=' + token.oauth_token);
    });
  }
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