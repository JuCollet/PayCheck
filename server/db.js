'use strict';

const mongoose = require('mongoose'),
      config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.mongo_user}:${process.env.mongo_pass}${config.baseUrls.mongo}`, function(err){
  if(err) {
    console.log('Unable to connect to MongoDB');
  } else {
    console.log('Successfully connected to MongoDB !');
  }
});