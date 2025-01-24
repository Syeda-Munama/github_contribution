// const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema({
//   username: String,
//   githubAccessToken: String,
//   email: String,
//   reminderSettings: {
//     frequency: String,
//     notificationType: String,
//   }
// });
// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // 'sparse' allows multiple documents with null email
  githubId: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
