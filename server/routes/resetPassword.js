var express = require('express'),
    router = express.Router(),
    crypto = require("crypto"),
    nodemailer = require('nodemailer'),
    async = require('async'),
    sgTransport = require('nodemailer-sendgrid-transport'),
    // passwordHash = require('password-hash'),
    emailGenerator      = require('./emailGenerator'),
    config = require('../config/config');

var User = require('../models/user.model');


 // getting token from email and checking if it's valid
router.get('/:token', function(req, res) {

  var token = req.params.token;
  User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if(err) {
      return res.status(403).json({
        title: 'An error occured',
        error: err
      });
    }
    if(!user) {
      return res.status(403).json({
        title: 'Password cannot be changed!',
        error: {message: 'Password reset token is invalid or has expired.'}
      })
    }
    return res.status(200).json({
      message: 'Success',
      token: token
    })
  });

});

// after getting token from email, check if it's still valid and then proceed in password reset by
// getting the user new password, hashing it and then reset the passwordToken and passwordExpires fields to undefined

router.post('/:token', function(req, res) {
  emailGenerator.sendMailResetPassword(req.params.token, req, res)
});

module.exports = router;
