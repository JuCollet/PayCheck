'use strict';

const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
      
const userSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    trim: true
  },
  email : {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  },{
  timestamps:true
});

const User = mongoose.model('User', userSchema);

module.exports = User;