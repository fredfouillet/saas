var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
  //  Form                    = require('../models/form.model'),
  //  User                    = require('../models/user.model'),
  //  Quote                    = require('../models/quote.model'),
    mongooseUniqueValidator = require('mongoose-unique-validator')


var paiementQuote = new Schema({
    ownerCompanies: [{type: Schema.Types.ObjectId, ref: 'Companie'}],
    createdBy: [{type: Schema.Types.ObjectId, ref: 'User'}],
    userDebiteds: [{type: Schema.Types.ObjectId, ref: 'User'}],
    quotes: [{type: Schema.Types.ObjectId, ref: 'Quote'}],
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    datePaiement: {type: Date},
    amount: {type: Number},
    isPaid: {type: Boolean, default: [false]},
    isGooplusPaiement: {type: Boolean, default: [false]},
    type: {type: String, default: ['']},
    title: {type: String, default: ['']},
    isExpense: {type: Boolean, default: [false]},
    stripe: {
      charge:{
        balance_transaction: {type: String, default: ['']},
        amount: {type: Number},
        created: {type: Number},
        currency: {type: String, default: ['']},
        customer: {type: String, default: ['']},
        id: {type: String, default: ['']},
        status: {type: String, default: ['']},
        source: {
          address_city: {type: String, default: ['']},
          address_country: {type: String, default: ['']},
          address_line1: {type: String, default: ['']},
          address_line1_check: {type: String, default: ['']},
          address_line2  : {type: String, default: ['']},
          address_state: {type: String, default: ['']},
          address_zip: {type: String, default: ['']},
          address_zip_check: {type: String, default: ['']},
          brand: {type: String, default: ['']},
          country: {type: String, default: ['']},
          customer  : {type: String, default: ['']},
          cvc_check  : {type: String, default: ['']},
          dynamic_last4: {type: String, default: ['']},
          exp_month  : {type: String, default: ['']},
          exp_year: {type: String, default: ['']},
          fingerprint  : {type: String, default: ['']},
          funding: {type: String, default: ['']},
          id: {type: String, default: ['']},
          last4: {type: String, default: ['']},
        }

      },
      cusId: {type: String, default: ['']},
      isSubscription:{type: Boolean, default: [false]},
      planDetail:{
        plan:{type: String, default: ['']},
        current_period_end:{type: Date}
      }
    }
  },
  {
    timestamps: true
  })

paiementQuote.plugin(mongooseUniqueValidator)

module.exports = mongoose.model('PaiementQuote', paiementQuote)
