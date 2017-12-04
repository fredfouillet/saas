var express = require('express'),
  router = express.Router(),
  config = require('../config/config'),
  User = require('../models/user.model'),
  Companie = require('../models/companie.model'),
  PaiementQuote = require('../models/paiementQuote.model'),
  // fs      = require('fs'),
  jwt = require('jsonwebtoken'),
  stripe = require("stripe")(config.stripe.client_secret);

router.use('/', function(req, res, next) {
  var token = req.headers['authorization'];
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      return res.status(401).json({title: 'Authentication failed', message: 'Authentication failed', error: err})
    }
    if (!decoded) {
      return res.status(403).json({
        title: 'Authentication failed',
        error: {
          message: 'Authentication failed'
        }
      });
    }
    if (decoded) {

      User.findById(decoded.user._id).populate({path: 'rights', model: 'Right'}).exec(function(err, doc) {
        if (err) {
          return res.status(500).json({title: 'Fetching user failed', message: 'Fetching user failed', err: err});
        }
        if (!doc) {
          return res.status(404).json({
            title: 'The user was not found',
            error: {
              message: 'The user was not found'
            }
          })
        }
        // if (!shared.isCurentUserHasAccess(doc, nameObject, 'plan')) {
        //   return res.status(404).json({
        //     title: 'No rights',
        //     error: {
        //       message: 'No rights'
        //     }
        //   })
        // }
        if (doc) {
          req.user = doc;
          next();
        }
      });
    }
  });
});

//
// router.get('/getStripeCust/:paiementQuoteId', function (req, res, next) {
//     PaiementQuote.findById((req.params.paiementQuoteId), function (err, obj) {
//       if (err) {
//         return res.status(500).json({
//           message: 'An error occured',
//           err: err
//         })
//       }
//       if (!obj) {
//         return res.status(404).json({
//           title: 'No obj found',
//           error: {message: 'Obj not found!'}
//         })
//       }
//
//
//                 stripe.customers.retrieve(obj.stripe.cusId,
//                   function(err, customer) {
//                     if(err) {
//                       return res.status(404).json({
//                         title: 'No data in stripe',
//                         error: 'noData'
//                       });
//                     } else {
//                       if(customer.deleted) {
//                         return res.status(404).json({
//                           title: 'Deleted',
//                           error: customer
//                         });
//                       }
//                       return res.status(200).json({
//                         customer: customer
//                       })
//                     }
//                   }
//                 );
//           })
//
// })

router.get('/goToLinkAuthorizeConnect', function(req, res, next) {
  let url = 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=' + config.stripe.connect.client_id + '&scope=read_write&redirect_uri=http://' + req.headers.host + '/%23/companie/mine'
  return res.status(200).json({message: 'ok', url: url});
})
// router.get('/getStripeAccountDetails', function(req, res, next) {
//   // if(!req.user.paiement.stripe.cusId) {
//   //   return res.status(404).json({
//   //     title: 'No data',
//   //     error: 'noData'
//   //   });
//   // }
//
//   stripe.accounts.retrieve(
//   // req.user.paiement.stripe.cusId,
//   '', function(err, customer) {
//     if (err) {
//       return res.status(404).json({title: 'No data in stripe', error: 'noData'});
//     } else {
//       if (customer.deleted) {
//         return res.status(404).json({title: 'Deleted', error: customer});
//       }
//       return res.status(200).json({customer: customer})
//     }
//   });
// })

router.post('/payByCardConnect/:paiementQuoteId', function(req, res, next) {

  PaiementQuote
  .findById(req.params.paiementQuoteId)
  .populate({path: 'ownerCompanies', model: 'Companie'})
  .exec(function (err, paiementQuote) {
    if (err) {
      return res.status(404).json({message: err, err: err})
    }
    // Companie.findById(({_id: req.user.ownerCompanies[0]}), function(err, item) {
    //   if (err) {
    //     return res.status(404).json({message: err, err: err})
    //   }
    if(!paiementQuote.ownerCompanies.length) {
      return res.status(404).json({message: 'error', err: 'no companies'})
    }
    if(!paiementQuote.ownerCompanies[0].banck.stripe.stripe_user_id) {
      // return res.status(404).json({message: 'error', err: 'no Stripe'})
      return res.status(401).json({
        message: 'No Stripe',
        error: {
          message: 'No Stripe'
        }
      })
    }


      let card = req.body
      delete card.id
      delete card.brand
      delete card.country
      delete card.funding
      delete card.last4

      stripe.tokens.create({
        card: card
      }, function(err, token) {
        if (err) {
          return res.status(404).json({title: 'Error', error: err});
        }
        stripe.charges.create({
          amount: paiementQuote.amount * 100,
          currency: "eur",
          source: token.id,
          destination: {
            account: paiementQuote.ownerCompanies[0].banck.stripe.stripe_user_id
          }
        }, function(err, charge) {
          if (err) {
            return res.status(404).json({title: 'Error', error: err});
          }
          PaiementQuote.update({
            _id: req.params.paiementQuoteId
          }, {
            $set: {
              'stripe.charge': charge
            }
          }, function(err, item) {
            if (item) {
              return res.status(200).json({charge: charge})
            } else {
              return res.status(404).json({title: 'Error Not Updtaed price', error: err});
            }
          });
        });
      });

    // })
  })

})

router.post('/deauthorizeConnect/', function(req, res, next) {

  Companie.findById(({_id: req.user.ownerCompanies[0]}), function(err, item) {
    if (err) {
      return res.status(404).json({
        title: 'error',
        error: {
          message: err
        }
      })
    }


    // var request = require('request');
    // request.post({
    //   url: 'https://connect.stripe.com/oauth/deauthorize',
    //   formData: {
    //     client_id: 'ca_BhWB8WgFBFUnPTvA9d0wgqcVJgGUJufg',
    //     stripe_user_id: item.banck.stripe.stripe_user_id
    //   },
    //   headers: {
    //     'Authorization': 'Bearer sk_test_cg4vcpE5gV1ApywsErwoWL7u'
    //   }
    // }, function (error, response, body){
    //   // console.log(error)
    //   // console.log(response)
    //   // console.log(body)
    // }
    // );

    var request = require('request');
    request.post({
      url: 'https://connect.stripe.com/oauth/deauthorize',
      formData: {
        client_id: config.stripe.connect.client_id,
        stripe_user_id: item.banck.stripe.stripe_user_id
      },
      headers: {
        'Authorization': 'Bearer ' + config.stripe.client_secret
      }
    }, function (error, response, body){
      if (error) {
        return res.status(404).json({
          title: 'error',
          error: {
            message: error
          }
        })
      }

      item.banck.stripe.stripe_user_id = ''
      item.save(function(err, result) {
        if (err) {
          return res.status(404).json({
            title: 'error',
            error: {
              message: err
            }
          })
        }
        res.status(201).json({message: '', obj: response});
      })
    }
    );

    // console.log(item.banck.stripe.stripe_user_id)
    // stripe.accounts.del(item.banck.stripe.stripe_user_id, function(err, customer) {
    //   console.log(err)
    //   console.log(customer)
    // })


  });
})

router.post('/oauthConnect/', function(req, res, next) {
  // https://stripe.com/docs/connect/standard-accounts
  var request = require('request');
  request.post({
    url: 'https://connect.stripe.com/oauth/token',
    form: {
      grant_type: "authorization_code",
      client_id: config.stripe.connect.client_id,
      // code: 'ac_BiqcZX1ERhGI7J0KTq9s4Lc7Iol2OTxQ',
      code: req.body.code,
      client_secret: config.stripe.client_secret
    }
  }, function(err, r, body) {
    if (err) {
      return res.status(404).json({message: 'There was an error, please try again', err: err});
    }
    Companie.findById(({_id: req.user.ownerCompanies[0]}), function(err, item) {
      if (err) {
        return res.status(404).json({message: err, err: err})
      }
      if (JSON.parse(body).error) {
        return res.status(404).json({message: JSON.parse(body).error, err: JSON.parse(body).error_description})
      }
      item.banck.stripe.stripe_user_id = JSON.parse(body).stripe_user_id
      item.save(function(err, result) {
        if (err) {
          return res.status(404).json({message: 'There was an error, please try again', err: err});
        }
        res.status(201).json({message: '', obj: result});
      });
    })

    // console.log(body)
    // var accessToken = JSON.parse(body).access_token;
    //
    //  Do something with your accessToken
    //
    //  For demo"s sake, output in response:
    // res.send({ "Your Token": accessToken });

  });

})

router.get('/getUserInfosConnect', function(req, res, next) {
  Companie.findById((req.user.ownerCompanies[0]), function(err, companie) {
    if (!companie.banck.stripe.stripe_user_id) {
      return res.status(404).json({title: 'No data', error: 'noData'});
    }

    // console.log(companie.banck.stripe.stripe_user_id)
    stripe.accounts.retrieve(companie.banck.stripe.stripe_user_id, function(err, customer) {
      if (err) {
        return res.status(404).json({title: 'No data in stripe', error: 'noData'});
      } else {
        if (customer.deleted) {
          return res.status(404).json({title: 'Deleted', error: customer});
        }
        return res.status(200).json({customer: customer})
      }
    });
  })
})




module.exports = {
  router: router,
}
