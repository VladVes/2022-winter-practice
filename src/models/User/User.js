const { Schema, model } = require('mongoose');

const User = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    projectIds: { type: ['ObjectId'] },
  },
  {
    collection: 'Users',
    timestamps: { createdAt: 'createdAt' },
  },
);

module.exports = model('User', User);
