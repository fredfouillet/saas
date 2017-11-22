var express = require('express'),
  router = express.Router(),
  config = require('../config/config'),
  User = require('../models/user.model'),
  Companie = require('../models/companie.model'),
  PaiementQuote = require('../models/paiementQuote.model'),
  // fs      = require('fs'),
  jwt = require('jsonwebtoken'),
  stripe = require("stripe")("sk_test_cg4vcpE5gV1ApywsErwoWL7u");

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
  let url = 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_BhWB8WgFBFUnPTvA9d0wgqcVJgGUJufg&scope=read_write&redirect_uri=http://' + req.headers.host + '/%23/companie/mine'
  return res.status(200).json({message: 'ok', url: url});
})
router.get('/getStripeAccountDetails', function(req, res, next) {
  // if(!req.user.paiement.stripe.cusId) {
  //   return res.status(404).json({
  //     title: 'No data',
  //     error: 'noData'
  //   });
  // }

  stripe.accounts.retrieve(
  // req.user.paiement.stripe.cusId,
  '', function(err, customer) {
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


    console.log(paiementQuote)
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
      res.status(201).json({message: '', obj: result});
    });

    var request = require('request');
    request.post({
      url: 'https://connect.stripe.com/oauth/deauthorize',
      formData: {
        client_id: 'ca_BhWB8WgFBFUnPTvA9d0wgqcVJgGUJufg',
        stripe_user_id: item.banck.stripe.stripe_user_id
      },
      headers: {
        'Authorization': 'Bearer sk_test_cg4vcpE5gV1ApywsErwoWL7u'
      }
    });
  });
})

router.post('/oauthConnect/', function(req, res, next) {
  // https://stripe.com/docs/connect/standard-accounts
  var request = require('request');
  request.post({
    url: 'https://connect.stripe.com/oauth/token',
    form: {
      grant_type: "authorization_code",
      client_id: 'ca_BhWB8WgFBFUnPTvA9d0wgqcVJgGUJufg',
      // code: 'ac_BiqcZX1ERhGI7J0KTq9s4Lc7Iol2OTxQ',
      code: req.body.code,
      client_secret: 'sk_test_cg4vcpE5gV1ApywsErwoWL7u'
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

router.get('/getStripeCust', function(req, res, next) {
  Companie.findById((req.user.ownerCompanies[0]), function(err, companie) {
    if (!companie.banck.stripe.stripe_user_id_gooplus) {
      return res.status(404).json({title: 'No data', error: 'noData'});
    }
    stripe.customers.retrieve(companie.banck.stripe.stripe_user_id_gooplus, function(err, customer) {
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

router.post('/saveCustInStripe/', function(req, res, next) {
  createCustomerInStripe(req).then(function(customer) {
    Companie.update({
      _id: req.user.ownerCompanies[0]
    }, {
      $set: {
        'banck.stripe.stripe_user_id_gooplus': customer.id
      }
    }, function(err, item) {
      if (item) {
        return res.status(200).json({customer: customer})
      } else {
        return res.status(404).json({title: 'Error Not saved in stripe', error: err});
      }
    });

    //

    //
    //   updateStripeCustomerIdToDb(req, customer).then(function(item){
    //     if(item) {
    //       return res.status(200).json({
    //         customer: customer
    //       })
    //     } else {
    //       return res.status(404).json({
    //         title: 'No data in stripe',
    //         error: 'noData'
    //       });
    //     }
    //   }).catch((error) => {
    //     return res.status(404).json({
    //       title: 'Error not saved in db',
    //       error: error
    //     });
    //   });
    // }).catch((error) => {
    //   return res.status(404).json({
    //     title: 'Error Not saved in stripe',
    //     error: error
    //   });
  });
});
router.post('/saveCardInStripe/', function(req, res, next) {
  // if(req.user.paiement.stripe.cusId) {
  createCardInStripe(req).then((card) => {
    return res.status(200).json({card: card})
  }).catch((error) => {
    return res.status(404).json({title: 'Error Not saved in stripe', error: error});
  });

});
router.post('/saveSubscriptionInStripe/', function(req, res, next) {

  Companie.findById((req.user.ownerCompanies[0]), function(err, companie) {
    if (err) {
      return res.status(500).json({message: 'An error occured', err: err})
    }
    if (!companie) {
      return res.status(404).json({
        title: 'No obj found',
        error: {
          message: 'Obj not found!'
        }
      })
    }

    stripe.subscriptions.create({
      customer: companie.banck.stripe.stripe_user_id_gooplus,
      plan: req.body.plan
    }, function(err, subscription) {
      if (subscription) {

        let planDetail = {
          current_period_end: subscription.current_period_end * 1000,
          plan: subscription.plan.id
        }

        // console.log(planDetail)
        Companie.update({
          _id: req.user.ownerCompanies[0]
        }, {
          $set: {
            planDetail: planDetail
          }
        }, function(err, item) {
          if (item) {
            return res.status(200).json({obj: item})
          } else {
            return res.status(404).json({title: 'Error Not saved in stripe', error: err});
          }
        });

      } else {
        return res.status(404).json({title: 'Error', error: err});
      }
    });
  })

  //     createSubInStripe(req)
  //     .then(function(subscription){
  //       console.log(subscription)
  //       updateCurrent_period_endInDb(req, subscription.current_period_end, subscription.plan.id)
  //       .then(item => { console.log(item) })
  //       .catch(err => {
  //         return res.status(404).json({
  //           title: 'Error not saved in db',
  //           error: err
  //         });
  //       })
  //
  //       return res.status(200).json({
  //         subscription: subscription
  //       })
  //     })
  //     .catch((error) => {
  //       return res.status(404).json({
  //         title: 'Error Not saved in stripe',
  //         error: error
  //       });
  //     });
});

router.delete('/deleteSub/:idSub', function(req, res, next) {
  stripe.subscriptions.del(req.params.idSub, function(err, subscription) {
    if (subscription) {

      let planDetail = {
        current_period_end: subscription.current_period_end * 1000,
        plan: subscription.plan
      }

      Companie.update({
        _id: req.user.ownerCompanies[0]
      }, {
        $set: {
          planDetail: planDetail
        }
      }, function(err, item) {
        if (item) {
          return res.status(200).json({obj: item})
        } else {
          return res.status(404).json({title: 'Error Not saved in stripe', error: err});
        }
      });

      //   updateCurrent_period_endInDb(req, '', 'free')
      //   .then(item => { console.log(item) })
      //   .catch(err => {
      //     return res.status(404).json({
      //       title: 'Error not saved in db',
      //       error: err
      //     });
      //   })
      //
      //
      //
      // return res.status(200).json({
      //   message: confirmation
      // })
    } else {
      return res.status(404).json({title: 'Error', error: err});
    }
  });
})

router.delete('/deleteCard/:idCard', function(req, res, next) {
  Companie.findById((req.user.ownerCompanies[0]), function(err, companie) {
    if (err) {
      return res.status(500).json({message: 'An error occured', err: err})
    }
    if (!companie) {
      return res.status(404).json({
        title: 'No obj found',
        error: {
          message: 'Obj not found!'
        }
      })
    }

    stripe.customers.deleteCard(companie.banck.stripe.stripe_user_id_gooplus, req.params.idCard, function(err, confirmation) {
      if (confirmation) {
        return res.status(200).json({message: confirmation})
      } else {
        return res.status(404).json({title: 'Error', error: err});
      }
    });
  })
})

router.delete('/deleteCustInStripe', function(req, res, next) {
  Companie.findById((req.user.ownerCompanies[0]), function(err, companie) {
    if (err) {
      return res.status(500).json({message: 'An error occured', err: err})
    }
    if (!companie) {
      return res.status(404).json({
        title: 'No obj found',
        error: {
          message: 'Obj not found!'
        }
      })
    }

    stripe.customers.del(companie.banck.stripe.stripe_user_id_gooplus, function(err, confirmation) {
      if (confirmation) {
        return res.status(200).json({message: confirmation})
      } else {
        return res.status(404).json({title: 'Error', error: err});
      }
    });
  })
})

///to do here !!

function updateCurrent_period_endInDb(req, current_period_end, plan) {
  let paiement = req.user.paiement
  paiement.stripe.planDetail.current_period_end = current_period_end * 1000
  paiement.stripe.planDetail.plan = plan

  let planDetail = {
    current_period_end: current_period_end * 1000,
    plan: plan
  }
  return new Promise(function(resolve, reject) {
    User.update({
      _id: req.user._id
    }, {
      $set: {
        paiement: paiement
      }
    }, function(err, item) {
      if (item) {
        Companie.update({
          _id: req.user.ownerCompanies[0]
        }, {
          $set: {
            planDetail: planDetail
          }
        }, function(err, item) {
          if (item) {
            resolve(item)
          } else {
            reject(err)
          }
        });
      } else {
        reject(err)
      }
    });

  })
}

// function updateStripeCustomerIdToDb(req, customer){
//   let paiement = req.user.paiement
//   paiement.stripe.cusId = customer.id
//   return new Promise(function(resolve, reject) {
//     User.update({ _id: req.user._id }, { $set: { paiement: paiement}}, function (err, item) {
//       if (item) { resolve(item) } else { reject(err) }
//     });
//   })
// }

function createCustomerInStripe(req) {
  return new Promise(function(resolve, reject) {
    stripe.customers.create({
      description: 'Gooplus',
      email: req.user.email
    }, function(err, customer) {
      if (customer) {
        console.log("customer Created in Stripe")
        // console.log(customer)
        resolve(customer)
      } else {
        // console.log(err)
        reject(err)
      }
    })
  })
}

//
// function createSubInStripe(req){
//
//     return new Promise(function(resolve, reject) {
//
//       Companie.findById((req.user.ownerCompanies[0]), function (err, companie) {
//             if (err) {
//               return res.status(500).json({
//                 message: 'An error occured',
//                 err: err
//               })
//             }
//             if (!companie) {
//               return res.status(404).json({
//                 title: 'No obj found',
//                 error: {message: 'Obj not found!'}
//               })
//             }
//
//
//
//       stripe.subscriptions.create({
//         customer: companie.banck.stripe.stripe_user_id_gooplus,
//         plan: req.body.plan
//       }, function(err, subscription) {
//         if(subscription) {
//           console.log(subscription)
//           resolve(subscription)
//         } else {
//           console.log(err)
//           reject(err)
//         }
//       });
//     })
//     })
// }

function createCardInStripe(req) {
  return new Promise(function(resolve, reject) {
    Companie.findById((req.user.ownerCompanies[0]), function(err, obj) {
      if (err) {
        return res.status(500).json({message: 'An error occured', err: err})
      }
      if (!obj) {
        return res.status(404).json({
          title: 'No obj found',
          error: {
            message: 'Obj not found!'
          }
        })
      }

      let cusId = obj.banck.stripe.stripe_user_id_gooplus
      let card = req.body
      // console.log(req.body)
      delete card.id
      delete card.brand
      delete card.country
      delete card.funding

      stripe.customers.createSource(cusId, {
        source: card
      }, function(err, card) {
        if (card) {
          resolve(card)
        } else {
          console.log(err)
          reject(err)
        }
      });
    })
  })
}

// rollback alan
//
//
// router.post('/saveCustInStripe/', function (req, res, next) {
//     createCustomerInStripe(req).then(function(customer){
//       updateStripeCustomerIdToDb(req, customer).then(function(item){
//         if(item) {
//           return res.status(200).json({
//             customer: customer
//           })
//         } else {
//           return res.status(404).json({
//             title: 'No data in stripe',
//             error: 'noData'
//           });
//         }
//       }).catch((error) => {
//         return res.status(404).json({
//           title: 'Error not saved in db',
//           error: error
//         });
//       });
//     }).catch((error) => {
//       return res.status(404).json({
//         title: 'Error Not saved in stripe',
//         error: error
//       });
//     });
// });
// router.post('/saveCardInStripe', function (req, res, next) {
//
//
//     createCardInStripe(req)
//     .then((card) => {
//       return res.status(200).json({
//         card: card
//       })
//     })
//     .catch((error) => {
//       return res.status(404).json({
//         title: 'Error Not saved in stripe',
//         error: error
//       });
//     });
//
// });
// router.post('/payInStripe/:paiementQuoteId', function (req, res, next) {
//
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
//        var stripe = require("stripe")(
//          "sk_test_uGq5JgMivZapIzAj14uAZKqw"
//        );
//
//        console.log(req.body.quote.name)
//        let cusId = req.user.paiement.stripe.cusId
//       console.log(req.body)
//       stripe.charges.create({
//         amount: req.body.amount*100,
//         customer: obj.stripe.cusId,
//         currency: "usd",
//          source: "tok_visa",  obtained with Stripe.js
//         description: 'quote'
//       }, function(err, charge) {
//         if(charge) {
//
//              return res.status(200).json({
//                charge: charge
//              })
//           PaiementQuote.update({ _id: req.params.paiementQuoteId}, { $set: { 'stripe.charge': charge }}, function (err, item) {
//             if (item) {
//               return res.status(200).json({
//                 charge: charge
//               })
//             } else {
//               return res.status(404).json({
//                 title: 'Error Not Updtaed price',
//                 error: err
//               });
//             }
//           });
//
//         } else {
//           return res.status(404).json({
//             title: 'Error Not saved in stripe',
//             error: err
//           });
//
//
//         }
//          asynchronously called
//       });
//
//   })
// });
//
//
//
//
// router.post('/saveSubscriptionInStripe/:paiementQuoteId', function (req, res, next) {
//
//   PaiementQuote.findById((req.params.paiementQuoteId), function (err, obj) {
//     if (err) {
//       return res.status(500).json({
//         message: 'An error occured',
//         err: err
//       })
//     }
//     if (!obj) {
//       return res.status(404).json({
//         title: 'No obj found',
//         error: {message: 'Obj not found!'}
//       })
//     }
//
//
//     createSubInStripe(req, obj)
//     .then(function(subscription){
//        console.log('ssssss')
//       updateCurrent_period_endInDb(req, subscription.current_period_end, subscription.plan.id)
//       .then(item => { console.log(item) })
//       .catch(err => {
//         return res.status(404).json({
//           title: 'Error not saved in db',
//           error: err
//         });
//       })
//
//       return res.status(200).json({
//         subscription: subscription
//       })
//     })
//     .catch((error) => {
//       return res.status(404).json({
//         title: 'Error Not saved in stripe',
//         error: error
//       });
//     });
//   })
// });
//
//
//
//
//
//
//   router.delete('/deleteSub/:idSub', function (req, res, next) {
//     stripe.subscriptions.del(
//       req.params.idSub,
//       function(err, confirmation) {
//         if(confirmation) {
//
//             updateCurrent_period_endInDb(req, '', 'free')
//             .then(item => { console.log(item) })
//             .catch(err => {
//               return res.status(404).json({
//                 title: 'Error not saved in db',
//                 error: err
//               });
//             })
//
//
//
//           return res.status(200).json({
//             message: confirmation
//           })
//         } else {
//           return res.status(404).json({
//             title: 'Error',
//             error: err
//           });
//         }
//       }
//     );
//   })
//
//   router.delete('/deleteCard/:idCard/:paiementQuoteId', function (req, res, next) {
//
//
//         PaiementQuote.findById((req.params.paiementQuoteId), function (err, obj) {
//           if (err) {
//             return res.status(500).json({
//               message: 'An error occured',
//               err: err
//             })
//           }
//           if (!obj) {
//             return res.status(404).json({
//               title: 'No obj found',
//               error: {message: 'Obj not found!'}
//             })
//           }
//
//
//         stripe.customers.deleteCard(
//           obj.stripe.cusId,
//           req.params.idCard,
//           function(err, confirmation) {
//             if(confirmation) {
//               return res.status(200).json({
//                 message: confirmation
//               })
//             } else {
//               return res.status(404).json({
//                 title: 'Error',
//                 error: err
//               });
//             }
//           }
//         );
//     })
//   })
//
// router.delete('/deleteCustInStripe/:paiementQuoteId', function (req, res, next) {
//
//   PaiementQuote.findById((req.params.paiementQuoteId), function (err, obj) {
//     if (err) {
//       return res.status(500).json({
//         message: 'An error occured',
//         err: err
//       })
//     }
//     if (!obj) {
//       return res.status(404).json({
//         title: 'No obj found',
//         error: {message: 'Obj not found!'}
//       })
//     }
//
//
//     stripe.customers.del(obj.stripe.cusId,
//       function(err, confirmation) {
//         if(confirmation) {
//           return res.status(200).json({
//             message: confirmation
//           })
//         } else {
//           return res.status(404).json({
//             title: 'Error',
//             error: err
//           });
//         }
//       }
//     );
//   })
// })
//
//
//
// function updateCurrent_period_endInDb(req, current_period_end, plan){
//   return new Promise(function(resolve, reject) {
//     resolve()
//   })
//    let paiement = req.user.paiement
//    paiement.stripe.planDetail.current_period_end = current_period_end*1000
//    paiement.stripe.planDetail.plan = plan
//
//
//    let planDetail = {
//      current_period_end: current_period_end*1000,
//      plan: plan
//    }
//    return new Promise(function(resolve, reject) {
//      User.update({ _id: req.user._id }, { $set: { paiement: paiement}}, function (err, item) {
//        if (item) {
//          Companie.update({ _id: req.user.ownerCompanies[0] }, { $set: { planDetail: planDetail}}, function (err, item) {
//            if (item) { resolve(item) } else { reject(err) }
//          });
//        } else { reject(err) }
//      });
//
//    })
// }
//
//
//
//
// function updateStripeCustomerIdToDb(req, customer) {
//   return new Promise(function(resolve, reject) {
//     PaiementQuote.update({ _id: req.body._id }, { $set: { stripe: {cusId : customer.id}}}, function (err, item) {
//       if (item) { resolve(item) } else { reject(err) }
//     });
//   })
// }
//
//
// function createCustomerInStripe(req) {
// return new Promise(function(resolve, reject) {
//   console.log(req.user)
//
//   Companie
//    .findById(req.user.ownerCompanies)
//    .exec(function (err, item) {
//      if (err) {
//        console.log(err)
//      } if (!item) {
//       console.log('err A')
//      } else {
//
//            stripe.customers.create({
//              description: 'Customer for' + req.user.email,
//              email: req.user.email,
//              stripe_account: item.banck.stripe.stripe_user_id,
//            }, function(err, customer) {
//              if(customer){
//                console.log("customer Created in Stripe")
//                 console.log(customer)
//                resolve(customer)
//              } else {
//                console.log(err)
//                reject(err)
//              }
//            })
//
//      }
//    })
// })
//
// }
//
//
//
//
//
// function createSubInStripe(req, obj){
//
//      let cusId = req.user.paiement.stripe.cusId
//      console.log(req.body)
//     return new Promise(function(resolve, reject) {
//       stripe.subscriptions.create({
//         customer: obj.stripe.cusId,
//         plan: req.body.plan
//       }, function(err, subscription) {
//         if(subscription) {
//            console.log(subscription)
//           resolve(subscription)
//         } else {
//            console.log(err)
//           reject(err)
//         }
//       });
//     })
// }
//
// function createCardInStripe(req){
//   let cusId = obj.stripe.cusId
//    console.log(obj.stripe.cusId)
//   let card = req.body
//    console.log(card)
//    console.log(req.body)
//   delete card.id
//   delete card.brand
//   delete card.country
//   delete card.funding
//   delete card.last4
//   console.log(card)
//   return new Promise(function(resolve, reject) {
//
//       stripe.customers.createSource(
//
//         cusId,
//         {
//
//           source: card,
//            stripe_account:'acct_1AmF8pCf9EJ7HMmK',
//            {
//              "object": "card",
//              "address_city": "EPinal",
//              "address_country": "France",
//              "address_line1": "70 chemin du petit chaperon rouge",
//              "address_line2": "",
//              "address_state": "assignedTos",
//              "address_zip": "10100",
//              "exp_month": 8,
//              "exp_year": 2018,
//              "number": "4242424242424242",
//               "last4": "4242",
//               "metadata": {},
//               "name": null,
//            }
//          },
//         function(err, card) {
//           if(card) {
//             resolve(card)
//           } else {
//             console.log(err)
//             reject(err)
//           }
//         }
//       );
//   })
// }

module.exports = router;
