'use strict';

const helper = require('sendgrid').mail,
      pug = require('pug'),
      path = require('path'),
      config = require('./config'),
      sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
      
const paymentValidation = function(request, user){

  const from_email = new helper.Email(config.emails.origin),
        to_email = new helper.Email(config.emails.validation),
        subject = 'Nouveau paiement à valider',
        content = new helper.Content('text/html', pug.renderFile(path.join(__dirname, './mails/validation.pug'), {
          name: user.name,
          price: request.totalPrice+"€",
          provider : request.provider,
          array: request.products,
          budget: request.budget,
          link: config.baseUrls.origin+"requests/validate/"+request._id
        })),
        mail = new helper.Mail(from_email, subject, to_email, content);

  const sendMail = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(sendMail);

};

const paymentAuthorization = function(request, user){

  const from_email = new helper.Email(config.emails.origin),
        to_email = new helper.Email(config.emails.authorization),
        subject = 'Nouveau paiement Visa à autoriser',
        content = new helper.Content('text/html', pug.renderFile(path.join(__dirname, './mails/authorisation.pug'), {
          name: user.name,
          price: request.totalPrice+"€",
          provider : request.provider,
          array: request.products,
          budget: request.budget,
          link: config.baseUrls.origin+"requests/authorize/"+request._id
        })),
        mail = new helper.Mail(from_email, subject, to_email, content);

  const sendMail = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(sendMail);

};

const validation = function(request, user){

  let optionnalMessage = "";
  
  if(request.visa === true) {
    optionnalMessage = " et le paiement Visa autorisé";
  }

  const from_email = new helper.Email(config.emails.origin),
        to_email = new helper.Email(user.email),
        subject = 'Commande validée',
        content = new helper.Content('text/html', pug.renderFile(path.join(__dirname, './mails/confirmation.pug'), {
          price: request.totalPrice+"€",
          provider : request.provider,
          array: request.products,
          budget: request.budget,
          link: config.baseUrls.origin+"requests/getDocument/"+request._id,
          optionnalMessage: optionnalMessage
        })),
        mail = new helper.Mail(from_email, subject, to_email, content);

  const sendMail = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(sendMail);

};

module.exports = {
    paymentValidation: paymentValidation,
    paymentAuthorization: paymentAuthorization,
    validation: validation
};