'use strict';

const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      logger = require('morgan'),
      userRouter = require('./routes/users'),
      requestRouter = require('./routes/requests'),
      app = express();
      
require('./db');

app.use(bodyParser.json());
app.use(logger("dev"));

app.set('views', path.join(__dirname,'./views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '/../client')));
app.use('/users', userRouter);
app.use('/requests', requestRouter);

app.use(function(err,req,res,next){
  res.status(err.status || 500);
  res.render('notification', {icon: "fa-times", iconColor:"#ff2400", message: err.message});
});

app.listen(process.env.PORT || 8080, function(){
  console.log('Server running');
});