// backend/Models/Subject.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This creates a reference to the User model
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
