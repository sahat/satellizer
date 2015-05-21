var express = require('express');
var router = express.Router();

router.use('/', require('./providers/local'));
router.use('/facebook', require('./providers/facebook'));
router.use('/google', require('./providers/google'));
router.use('/unlink', require('./providers/unlink'));

module.exports = router;
