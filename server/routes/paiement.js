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





router.get('/getStripeCust', function (req, res, next) {
  getStripeCust(req.user.ownerCompanies[0]).then(customer => {
    return res.status(200).json({customer: customer})
  }).catch(err => {
    return res.status(404).json(err)
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
    })
  })
})

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
    }, function (err, subscription) {
      if (subscription) {
        savePlanDetailsInDB(req.user.ownerCompanies[0], subscription).then(item => {
          return res.status(200).json({obj: item})
        }).catch(err => {
          return res.status(404).json({title: 'Error', error: err});
        })
      } else {
        return res.status(404).json({title: 'Error', error: err})
      }
    })
  })
})


router.delete('/deleteSub/:idSub', function(req, res, next) {
  stripe.subscriptions.del(req.params.idSub, function(err, subscription) {
    if (subscription) {
      detetePlanDetailsInDB(req.user.ownerCompanies[0]).then(item => {
        return res.status(200).json({obj: item})
      }).catch(err => {
        return res.status(404).json({title: 'Error', error: err});
      })
    } else {
      return res.status(404).json({title: 'Error', error: err})
    }
  })
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

//
// function updateCurrent_period_endInDb(req, current_period_end, plan) {
//   let paiement = req.user.paiement
//   paiement.stripe.planDetail.current_period_end = current_period_end * 1000
//   paiement.stripe.planDetail.plan = plan
//
//   let planDetail = {
//     current_period_end: current_period_end * 1000,
//     plan: plan
//   }
//   return new Promise(function(resolve, reject) {
//     User.update({
//       _id: req.user._id
//     }, {
//       $set: {
//         paiement: paiement
//       }
//     }, function(err, item) {
//       if (item) {
//         Companie.update({
//           _id: req.user.ownerCompanies[0]
//         }, {
//           $set: {
//             planDetail: planDetail
//           }
//         }, function(err, item) {
//           if (item) {
//             resolve(item)
//           } else {
//             reject(err)
//           }
//         });
//       } else {
//         reject(err)
//       }
//     })
//   })
// }


function getStripeCust (companieId) {
  return new Promise(function (resolve, reject) {
    Companie.findById((companieId), function (err, companie) {
      if (err) {
        reject(err)
      }
      if (!companie.banck.stripe.stripe_user_id_gooplus) {
        reject(new Error({title: 'No data', error: 'noData'}))
        detetePlanDetailsInDB(companie._id)
        // return res.status(404).json({title: 'No data', error: 'noData'});
      }
      stripe.customers.retrieve(companie.banck.stripe.stripe_user_id_gooplus, function (err, customer) {
        if (err) {
          reject(err)
          detetePlanDetailsInDB(companie._id)
          // return res.status(404).json({title: 'No data in stripe', error: 'noData'});
        } else {
          if (customer.deleted) {
            detetePlanDetailsInDB(companie._id)
            reject(new Error({title: 'Deleted', error: customer}))
            // return res.status(404).json({title: 'Deleted', error: customer});
          }
          if(!customer.subscriptions.data.length) {
            detetePlanDetailsInDB(companie._id)
          }
          customer.subscriptions.data.forEach(subscription => {
            savePlanDetailsInDB(companieId, subscription)
          })
          resolve(customer)
          // return res.status(200).json({customer: customer})
        }
      })
    })
  })
}

function createCustomerInStripe(req) {
  return new Promise(function(resolve, reject) {
    stripe.customers.create({
      description: 'Gooplus',
      email: req.user.email
    }, function(err, customer) {
      if (customer) {
        resolve(customer)
      } else {
        reject(err)
      }
    })
  })
}


function savePlanDetailsInDB (companieId, subscription) {
  return new Promise(function (resolve, reject) {
    let planDetail = {
      current_period_end: subscription.current_period_end * 1000,
      plan: subscription.plan.id
    }

    // req.user.ownerCompanies.forEach(companieSingle => {
      Companie.update({
        _id: companieId
      }, {
        $set: {
          planDetail: planDetail
        }
      }, function (err, item) {
        if (item) {
          resolve(item)
        } else {
          reject(err)
        }
      })
  })
}

function detetePlanDetailsInDB (companieId) {
  return new Promise(function (resolve, reject) {
    let planDetail = {
      current_period_end: '',
      plan: ''
    }

    // req.user.ownerCompanies.forEach(companieSingle => {
      Companie.update({
        _id: companieId
      }, {
        $set: {
          planDetail: planDetail
        }
      }, function (err, item) {
        if (item) {
          resolve(item)
        } else {
          reject(err)
        }
      })
  })
}


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

module.exports = {
  router: router,
  getStripeCust: getStripeCust
}
