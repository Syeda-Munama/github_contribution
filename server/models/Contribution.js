const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  date: { type: String, required: true },
  hasContributed: { type: Boolean, required: true },
});

module.exports = mongoose.model('Contribution', contributionSchema);
