'use strict';

const mongoose = require('mongoose'),
      randtoken = require('rand-token'),
      Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
  description: String,
  price: Number,
  amount: Number
});
      
const reqSchema = new mongoose.Schema({
  user : {
    type: Schema.ObjectId,
    ref: 'User'
  },
  products: [productSchema],
  comment: String,
  budget: String,
  visa: Boolean,
  emergency: Boolean,
  manon: Boolean,
  totalPrice: Number,
  provider: String,
  autorizationToken: String,
  validationToken: String,
  validated: {
      type: Boolean,
      default: false
  },
  authorized: {
      type: Boolean,
      default: false
  },
  },{
  timestamps:true
});

reqSchema.pre('save', function(next){
  const request = this;
  request.autorizationToken = Date.now()+randtoken.generate(16);
  request.validationToken = Date.now()+randtoken.generate(12);
  next();
});

const Request = mongoose.model('Request', reqSchema);

module.exports = Request;
