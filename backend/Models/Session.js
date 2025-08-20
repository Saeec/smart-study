// backend/Models/Session.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  subject: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // Duration stored in seconds
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
