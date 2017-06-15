'use strict';

const express = require('express'),
      Request = require('../models/requests'),
      User = require('../models/users'),
      mailer = require('../mailer'),
      pdfer = require('../createPDF'),
      requestRouter = express.Router();
      
requestRouter.route('/')
    .post(function(req, res, next){
        User.findOne({name:req.body.user}, function(err, user){
            if(err) return next(err);
            let newRequest = req.body.request;
            newRequest.user = user._id;

            Request.create(newRequest, function(err, request){
                if(err) return next(err);
                mailer.paymentValidation(request, user);
                if(request.visa === true){
                    mailer.paymentAuthorization(request, user);
                }
                res.json({'status':'ok'});
            });
        });
    });

requestRouter.route('/validate/:token')
    .get(function(req, res, next){
        Request.findOneAndUpdate({validationToken:req.params.token}, {$set:{validated:true}}, {new: true}, function(err, request){
            if(err) return next(err);
            if(request) {
                if(request.visa === false || request.authorized === true){
                    User.findById(request.user, function(err, user){
                        if(err) return next(err);
                        mailer.validation(request, user);
                    });
                }
                res.render('notification', {icon: "fa-check", iconColor:"#3fcc08", message: "Commande validée !"});
            } else {
                res.render('notification', {icon: "fa-times", iconColor:"#ff2400", message: "Erreur"});
            }
        });
    });
requestRouter.route('/authorize/:token')
    .get(function(req, res, next){
        Request.findOneAndUpdate({autorizationToken:req.params.token}, {$set:{authorized:true}}, {new: true}, function(err, request){
            if(err) return next(err);
            if(request) {
                if(request.validated === true) {
                    User.findById(request.user, function(err, user){
                        if(err) return next(err);
                        mailer.validation(request, user);
                    });
                }
                res.render('notification', {icon: "fa-check", iconColor:"#3fcc08", message: "Paiement autorisé !"});
            } else {
                res.render('notification', {icon: "fa-times", iconColor:"#ff2400", message: "Erreur"});
            }
        });
    });
    
requestRouter.route('/getDocument/:id')
    .get(function(req,res,next){
        Request.findById(req.params.id, function(err, request){
            if(err) return next(err);
            if(request){
                if(request.validated === true && request.authorized === true){
                    pdfer.createPDF(request, res);
                }else if(request.validated === true && request.visa === false){
                    pdfer.createPDF(request, res);
                }else if(request.validated === true && request.authorized === false){
                    res.render('notification', {icon: "fa-times", iconColor:"#ff2400", message: "En attente d'autorisation"});
                }else if(request.validated === false && request.authorized === true){
                    res.render('notification', {icon: "fa-times", iconColor:"#ff2400", message: "En attente de validation"});
                }   
            } else {
                res.render('notification', {icon: "fa-times", iconColor:"#ff2400", message: "Commande introuvable"});
            }
        });
    });
    
module.exports = requestRouter;