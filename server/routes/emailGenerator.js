var express     = require('express'),
    router      = express.Router(),
    crypto      = require("crypto"),
    nodemailer  = require('nodemailer'),
    async       = require('async'),
    Quote = require('../models/quote.model'),
    passwordHash = require('password-hash'),
    sgTransport = require('nodemailer-sendgrid-transport'),
    config      = require('../config/config');


var transportOptions = {
  // service: "Gmail",
  host: config.hostName,
  port: config.port,
  auth: {
    user: config.userGmail,
    pass: config.passGmail
  }
}

module.exports = {
  sendQuoteByEmailToClient(req, res, next) {

    return new Promise(function(resolve, reject) {
      Quote.findById(req.params.quoteId).populate({path: 'clients', model: 'User'}).exec(function(err, obj) {
        if (err) {
          reject(new Error({message: 'An error occured', err: err}))
        }
        if (!obj) {
          reject(new Error({
            title: 'No form found',
            error: {
              message: 'Form not found!'
            }
          }))
        }
        obj.clients.forEach(client => {

          var html = `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
              <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Email depuis Belmard Gestion</title>
                <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"></link>
              </head>
              <body style="margin: 0; padding: 0; font-family: 'Montserrat', sans-serif;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc;">

                  <tr>
                    <td bgcolor="#ffffff" style="padding: 15px 15px 15px 15px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td>Bonjour,</td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0 30px 0;">
                            Merci de trouver un document
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="background-color: #0a2f87; padding: 10px 15px; cursor: pointer;">
                            <a
                              href="http://${req.headers.host}/uploads/pdf/${req.params.quoteId}.pdf"
                              style="color: #ffffff; text-decoration: none;"
                            >
                              Voir le Devis
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
            `;

          var mailer = nodemailer.createTransport({
            // service: "Gmail",
            host: config.hostName,
            port: config.port,
            auth: {
              user: config.userGmail,
              pass: config.passGmail
            }
          })
          var mailOptions = {
            to: client.email,
            from: config.userGmail,
            subject: 'Gooplus Management | Nouveau document',
            html: html
          };
          mailer.sendMail(mailOptions, function(err) {
            if(err) {
              console.log('ttt')
              reject(new Error({message: 'An error occured', err: err}))
            }
            // console.log('info', 'An e-mail has been sent.');
            resolve({message: 'Success', obj: 'Mail sent to ' + client.email})
          });
        })
      })
    })
  },
  sendMailResetPassword(token, req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          console.log(user)
          if(err) {
            return res.status(403).json({
              title: 'An error occured',
              error: err
            });
          }
          if(!user) {
            return res.status(403).json({
              title: 'There was an error',
              error: {message: 'Please check if your email is correct'}
            })
          }
          user.password = passwordHash.generate(req.body.password);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;


          user.save(function (err, result) {
            if (err) {
              return res.status(403).json({
                title: 'There was an issue',
                error: {message: 'The email you entered already exists'}
              });
            }
            res.status(200).json({
              message: 'Password updated',
              obj: result
            })
          })
        });
      },

      // sending notification email to user that his password has changed
      function(user, done) {
        // var options = {
        //   auth: {
        //     api_user: config.api_user,
        //     api_key:  config.api_key
        //   }
        // };
        // var mailer = nodemailer.createTransport(sgTransport(options));
        var mailer = nodemailer.createTransport(transportOptions);

        var mailOptions = {
          to: user.email,
          from: 'contact@mirabelle.io',
          subject: 'Modification du mot de passe sur Mirabelle',
          text: 'Bonjour,\n\n' +
          'Vous recevez cet email pour vous informer que la mot de passe pour du compte ' + user.email + ' a bien été modifié.\n'
        };
        mailer.sendMail(mailOptions, function(err) {
          console.log('info', 'Un message a été envoyé à ' + user.email + ' avec de plus amples informations.');
          return res.status(200).json({
            message: 'Succès'
          })
        });
      }
    ], function(err) {
      if (err) {
      }
    });
  },
  sendForgetEmail(req, res, next) {
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
          var mailer = nodemailer.createTransport(transportOptions)


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
                        <td align="center" style="background-color: #fff; padding: 10px 15px;">
                          <a
                            href="http://${req.headers.host}/#/user/reset/${token}"
                            style="background-color: #ff4351; padding: 10px 15px; border: none; outline: none; color: #ffffff; text-decoration: none;"
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
                  <td bgcolor="#ff4351">
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
  },
  sendEmailToUserToJoinCompanie(req, user) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });

      },
      function(token, user, done) {
        var mailer = nodemailer.createTransport(transportOptions)
        var html = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Email depuis Mirabelle</title>
            <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"></link>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Montserrat', sans-serif;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc;">

              <tr>
                <td bgcolor="#ffffff" style="padding: 15px 15px 15px 15px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td>Bonjour ${user.profile.name} ${user.profile.lastName},</td>
                    </tr>
                    <tr>
                      <td style="padding: 15px 0 30px 0;">
                        Vous êtes invité à rejoindre l'application Mirabelle.io
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="background-color: #0a2f87; padding: 10px 15px; cursor: pointer;">
                        <a
                          href="http://${req.headers.host}/#/user/reset/${token}"
                          style="color: #ffffff; text-decoration: none;"
                        >
                          Accepter l'invitation
                        </a>
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
          subject: 'Gooplus Management | New Invitation',
          html: html
        };
        mailer.sendMail(mailOptions, function(err) {
          console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          return res.status(200).json({message: 'Success', token: 'InMail'})
        });
      }
    ], function(err) {
      console.log(err)
      if (err)
        return next(err);
      }
    );
  }

}
