'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  path = require('path'),
  CommonSchema = require(path.resolve('./modules/core/server/models/common.server.model'));

/**
 * Sub Attach Schema
 */
var AttachSchema = new Schema({
  filename: {
    type: String,
    default: '',
    trim: true
  },
  filesize: {
    type: Number,
    default: 0
  },
  downCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

/**
 * Sub Reply Schema
 */
var ReplySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },

  _attach: [AttachSchema],
  _thumbs: [CommonSchema.ThumbSchema],

  updatedAt: {
    type: Date
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});


/**
 * Topic Schema
 */
var TopicSchema = new Schema({
  forum: {
    type: Schema.Types.ObjectId,
    ref: 'Forum'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  readOnly: {
    type: Boolean,
    default: false
  },

  viewCount: {
    type: Number,
    default: 0
  },
  replyCount: {
    type: Number,
    default: 0
  },
  _replies: [ReplySchema],
  _attach: [AttachSchema],
  _thumbs: [CommonSchema.ThumbSchema],

  isTop: {
    type: Boolean,
    default: false
  },
  isGlobal: {
    type: Boolean,
    default: false
  },
  lastUser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  lastReplyAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

TopicSchema.index({forum: 1, isTop: -1, lastReplyAt: -1, createdAt: -1});
TopicSchema.index({createdAt: -1, isGlobal: 1, forum: -1});

mongoose.model('Topic', TopicSchema);
mongoose.model('Attach', AttachSchema);
mongoose.model('Reply', ReplySchema);
