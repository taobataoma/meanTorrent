'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ticket Schema
 */
var MessageTicketSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
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
  attach: [{
    type: String,
    default: '',
    trim: true
  }],
  handler: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  _replies: [this],

  status: {
    type: Number,
    default: 0      //0 open(waiting handling), 1 wait(waiting reply), 2 solved
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  handlerAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
}, {usePushEach: true});

MessageTicketSchema.index({updatedAt: -1, createdAt: -1});
MessageTicketSchema.index({status: -1, updatedAt: -1});

mongoose.model('MessageTicket', MessageTicketSchema);
