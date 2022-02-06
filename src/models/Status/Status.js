const { Schema, model } = require('mongoose');

const Status = new Schema(
  {
    name: { type: String, required: true, unique: true },
    boardIds: { type: ['ObjectId'], required: true },
  },
  {
    collection: 'Status',
    timestamps: { createdAt: 'createdAt' },
  },
);

module.exports = model('Status', Status);
