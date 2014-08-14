/**
 * Satellizer Node.js Demo
 * (c) 2014 Sahat Yalkabov <sahat@me.com>
 * License: MIT
 */

var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var express = require('express');
var logger = require('morgan');
var request = require('request');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var path = require('path');
var qs = require('querystring');

var config = {
  tokenSecret: 'keyboard cat',
  facebook: {
    clientSecret: '298fb6c080fda239b809ae418bf49700'
  },
  google: {
    clientSecret: 'xGxxgKAObIRUwOKycySkL9Fi'
  },
  linkedin: {
    clientSecret: '7bDltzdHlP9b42xy'
  },
  twitter: {
    consumerKey: 'vdrg4sqxyTPSRdJHKu4UVVdeD',
    consumerSecret: 'cUIobhRgRlXsFyObUMg3tBq56EgGSwabmcavQP4fncABvotRMA',
    callbackUrl: 'http://localhost:3000'
  }
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
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://demo:demo@kahana.mongohq.com:10014/satellizer');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, '../../client')));

app.get('/api/me', ensureAuthenticated, function(req, res) {
  res.send(req.user);
});

////////////////////////////////////////////////////////////////////////////////
// Log in with Email ///////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      return res.send(401, 'Wrong email or password');
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.send(401, 'Wrong email or password');
      }
      user = user.toObject();
      delete user.password;
      var token = createJwtToken(user);
      res.send({ token: token });
    });
  });
});

////////////////////////////////////////////////////////////////////////////////
// Create Email and Password Account ///////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.post('/auth/signup', function(req, res) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });
  user.save(function() {
    res.send(200);
  });
});

////////////////////////////////////////////////////////////////////////////////
// Log in with Google //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.post('/auth/google', function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: config.google.clientSecret,
    code: req.body.code,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(error, response, token) {

    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(error, response, profile) {
      User.findOne({ google: profile.sub }, function(err, user) {
        if (user) {
          var token = createJwtToken(user);
          return res.send({ token: token });
        }
        user = new User({
          google: profile.sub,
          firstName: profile.given_name,
          lastName: profile.family_name
        });
        user.save(function() {
          var token = createJwtToken(user);
          res.send({ token: token });
        });
      });
    });
  });
});

////////////////////////////////////////////////////////////////////////////////
// Log in with LinkedIn ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.post('/auth/linkedin', function(req, res) {
  var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name)';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: config.linkedin.clientSecret,
    code: req.body.code,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { form: params, json: true }, function(err, response, accessToken) {

    var params = {
      oauth2_access_token: accessToken.access_token,
      format: 'json'
    };

    // Step 2. Retrieve information about the current user.
    request.get({ url: peopleApiUrl, qs: params, json: true }, function(error, response, profile) {
      User.findOne({ linkedin: profile.id }, function(err, user) {
        if (user) {
          var token = createJwtToken(user);
          return res.send({ token: token });
        }
        user = new User({
          linkedin: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName
        });
        user.save(function() {
          var token = createJwtToken(user);
          res.send({ token: token });
        });
      });
    });
  });
});

////////////////////////////////////////////////////////////////////////////////
// Log in with Facebook ////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.post('/auth/facebook', function(req, res) {
  var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/me';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: config.facebook.clientSecret,
    code: req.body.code
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params }, function(error, response, accessToken) {
    accessToken = qs.parse(accessToken);
    console.log(accessToken)

    // Step 2. Retrieve information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(error, response, profile) {
      console.log(profile)
      User.findOne({ facebook: profile.id }, function(err, user) {
        if (user) {
          var token = createJwtToken(user);
          return res.send({ token: token });
        }
        user = new User({
          facebook: profile.id,
          firstName: profile.first_name,
          lastName: profile.last_name
        });
        user.save(function() {
          var token = createJwtToken(user);
          res.send({ token: token });
        });
      });
    });
  });
});

////////////////////////////////////////////////////////////////////////////////
// Log in with Twitter /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.get('/auth/twitter', function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var authenticateUrl = 'https://api.twitter.com/oauth/authenticate';

  if (req.query.oauth_token && req.query.oauth_verifier) {
    var accessTokenOauth = {
      consumer_key: config.twitter.consumerKey,
      consumer_secret: config.twitter.consumerSecret,
      token: req.query.oauth_token,
      verifier: req.query.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(error, response, profile) {
      profile = qs.parse(profile);
      User.findOne({ twitter: profile.user_id }, function(err, user) {
        if (user) {
          var token = createJwtToken(user);
          return res.send({ token: token });
        }
        user = new User({
          twitter: profile.user_id,
          firstName: profile.screen_name
        });
        user.save(function() {
          var token = createJwtToken(user);
          res.send({ token: token });
        });
      });
    });
  } else {
    var requestTokenOauth = {
      consumer_key: config.twitter.consumerKey,
      consumer_secret: config.twitter.consumerSecret,
      callback: config.twitter.callbackUrl
    };

    // Step 1. Obtain request token.
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(error, response, body) {
      var oauthToken = qs.parse(body);
      var params = qs.stringify({ oauth_token: oauthToken.oauth_token });

      // Step 2. Redirect to the authorization screen.
      res.redirect(authenticateUrl + '?' + params);
    });
  }
});

////////////////////////////////////////////////////////////////////////////////
// Login Required Middleware ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.send(401);
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.tokenSecret);

  if (payload.exp <= Date.now()) {
    return res.send(401, 'Token has expired');
  }

  req.user = payload.user;
  next();
}

////////////////////////////////////////////////////////////////////////////////
// Generate JSON Web Token /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function createJwtToken(user) {
  var payload = {
    user: user,
    iat: moment().valueOf(),
    exp: moment().add(7, 'days').valueOf()
  };
  return jwt.encode(payload, config.tokenSecret);
}

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});