var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    //Product                    = require('../models/product.model'),
  //  Form                    = require('../models/form.model'),
    User                    = require('../models/user.model'),
    mongooseUniqueValidator = require('mongoose-unique-validator');

var quote = new Schema({
    ownerCompanies: [{type: Schema.Types.ObjectId, ref: 'Companie'}],
    // projects: [{type: Schema.Types.ObjectId, ref: 'Project'}],
    parentQuotes: [{type: Schema.Types.ObjectId, ref: 'Quote'}],

    // ownerQuotes: [{type: Schema.Types.ObjectId, ref: 'User'}],
    clients: [{type: Schema.Types.ObjectId, ref: 'User'}],
    historyClients: [],
    historyClientsCross: [],
    legalApprovals: [{type: String, default: ['']}],
    // companieClients: [{type: Schema.Types.ObjectId, ref: 'Companie'}],
    // phoneNumber: {type: String, default: ['']},
    name: {type: String, default: ['']},
    quoteNumber: {type: Number, default: [0]},
    statusQuote: {type: String, default: ['']},
    detail: {
      currency: {type: String, default: ['']},
      quoteRef: {type: String, default: ['']},
      dateQuote: {
        issueDate: {type: Date, default: [Date()]},
        expiryDate: {type: Date, default: [Date()]},
        dateInvoicePaid: {type: Date, default: [Date()]},
      }
    },
    // drawing:{
    //   base64:{type: String, default: ['']},
    //   backgroundForms: [{type: Schema.Types.ObjectId, ref: 'Form'}],
    //   dateDrawing:{type: Date},
    //   users:[{type: Schema.Types.ObjectId, ref: 'User'}],
    // },
    drawingSignature:{
      // isSigned:{type: Boolean, default: [false]},
      dateSignature: {type: Date, default: [Date()]},
      namePicture:{type: String, default: ['']},
      // backgroundForms: [{type: Schema.Types.ObjectId, ref: 'Form'}],
      // dateDrawing:{type: Date},
      users:[{type: Schema.Types.ObjectId, ref: 'User'}],
    },

    typeQuote: {type: String, default: ['quote']},
    // _users : [{type: Schema.Types.ObjectId, ref: 'User'}],
    forms: [{type: Schema.Types.ObjectId, ref: 'Form'}],
    devisDetails: [
      {
        nameBucketProducts: {type: String},
        bucketProducts: [
          {
            typeRow: {type: String},
            title: {type: String, default: ['']},
            priceWithoutTaxes: {type: Number},
            priceWithTaxes: {type: Number},
            priceWithQuantity: {type: Number},
            priceWithTaxesWithQuantity: {type: Number},
            priceWithQuantityWithDiscountWithSurface: {type: Number},
            priceWithTaxesWithQuantityWithDiscountWithSurface: {type: Number},
            vat: {type: Number},
            quantity: {type: Number, default: [1]},
            length: {type: Number, default: [1]},
            width: {type: Number, default: [1]},
            surface: {type: Number, default: [1]},
            discount: {type: Number},
            productInit: [],
            priceWithoutTaxesWithDiscount: {type: Number},
            priceWithQuantityWithDiscount: {type: Number},
            priceWithTaxesWithQuantityWithDiscount: {type: Number},
            priceWithTaxesWithDiscount: {type: Number},




          }
        ]
      }

    ],
    priceQuote: {
      discountGlobal: {type: Number, default: [0]},
      vatGlobal: {type: Number, default: [0]},
      painfulnessGlobal: {type: Number, default: [0]},
      priceQuoteWithoutTaxes: {type: Number, default: [0]},
      priceQuoteWithTaxes: {type: Number, default: [0]},
      priceGlobalWithDiscountWithSurface: {type: Number, default: [0]},
      priceGlobalWithTaxesWithDiscountWithSurfaceWithPainfulness: {type: Number, default: [0]},
      priceGlobalWithDiscountWithSurfaceWithPainfulness: {type: Number, default: [0]},


      priceQuoteTaxes: [{
        VAT: {type: Number, default: [0]},
        TotalVAT: {type: Number, default: [0]},
      }]
      // paiementQuote: {type: Number, default: [0]},
    },
    // signature:{
    //   isSigned:{type: Boolean, default: [false]},
    //   base64:{type: String, default: ['']},
    //   dateSignature:{type: Date},
    //   users:[{type: Schema.Types.ObjectId, ref: 'User'}],
    // }
    // ,
    // paiements:[
    //   {
    //     datePaiement:{type: Date},
    //     amount: {type: Number},
    //     type: {type: String},
    //   }
    // ]

  },
  {
    timestamps: true
  });

quote.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Quote', quote);
