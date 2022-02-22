const { Schema, model } = require('mongoose');

const Status = new Schema(
  {
    name: { type: String, required: true },
    boardIds: { type: ['ObjectId'], required: true, ref: 'Board' },
  },
  {
    collection: 'Status',
    timestamps: { createdAt: 'createdAt' },
  },
);

module.exports = model('Status', Status);
