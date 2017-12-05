var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    Form                    = require('../models/form.model'),

    mongooseUniqueValidator = require('mongoose-unique-validator')

var userCross = new Schema({
    ownerCompanies: [{type: Schema.Types.ObjectId, ref: 'Companie'}],

    // companies: [{type: Schema.Types.ObjectId, ref: 'Companie'}],
    // isAdminOfHisCompanie:{type: Boolean, default: [false]},

    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    forms: [{type: Schema.Types.ObjectId, ref: 'Form'}],

    // role: {type: Array, default: ['client']},

    rightsInApp: [],
    typeUsers: {type: Array},
    profile : {
      profilePicture : [{type: Schema.Types.ObjectId, ref: 'Form'}],
      language: {type: String, default: ['fr']},
      name: {type: String, default: ['']},
      sourceContact: {type: String, default: ['']},
      companyName: {type: String, default: ['']},
      fax:{type: String, default: ['']},
      title: {type: String, default: ['']},
      lastName: {type: String, default: ['']},
      phoneNumber:{type: String, default: ['']},
      typeClient:{type: String, default: ['']},
      colorCalendar:{type: String, default: ['#ad2121']},
      statusHouse:{type: String, default: ['']},
      otherData:{type: String, default: ['']},
      detailHouse:{
        typeHouse:{type: String, default: ['']},
        surface:{type: Number, default: [0]},
        accesCode:{type: String, default: ['']},
        floor:{type: String, default: ['']},
        accessType:{type: String, default: ['']},
      },
      address:[{
        nameAddress:  {type: String, default: ['']},
        address : {type: String, default: ['']},
        address2 : {type: String, default: ['']},
        city : {type: String, default: ['']},
        state : {type: String, default: ['']},
        zip : {type: String, default: ['']},
        country : {type: String, default: ['']},
      }],
    }
  },
  {
    timestamps: true
  })

userCross.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('UserCross', userCross);
