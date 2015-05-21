var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var request = require('request');
var config = require('../../config');
var auth = require('../auth.service');
var User = require('../../api/me/user.model');

/*
 |--------------------------------------------------------------------------
 | Login with LinkedIn
 |--------------------------------------------------------------------------
 */
router.post('/', function(req, res) {
  var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.LINKEDIN_SECRET,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({ message: body.error_description });
    }
    var params = {
      oauth2_access_token: body.access_token,
      format: 'json'
    };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {

      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a LinkedIn account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.linkedin = profile.id;
            user.picture = user.picture || profile.pictureUrl;
            user.displayName = user.displayName || profile.firstName + ' ' + profile.lastName;
            user.save(function() {
              var token = auth.createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: auth.createJWT(existingUser) });
          }
          var user = new User();
          user.linkedin = profile.id;
          user.picture = profile.pictureUrl;
          user.displayName = profile.firstName + ' ' + profile.lastName;
          user.save(function() {
            var token = auth.createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

module.exports = router;
