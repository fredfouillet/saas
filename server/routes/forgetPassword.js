var express     = require('express'),
    router      = express.Router(),
    crypto      = require("crypto"),
    nodemailer  = require('nodemailer'),
    async       = require('async'),
    sgTransport = require('nodemailer-sendgrid-transport'),
    emailGenerator      = require('./emailGenerator'),
    config      = require('../config/config');

var User = require('../models/user.model');


// requesting password reset and setting the fields resetPasswordToken to a newly generated token
// and resetPasswordExpires to the exact date the form is submitted so we can set/check the validity of the timestamp (token is valid for only one hour)
// after that, the user must request a new password reset.

router.post('/', function (req, res, next) {
  emailGenerator.sendForgetEmail(req, res, next)
});

module.exports = router;
