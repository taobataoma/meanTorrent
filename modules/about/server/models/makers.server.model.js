'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Maker Schema
 */
var MakerSchema = new Schema({
  founder: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    unique: 'GROUP_NAME_ALREADY_EXISTS',
    required: 'PLEASE_ENTER_GROUP_NAME',
    trim: true,
    default: ''
  },
  desc: {
    type: String,
    trim: true,
    default: ''
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  vote_average: {
    type: Number,
    default: 0
  },
  vote_total: {
    type: Number,
    default: 0
  },
  vote_count: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Maker', MakerSchema);
