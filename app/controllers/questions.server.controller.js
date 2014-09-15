'use strict';
/**
* Module Dependencies
**/

var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Question = mongoose.model('Question'),
    _ = require('loadsh');

/**
* Create a Questions
**/
exports.create = function(req, res) {
   var question = new Question(req.body);
       question.user = req.user;

       question.save(function(err){
         if(err) {
            return res.status(400).send({
               message: errorHandler.getErrorMessage(err)
            });
         } else {
            var socketio = req.app.get('socketio');
            socketio.sockets.emit('question.created', question);
            
            res.jsonp(question);
         }
      }); 
};

/**
* Show the current article
**/
exports.read = function(req, res){
   res.jsonp(req.question);
};

/**
*Update a question
**/
exports.update = function(res, req) {
   var question = req.question;

   question = _.extend(question, req.body);

   question.save(function(err) {
      if(err) {
         return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
         });
      } else {
         res.jsonp(question);
      }
   });
};

/**
* Delete a question
**/
exports.delete = function(req, res) {
   var question = req.question;

   question.remove( function(err){
      if (err) {
         return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
         });
      } else {
         res.jsonp(question);
      }
   });
};

/**
* List of Questions
**/
exports.list = function(req, res) {
   Question.find().sort('-created').populate('user', 'displayName').exec(function(err, questions){
      if (err) {
         return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
         });
      } else {
         res.jsonp(questions);
      }
   });
};

/**
* Question Middleware
**/
exports.questionByID = function(req, res, next, id) {
   Question.findByID(id).populate('user', 'displayName').exec(function(err, question) {
      if (err) {
         return next(err);
      }
      if (!question) {
          return next(new Error('Failed to load question' + id));
      }
      req.question = question;
      next();
   });
};

/**
* Question athourization middleware
**/
exports.hasAuthourization = function(req, res, next) {
   if (req.question.user.id !== req.user.id) {
      return res.status(403).send({
         message: 'User is not authorized'
      });
   }
   next();
};