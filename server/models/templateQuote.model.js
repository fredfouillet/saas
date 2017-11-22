var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    //Product                    = require('../models/product.model'),
  //  Form                    = require('../models/form.model'),
  //  User                    = require('../models/user.model'),
    mongooseUniqueValidator = require('mongoose-unique-validator');

var templateQuote = new Schema({
    ownerCompanies: [{type: Schema.Types.ObjectId, ref: 'Companie'}],
    nameTemplate:{type: String, default: ['']},
    devisDetails: [
      {
        nameBucketProducts :{type: String},
        bucketProducts:[
          {
            typeRow:{type: String},
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
            productInit: [{type: Schema.Types.ObjectId, ref: 'User'}],

            priceWithoutTaxesWithDiscount: {type: Number},
            priceWithQuantityWithDiscount: {type: Number},
            priceWithTaxesWithQuantityWithDiscount: {type: Number},
            priceWithTaxesWithDiscount: {type: Number},




          }
        ]
      }

    ],

  },
  {
    timestamps: true
  });

templateQuote.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('TemplateQuote', templateQuote);
