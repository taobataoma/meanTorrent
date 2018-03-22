'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ticket Schema
 */
var MailTicketSchema = new Schema({
  from: {
    type: String,
    default: '',
    trim: true
  },
  to: {
    type: String,
    default: '',
    trim: true
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
    default: 0      //0 new, 1 handling, 2 solved
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

MailTicketSchema.index({updatedAt: -1, createdAt: -1});
MailTicketSchema.index({status: -1, updatedAt: -1});

mongoose.model('MailTicket', MailTicketSchema);
