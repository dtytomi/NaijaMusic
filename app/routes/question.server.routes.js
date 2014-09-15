'use strict';

/**
* Module Dependencies.
***/ 

var users = require('../../app/controllers/users'),
   questions = require('../../app/controllers/questions');

module.exports = function(app) {

   //forum routes
   app.route('/questions')
      .get(questions.list)
      .post(users.requiresLogin, questions.create);

   app.route('/questions/chat')
      .get(users.requiresLogin, questions.hasAuthourization, questions.chat);

   app.route('/questions/:questionId')
      .get(questions.read)
      .put(users.requiresLogin, questions.hasAuthourization, questions.answer)
      .delete(users.requiresLogin, questions.hasAuthourization, questions.delete);

   //Finish by binding the question middleware   
   app.param('questionId', questions.questionByID);
};