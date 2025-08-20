// backend/Models/Task.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String, // Storing subject name for easy reference
    required: true,
  },
  deadline: {
    type: Date,
    required: false,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'], // Only allow these values
    default: 'Medium',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
