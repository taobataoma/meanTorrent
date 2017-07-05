'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
  category: {
    type: String,
    default: 'discuss',
    trim: true
  },

  topicCount: {
    type: Number,
    default: 0
  },
  replyCount: {
    type: Number,
    default: 0
  },
  todayCount: {
    type: Number,
    default: 0
  },

  lastNewTopic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  },
  lastReplyTopic: {
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
});


mongoose.model('Forum', ForumSchema);
