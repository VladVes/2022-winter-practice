const { Schema, model } = require('mongoose');

const Status = new Schema({
  name: { type: String, required: true, unique: true },
  boardIds: { type: ['ObjectId'] },
}, {
  collection: 'Status',
  timestamps: { createdAt: 'createdAt' },
});

module.exports = model('Status', Status);
