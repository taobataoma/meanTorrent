'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Peer Schema
 */
var ScoreLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  score: {
    type: Schema.Types.Decimal128,
    get: function (v) {
      return parseFloat(parseFloat(v).toFixed(2)) || 0;
    },
    default: 0
  },
  reason: {
    event: {type: String, trim: true, default: ''},
    params: {type: Object}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {usePushEach: true});


ScoreLogSchema.index({user: 1, createdAt: -1});

mongoose.model('ScoreLog', ScoreLogSchema);
