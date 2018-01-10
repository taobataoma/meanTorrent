'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * rating Schema
 */
var RatingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  vote: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

mongoose.model('Rating', RatingSchema);

/**
 * Sub Thumb Schema
 */
var ThumbSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});

mongoose.model('Thumb', ThumbSchema);

/**
 * Sub Comment Schema
 */
var CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comment: {
    type: String,
    default: '',
    trim: true
  },
  _replies: [this],
  createdat: {
    type: Date,
    default: Date.now
  },
  editedby: {
    type: String,
    default: '',
    trim: true
  },
  editedat: {
    type: Date,
    default: ''
  }
}, {usePushEach: true});

mongoose.model('Comment', CommentSchema);

/**
 * exports
 */
exports.RatingSchema = RatingSchema;
exports.ThumbSchema = ThumbSchema;
exports.CommentSchema = CommentSchema;
