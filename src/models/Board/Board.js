const { Schema, model } = require('mongoose');

const Board = new Schema(
  {
    name: { type: String, required: true },
    projectId: { type: 'ObjectId', required: true, ref: 'Project' },
    color: { type: String },
  },
  {
    collection: 'Boards',
    timestamps: { createdAt: 'createdAt' },
  },
);

module.exports = model('Board', Board);
