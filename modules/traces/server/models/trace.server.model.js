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

TraceSchema.index({createdat: -1});
TraceSchema.index({'content.action': 1, createdat: -1});

mongoose.model('Trace', TraceSchema);
