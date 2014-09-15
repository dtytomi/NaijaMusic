'use strict';

/**
*Module dependies
**/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
*  Question Schema
**/

var QuestionSchema = new Schema({
   created: {
      type: String,
      default: Date.now
   },
   title: {
      type: String,
      default: '',
      trim: true,
      required: 'Title cannot be blank'
   },
   user: {
      type: Schema.ObjectId,
      ref: 'User'
   }
});

mongoose.model('Question', QuestionSchema);