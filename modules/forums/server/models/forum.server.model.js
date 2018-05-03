'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * setNumberValueToZero
 * @param v
 * @returns {number}
 */
var setNumberValueToZero = function (v) {
  return v < 0 ? 0 : v;
};

/**
 * Forum Schema
 */
var ForumSchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  desc: {
    type: String,
    default: '',
    trim: true
  },
  img: {
    type: String,
    default: '',
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  operOnly: {
    type: Boolean,
    default: false
  },
  vipOnly: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: 'discuss',
    trim: true
  },

  topicCount: {
    type: Number,
    set: setNumberValueToZero,
    default: 0
  },
  replyCount: {
    type: Number,
    set: setNumberValueToZero,
    default: 0
  },

  lastTopic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  },

  moderators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

ForumSchema.index({order: 1, createdat: -1});
ForumSchema.index({category: 1, order: 1, createdat: -1});

mongoose.model('Forum', ForumSchema);
