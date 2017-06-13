'use strict';

const mongoose = require('mongoose'),
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

const Request = mongoose.model('Request', reqSchema);

module.exports = Request;
