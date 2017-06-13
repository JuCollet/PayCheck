'use strict';

const express = require('express'),
      User = require('../models/users'),
      userRouter = express.Router();
      
userRouter.route('/')
    .post(function(req, res, next){
        let newUser = {
            name: req.body.name,
            email: req.body.email
        };
        User.create(newUser, function(err, user){
            if(err) return next(err);
            res.json({'status':'ok'});
        });
    })
    .get(function(req, res, next){
        User.find({}, function(err, users){
            if(err) return next(err);
            res.json(users);            
        });
    });
    
    
module.exports = userRouter;
