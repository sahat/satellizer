var express = require('express');
var router = express.Router();

var auth = require('../auth.service');
var User = require('../../api/me/user.model');

/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
router.get('/auth/unlink/:provider', auth.ensureAuthenticated, function(req, res) {
  var provider = req.params.provider;
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
});

module.exports = router;
