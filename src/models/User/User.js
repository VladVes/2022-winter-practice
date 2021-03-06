const { Schema, model } = require('mongoose');

const User = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    projectIds: { type: ['ObjectId'], ref: 'Project' },
    boardIds: { type: ['ObjectId'], ref: 'Board' },
    avatarLink: { type: String },
  },
  {
    collection: 'Users',
    timestamps: { createdAt: 'createdAt' },
  },
);

module.exports = model('User', User);
