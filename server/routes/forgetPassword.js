var express     = require('express'),
    router      = express.Router(),
    crypto      = require("crypto"),
    nodemailer  = require('nodemailer'),
    async       = require('async'),
    sgTransport = require('nodemailer-sendgrid-transport'),
    config      = require('../config/config');

var User = require('../models/user.model');


// requesting password reset and setting the fields resetPasswordToken to a newly generated token
// and resetPasswordExpires to the exact date the form is submitted so we can set/check the validity of the timestamp (token is valid for only one hour)
// after that, the user must request a new password reset.

router.post('/', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
          return res.status(403).json({
            title: 'There was an error',
            error: err
          });
        }
        if (!user) {
          return res.status(403).json({
            title: 'Please check if your email is correct',
            error: {message: 'Please check if your email is correct'}
          })
        }

        user.resetPasswordToken   = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },

    // sending the notification email to the user with the link and the token created above
    function (token, user, done) {
      // var options = {
      //   auth: {
      //     //please edit the config file and add your SendGrid credentials
      //     api_user: config.api_user,
      //     api_key: config.api_key
      //   }
      // };
      //var mailer  = nodemailer.createTransport(sgTransport(options));


      // see https://nodemailer.com/usage/
      var mailer = nodemailer.createTransport({
        // service: "Gmail",
        host: config.hostName,
        port: config.port,
        auth: {
          user: config.userGmail,
          pass: config.passGmail
        }
      })


      var html = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Email</title>
          <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"></link>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Montserrat', sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc;">
            <tr>
              <td align="center" bgcolor="#ff4351" height="150">
                <img
                  src="http://${req.headers.host}/assets/images/logo-mirabelle-400.png"
                  alt="Email de la part de Mirabelle" width="305" height="100" style="display: block; color: #ffffff;"
                />
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" style="padding: 15px 15px 15px 15px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding: 15px 0 30px 0;">
                      Vous recevez cet email car vous avez fait une demande de "mot de passe oublié" pour votre compte sur Mirabelle. Veuillez, s'il vous plait cliquer sur le bouton ci-dessous ou copier/coller le lien directement dans votre navigateur pour réinitialiser votre mot de passe :
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="background-color: #ff4351; padding: 10px 15px;">
                      <a
                        href="http://${req.headers.host}/#/user/reset/${token}"
                        style="background-color: #0a2f87; padding: 10px 15px; border: none; outline: none; color: #ffffff; text-decoration: none;"
                      >
                        Réinitialiser le mot de passe
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 15px 0 30px 0;">
                      Lien direct : http://${req.headers.host}/#/user/reset/${token}<br>
                      Le lien sera valide pendant une heure. Si vous n'avez pas demandé de réinitialisation de mot de passe, merci d'ignorer cet email.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#eeeeee">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                 <tr>
                  <td style="padding: 15px 15px 15px 15px;">
                    <a href="https://www.mirabelle.io/" style="text-decoration: none;">Site Web Mirabelle</a>
                  </td>
                  <td style="padding: 15px 15px 15px 15px;">
                    <a href="mailto:hello@mirabelle.io?Subject=false%reset" style="text-decoration: none;">Nous sontacter</a>
                  </td>
                 </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
      `;
      var mailOptions = {
        to: user.email,
        from: config.userGmail,
        subject: 'Mirabelle | Demande de changement de mot de passe  ',
        html: html
      };
      mailer.sendMail(mailOptions, function (err) {
        console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        return res.status(200).json({
          message: 'Success',
          token:'InMail'
        })
      });
    }
  ], function (err) {
    console.log(err)
    if (err) return next(err);
  });
});

module.exports = router;
