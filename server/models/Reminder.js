const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  username: String,
  email: String,
  targetDate: Date,
  isSent: { type: Boolean, default: false },
});

module.exports = mongoose.model('Reminder', ReminderSchema);
