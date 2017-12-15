'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Log Schema
 */
var TraceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: Object,  //log json object
  createdat: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

mongoose.model('Trace', TraceSchema);
