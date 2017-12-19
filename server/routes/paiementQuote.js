var express = require('express'),
    router  = express.Router(),
    config  = require('../config/config'),
    User    = require('../models/user.model'),
    PaiementQuote    = require('../models/paiementQuote.model'),
    Form    = require('../models/form.model'),
    fs      = require('fs'),
    jwt     = require('jsonwebtoken'),
    shared = require('./shared.js'),
    pdfGenerator = require('./pdfGenerator.js'),
    nameObject = 'paiementQuote';

// this process does not hang the nodejs server on error
process.on('uncaughtException', function (err) {
  console.log(err)
})

// Checking if user is authenticated or not, security middleware
router.use('/', function (req, res, next) {
  var token = req.headers['authorization']
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) {
      return res.status(401).json({
        message: 'Authentication failed',
        error: err
      })
    }
    if (!decoded) {
      return res.status(404).json({
        title: 'Authentication Failed',
        error: {message: 'Authentication failed, malformed jwt'}
      })
    }
    if (decoded) {
      User
      .findById(decoded.user._id)
      .populate({ path: 'rights', model: 'Right'})
      .populate({ path: 'ownerCompanies', model: 'Companie'})
      .exec(function (err, doc) {
        if (err) {
          return res.status(500).json({
            message: 'Fetching user failed',
            err: err
          })
        }
        if (!doc) {
          return res.status(404).json({
            title: 'User not found',
            error: {message: 'The user was not found'}
          })
        }

        if(!shared.isCurentUserHasAccess(doc, nameObject, 'read')) {
          return res.status(404).json({
            title: 'No rights',
            error: {message: 'No rights'}
          })
        }
        if (doc) {
          req.user = doc
          next()
        }
      })
    }
  })
})



//update
router.put('/:id', function (req, res, next) {
  if (!shared.isCurentUserHasAccess(req.user, nameObject, 'write')) {
    return res.status(404).json({ title: 'No rights', error: {message: 'No rights'} })
  }

  PaiementQuote.findById(({_id: req.params.id}), function (err, item) {
    if (err) {
      return res.status(404).json({
        message: '',
        err: err
      })
    } else {
      //console.log(req.body)
        item.quotes = req.body.quotes
        item.amount = req.body.amount
        item.type = req.body.type
        item.datePaiement = req.body.datePaiement
        item.userDebiteds = req.body.userDebiteds
        item.projects = req.body.projects
        item.isPaid = req.body.isPaid
        item.title = req.body.title




        item.save(function (err, result) {
          if (err) {
            return res.status(404).json({
              message: 'There was an error, please try again',
              err: err
            })
          }
          res.status(201).json({
            message: 'Updated successfully',
            obj: result
          })
        })

    }
  })
})

router.post('/', function (req, res, next) {
  if (!shared.isCurentUserHasAccess(req.user, nameObject, 'write')) {
    return res.status(404).json({ title: 'No rights', error: {message: 'No rights'} })
  }
  if(!req.user.ownerCompanies.length) {
    return res.status(404).json({
      message: 'You must belong to a companie',
      err: ''
    })
  }


  var paiementQuote = new PaiementQuote(req.body)
  paiementQuote.addedBy = req.user._id
  paiementQuote.ownerCompanies = req.user.ownerCompanies

  paiementQuote.save(function (err, result) {
    if (err) {
      console.log(err)
      return res.status(403).json({
        title: 'There was an issue',
        error: {message: 'Error'}
      })
    }
    res.status(200).json({
      message: 'Registration Successfull',
      obj: result
    })
  })
})




// get all forms from database
router.get('/page/:page', function (req, res, next) {


  var itemsPerPage = 15
  var currentPage = Number(req.params.page)
  var pageNumber = currentPage - 1
  var skip = (itemsPerPage * pageNumber)

  let searchQuery = {}
  searchQuery['ownerCompanies'] = req.user.ownerCompanies


  if(req.query.search)
    searchQuery['details.name'] = new RegExp(req.query.search, 'i')


  if(req.query.quoteId)
    searchQuery['quotes'] = mongoose.Types.ObjectId(req.query.quoteId)


// console.log(req.query.orderBy)
  searchQuery['isExpense'] = false
  if(req.query.isExpense === 'true')
    searchQuery['isExpense'] = true

  PaiementQuote
  .find(searchQuery)
  .populate({path: 'userDebiteds', model: 'User'})
  .populate({
    path: 'quotes',
    model: 'Quote',
    // populate: {
    //   path: 'clients',
    //   model: 'User'
    // }
  })


  // .populate({path: 'quotes', model: 'Quote'})
  // .populate(
  //   {
  //     path: 'bucketTasks.tasks.assignedTos',
  //     model: 'User',
  //   })
  .limit(itemsPerPage)
  .skip(skip)
  .sort(req.query.orderBy)
  .exec(function (err, item) {
    // res.status(200).json({'alan':item})

    if (err) {
      return res.status(404).json({
        message: 'No results',
        err: err
      })
    } else {
      PaiementQuote
      .find(searchQuery)
      .count()
      .exec(function (err, count) {
        // console.log(err)
        // console.log(count)
        // console.log(item)
        // res.status(200).json({'alan':'200'})
      res.status(200).json({
          paginationData : {
            totalItems: count,
            currentPage : currentPage,
            itemsPerPage : itemsPerPage
          },
          data: item
        })
      })
    }
  })
})



router.get('/pdf/:paiementId', function(req, res, next) {
  pdfGenerator.generatePaiementQuotePDF(req, res, next).then(paiementId => {
    res.status(200).json({
      message: 'Success',
      item: paiementId + '.pdf'
    })
  }).catch((error) => {
    return res.status(404).json({title: 'Error', error: error})
  })
})


router.get('/graph', function (req, res, next) {
  // let searchQuery = {}
  let dateBegin = req.query.year*1 + '-01-01'
  let dateEnd = req.query.year*1 +1 + '-01-01'
  //
  // console.log(dateBegin, dateEnd)
  // if(req.query.search)
  //   searchQuery['details.name'] = new RegExp(req.query.search, 'i')
  //
  // if(req.query.idQuote)
  //   searchQuery['quotes'] = mongoose.Types.ObjectId(req.query.idQuote)


  let aggregate = {
    'datePaiement': {
      '$gte': new Date(dateBegin),
      '$lt': new Date(dateEnd)
    }
  }

  aggregate.ownerCompanies = req.user.ownerCompanies

  PaiementQuote
  .aggregate(
    {
      $match: aggregate
    },
    {
     $group : {
         _id : {
          year: { $year : "$datePaiement" },
          month: { $month : "$datePaiement" },
            //  day: { $dayOfMonth : "$datePaiement" }
        },
       amountTotal : { $sum : "$amount" },
       count:{$sum:1}
      }
    }
  )
 .exec(function (err, item) {
   if (err) {
     return res.status(404).json({
       message: '',
       err: err
     })
   } else {
     res.status(200).json({
       message: 'Success',
       item: item
     })
   }
 })

})



// getting user forms to display them on front end
router.get('/:id', function (req, res, next) {


  PaiementQuote.findById((req.params.id), function (err, obj) {
    if (err) {
      return res.status(500).json({
        title: 'No form found',
        error: {
          message: err
        }
      })
    }
    if (!obj) {
      return res.status(500).json({
        title: 'No form found',
        error: {
          message: 'not founded'
        }
      })
    }


    PaiementQuote
    .findById({_id: req.params.id})
    .populate({path: 'quotes', model: 'Quote'})
    .populate({path: 'projects', model: 'Project'})
    .populate({path: 'userDebiteds', model: 'User'})
    .exec(function (err, item) {
      if (err) {
        return res.status(404).json({
          message: '',
          err: err
        })
      } else {
        res.status(200).json({
          message: 'Success',
          item: item
        })
      }
    })
  })
})





router.delete('/:id', function (req, res, next) {
  if (!shared.isCurentUserHasAccess(req.user, nameObject, 'write')) {
    return res.status(404).json({ title: 'No rights', error: {message: 'No rights'} })
  }
  PaiementQuote.findById((req.params.id), function (err, item) {
    if (err) {
      return res.status(500).json({
        message: 'An error occured',
        err: err
      })
    }
    if (!item) {
      return res.status(404).json({
        title: 'No form found',
        error: {message: 'Form not found!'}
      })
    }

    // deleting the form from the database
    item.remove(function (err, result) {
      if (err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        })
      }
      res.status(200).json({
        message: 'Item is deleted',
        obj: result
      })
    })
  })
})



module.exports = router
