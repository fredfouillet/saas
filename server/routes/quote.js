var express = require('express'),
  router = express.Router(),
  config = require('../config/config'),
  User = require('../models/user.model'),
  Quote = require('../models/quote.model'),
  Companie = require('../models/companie.model'),
  nodemailer = require('nodemailer'),
  // fs = require('fs'),
  jwt = require('jsonwebtoken'),
  emailGenerator = require('./emailGenerator'),
  // mongoose = require('mongoose'),
  // Schema = mongoose.Schema,
  shared = require('./shared.js'),
  userCross = require('./userCross.js'),
  pdfGenerator = require('./pdfGenerator.js'),
  nameObject = 'quote';

// var fs = require('fs');
// var pdf = require('html-pdf');

// this process does not hang the nodejs server on error
process.on('uncaughtException', function(err) {
  console.log(err);
});


// Checking if user is authenticated or not, security middleware
router.use('/', function(req, res, next) {
  var token = req.headers['authorization'];
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      return res.status(401).json({message: 'Authentication failed', error: err})
    }
    if (!decoded) {
      return res.status(404).json({
        title: 'Authentication Failed',
        error: {
          message: 'Authentication failed, malformed jwt. Please login or refresh Page'
        }
      });
    }
    if (decoded) {
      User.findById(decoded.user._id).populate({path: 'rights', model: 'Right'}).populate({path: 'ownerCompanies', model: 'Companie'}).exec(function(err, doc) {
        if (err) {
          return res.status(500).json({message: 'Fetching user failed', err: err});
        }
        if (!doc) {
          return res.status(404).json({
            title: 'User not found',
            error: {
              message: 'The user was not found ' + decoded.user._id
            }
          })
        }
        if (!shared.isCurentUserHasAccess(doc, 'quote', 'read')) {
          return res.status(404).json({
            title: 'No rights',
            error: {
              message: 'No rights'
            }
          })
        }
        if (doc) {
          req.user = doc;
          next();
        }
      })
    }
  })
});




router.get('/graph', function(req, res, next) {
  // let searchQuery = {}
  // searchQuery['ownerCompanies'] = req.user.ownerCompanies

  let dateBegin = req.query.year * 1 + '-01-01'
  let dateEnd = req.query.year * 1 + 1 + '-01-01'


  // if (req.query.search)
  //   searchQuery['details.name'] = new RegExp(req.query.search, 'i')
  //
  // if (req.query.idQuote)
  //   searchQuery['quotes'] = mongoose.Types.ObjectId(req.query.idQuote)

  let aggregate = {
    $and: [{
      'detail.dateQuote.issueDate': {
        '$gte': new Date(dateBegin),
        '$lt': new Date(dateEnd)
      }
    }]
  }
  if (req.query.statusQuote) {
    aggregate.$and.push({ 'statusQuote': req.query.statusQuote })
  }
  aggregate.$and.push({ 'ownerCompanies': req.user.ownerCompanies })

  Quote.aggregate({
    $match: aggregate
  }, {
    $group: {
      _id: {
        year: {
          $year: "$detail.dateQuote.issueDate"
        },
        month: {
          $month: "$detail.dateQuote.issueDate"
        },
        //  day: { $dayOfMonth : "$datePaiement" }
      },
      amountTotal: {
        $sum: "$priceQuote.priceGlobalWithDiscountWithSurfaceWithPainfulness",
      },
      count:{$sum:1}
    }
  }).exec(function(err, item) {
    if (err) {
      return res.status(404).json({message: '', err: err})
    } else {
      res.status(200).json({message: 'Success', item: item})
    }
  })
})


router.get('/maxQuoteNumber', function (req, res, next) {
  let searchQuery = {}
  searchQuery['ownerCompanies'] = req.user.ownerCompanies
  Quote.findOne(searchQuery).sort('-quoteNumber').limit(1).exec(function (err, doc) {
    let quoteNumber = 1
    if (doc) {
      quoteNumber = doc.quoteNumber + 1
    }
    if (err) {
      return res.status(404).json({message: 'Error', err: err})
    }
    res.status(201).json({
      message: 'max Value Quote',
      obj: quoteNumber
    });
  })
})



function getQuote (idQuote) {
  return new Promise(function (resolve, reject) {
      Quote.findById((idQuote), function(err, obj) {
        if (err) {
          reject(err)
        }
        if (!obj) {
          reject(new Error({
            title: 'No form found',
            error: {
              message: 'Form not found!'
            }
          }))
        }

        Quote.findById({_id: idQuote})
          .populate({path: 'companieClients', model: 'Companie'})
          .populate({path: 'signature.users', model: 'User'})
          .populate({path: 'clients', model: 'User'})
          .populate({path: 'parentQuotes', model: 'Quote'})
          .populate({path: 'drawing.backgroundForms', model: 'Form'})
          .populate({path: 'forms', model: 'Form'})
        // .populate({path: 'devisDetails.bucketProducts.productInit', model: 'Product'})
          .populate({
          path: 'devisDetails.bucketProducts.productInit',
          model: 'Product',
          populate: {
            path: 'forms',
            model: 'Form'
          }
        }).exec(function(err, item) {
          if (err) {
            reject(err)
          }
          if (!item) {
            reject(new Error({
              title: 'No form found',
              error: {
                message: 'Form not found!'
              }
            }))
          } else {
            resolve(item)
          }
        })
      })

  })
}

router.get('/:id', function(req, res, next) {
  getQuote(req.params.id).then(quote => {
    res.status(200).json({message: 'Success', item: quote})
  }).catch(err => {
    return res.status(500).json(err)
  })
})

router.get('/sendQuoteByEmailToClient/:quoteId', function(req, res, next) {
  pdfGenerator.generatePDF(req, res, next).then(quoteId => {
    emailGenerator.sendQuoteByEmailToClient(req, res, next)
    // res.status(200).json({
    //   message: 'Success',
    //   item: quoteId + '.pdf'
    // })
  }).catch((error) => {
    return res.status(404).json({title: 'Error_mail', error: error})
  })
})

router.get('/pdf/:quoteId', function(req, res, next) {
  pdfGenerator.generatePDF(req, res, next).then(quoteId => {
    res.status(200).json({
      message: 'Success',
      item: quoteId + '.pdf'
    })
  }).catch((error) => {
    return res.status(404).json({title: 'Error_pdf', error: error})
  })
})




router.put('/:id', function(req, res, next) {
  if (!shared.isCurentUserHasAccess(req.user, nameObject, 'write')) {
    return res.status(404).json({
      title: 'No rights',
      error: {
        message: 'No rights'
      }
    })
  }
  Quote.findById(({_id: req.params.id}), function(err, item) {
    if (err) {
      return res.status(404).json({message: '', err: err})
    }
    // console.log(item)
    // console.log(req.body)


    // item.historyClients = req.body.clients
    // item.historyClientsCross = req.body.clientsCross


    item.clients = req.body.clients
    item.historyClients = req.body.historyClients
    item.name = req.body.name
    item.typeQuote = req.body.typeQuote
    item.statusQuote = req.body.statusQuote
    item.forms = req.body.forms
    item.products = req.body.products
    item.projects = req.body.projects
    item.devisDetails = req.body.devisDetails
    item.priceQuote = req.body.priceQuote
    // item.signature = req.body.signature
    item.detail = req.body.detail
    item.companieClients = req.body.companieClients
    item.quoteNumber = req.body.quoteNumber
    item.legalApprovals = req.body.legalApprovals
    // item.drawing = req.body.drawing

    // console.log(item)
    item.drawingSignature = req.body.drawingSignature

    // if(item.statusQuote === 'signed' && !req.body.drawingSignature.base64) {
    //   item.drawingSignature.base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAAAGklEQVQoU2NkoBAwUqifYdQAhtEwYKBCGAAAE40ADA7nRNsAAAAASUVORK5CYII='
    // }
    // if(item.statusQuote !== 'paid') {
    //   if(item.drawingSignature.base64) {
    //     item.statusQuote = 'signed'
    //   } else {
    //     item.statusQuote = 'pending'
    //   }
    // }
     // Gooplus

     saveQuote(item).then(quote => {
       res.status(200).json({message: 'Update Successfull', obj: quote})
     }).catch(err => {
       return res.status(403).json(err);
     })

  })
});

//update
router.put('/:id/signature', function(req, res, next) {

  if (!shared.isCurentUserHasAccess(req.user, nameObject, 'write'))
    return res.status(404).json({
      title: 'No rights',
      error: {
        message: 'No rights'
      }
    })

  Quote.findById(({_id: req.params.id}), function(err, item) {
    if (err) {
      return res.status(404).json({message: '', err: err})
    }


    const drawingSignature = {
      dateSignature: new Date(),
      namePicture: '',
      users:[req.user]
    }
    if(req.body.drawingSignature.base64) {
      item.statusQuote = 'signed'
      var base64Data = req.body.drawingSignature.base64.replace(/^data:image\/png;base64,/, '');
      const namePicture = item._id + '_' + new Date().getTime() + '.png'
      require('fs').writeFile('./server/uploads/signature/' + namePicture, base64Data, 'base64', function(err) {

        if(err) {
          console.log(err);
        }

        drawingSignature.namePicture = namePicture
        item.drawingSignature = drawingSignature

        saveQuote(item).then(quote => {
          res.status(200).json({message: 'Registration Successfull', obj: quote})
        }).catch(err => {
          return res.status(403).json(err);
        })
      });
    } else {
      item.statusQuote = 'pending'
      saveQuote(item).then(quote => {
        res.status(200).json({message: 'Registration Successfull', obj: quote})
      }).catch(err => {
        return res.status(403).json(err);
      })
    }
  })
});

router.post('/', function(req, res, next) {
  if (!shared.isCurentUserHasAccess(req.user, nameObject, 'write')) {
    return res.status(404).json({
      title: 'No rights',
      error: {
        message: 'No rights'
      }
    })
  }
  if (!req.user.ownerCompanies.length) {
    return res.status(404).json({message: 'You must belong to a companie', err: ''})
  }

  let searchQuery = {}
  searchQuery['ownerCompanies'] = req.user.ownerCompanies

  req.body.ownerCompanies = req.user.ownerCompanies
  req.body.historyClients = req.body.clients
  req.body.historyClientsCross = req.body.historyClientsCross

  var quote = new Quote(req.body);
  if(quote.historyClients.length) {
    userCross.getUserCross(req.user, quote.historyClients[0]._id).then(userCrossSingle => {
      quote.historyClientsCross = userCrossSingle
      saveQuote(quote).then(quote => {
        res.status(200).json({message: 'Registration Successfull', obj: quote})
      }).catch(err => {
        return res.status(403).json(err);
      })
    })
    saveQuote(quote).then(quote => {
      res.status(200).json({message: 'Registration Successfull', obj: quote})
    }).catch(err => {
      return res.status(403).json(err);
    })
  } else {
    saveQuote(quote).then(quote => {
      res.status(200).json({message: 'Registration Successfull', obj: quote})
    }).catch(err => {
      return res.status(403).json(err);
    })
  }

})


function saveQuote (quote) {
  return new Promise(function (resolve, reject) {
    quote.save(function (err, result) {
      if (err) {
        reject(err)
        // return res.status(403).json(err);
      }
      getQuote(result._id).then(quote => {
        resolve(quote)
        // res.status(200).json({message: 'Registration Successfull', obj: result})
      }).catch(err => {
        reject(err)
        // return res.status(403).json(err)
      })
    })
  })
}
//
// router.post('/saveAsInvoice/', function(req, res, next) {
//   if (!shared.isCurentUserHasAccess(req.user, nameObject, 'write')) {
//     return res.status(404).json({
//       title: 'No rights',
//       error: {
//         message: 'No rights'
//       }
//     })
//   }
//   if (!req.user.ownerCompanies.length)
//     return res.status(404).json({message: 'You must belong to a companie', err: ''})
//
//   let searchQuery = {}
//   searchQuery['ownerCompanies'] = req.user.ownerCompanies
//   Quote.find(searchQuery).count().exec(function(err, count) {
//     req.body.quoteNumber = count * 1 + 1
//     req.body.signature = {}
//     let idQuote = req.body._id
//     req.body.parentQuotes = req.body._id
//     delete req.body._id
//     var quote = new Quote(req.body);
//     quote.typeQuote = 'invoice'
//     quote.save(function(err, result) {
//       if (err) {
//         return res.status(403).json({
//           title: 'There was an issue',
//           error: {
//             message: 'ERROR' + err
//           }
//         });
//       }
//       Quote.findById(({_id: idQuote}), function(err, item) {
//         if (err)
//           return res.status(404).json({message: '', err: err})
//         item.invoices = result
//         item.save(function(err, resultQuote) {
//           if (err) {
//             return res.status(404).json({message: 'There was an error, please try again', err: err});
//           }
//           res.status(201).json({message: '', obj: result});
//         });
//       })
//     })
//   })
// });

// get all forms from database
router.get('/page/:page', function(req, res, next) {
  var itemsPerPage = 15
  var currentPage = Number(req.params.page)
  var pageNumber = currentPage - 1
  var skip = (itemsPerPage * pageNumber)
  //var limit = (itemsPerPage * pageNumber) + itemsPerPage

  let nameQuery = {}
  let cityQuery = {}
  let arrObj = []

  let searchQuery = {}
  // searchQuery['ownerCompanies'] = req.user.ownerCompanies

  // if (req.query.isQuoteAssignedToMe === 'true') {
  //   searchQuery['clients'] = req.user._id
  // } else {
  //   searchQuery['ownerCompanies'] = req.user.ownerCompanies
  // }

  if (req.user.isExternalUser) {
    searchQuery['clients'] = req.user._id
  } else {
    searchQuery['ownerCompanies'] = req.user.ownerCompanies
  }
  if (req.query.typeQuote)
    searchQuery['typeQuote'] = req.query.typeQuote
  if (req.query.userId)
    searchQuery['clients'] = mongoose.Types.ObjectId(req.query.userId)


  // if (req.query.parentQuoteId)
  //   searchQuery['parentQuotes'] = mongoose.Types.ObjectId(req.query.parentQuoteId)

  if (req.query.search) {
    //  nameQuery['name'] = new RegExp(req.query.search, 'i')
    //  cityQuery['address.city'] = new RegExp(req.query.search, 'i')
    arrObj.push({
      'name': new RegExp(req.query.search, 'i')
    })
    // arrObj.push({
    //   'quoteNumber': new RegExp(req.query.search, 'i')
    // })
    // arrObj.push({
    //   'address.address': new RegExp(req.query.search, 'i')
    // })
    searchQuery['$or'] = arrObj
    //findQuery['address.city'] = new RegExp(req.query.search, 'i')
  }

  // if (req.query.userId)
  //   searchQuery['clients'] = mongoose.Types.ObjectId(req.query.userId)
  //
  // if (req.query.projectId)
  //   searchQuery['projects'] = mongoose.Types.ObjectId(req.query.projectId)
  // console.log(searchQuery)
  Quote.find(searchQuery).populate({path: 'clients', model: 'User'})

  // .populate({path: 'devisDetails.bucketProducts.productInit', model: 'Product'})
    .limit(itemsPerPage).skip(skip).sort(req.query.orderBy).exec(function(err, item) {
    if (err) {
      return res.status(404).json({message: 'No results', err: err})
    } else {

      item.forEach((quote, i) => {
        item[i].drawingSignature.base64 = ''
        item[i].devisDetails = []
      })

      Quote.find(searchQuery).count().exec(function(err, count) {
        res.status(200).json({
          paginationData: {
            totalItems: count,
            currentPage: currentPage,
            itemsPerPage: itemsPerPage
          },
          data: item
        })
      })
    }
  })
})

router.delete('/:id', function(req, res, next) {
  if (!shared.isCurentUserHasAccess(req.user, nameObject, 'write')) {
    return res.status(404).json({
      title: 'No rights',
      error: {
        message: 'No rights'
      }
    })
  }
  Quote.findById((req.params.id), function(err, item) {

    if (err) {
      return res.status(500).json({message: 'An error occured', err: err})
    }
    if (!item) {
      return res.status(404).json({
        title: 'No form found',
        error: {
          message: 'Form not found!'
        }
      });
    }

    // deleting the form from the database
    item.remove(function(err, result) {
      if (err) {
        return res.status(500).json({title: 'An error occured', error: err});
      }
      res.status(200).json({message: 'Item is deleted', obj: result});
    })
  });
});

module.exports = router;
