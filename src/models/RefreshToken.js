const { Schema, model } = require('mongoose');

const RefreshToken = new Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true },
  },
  {
    collection: 'RefreshTokens',
    timestamps: { createdAt: 'createdAt' },
  },
);

module.exports = model('RefreshToken', RefreshToken);
