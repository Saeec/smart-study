// backend/Models/Note.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: '',
  },
  subject: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
