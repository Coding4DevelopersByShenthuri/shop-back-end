const mongoose = require('mongoose');

const faceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  faceEncoding: { type: Array, required: true }, // Array of encodings
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Face', faceSchema);
