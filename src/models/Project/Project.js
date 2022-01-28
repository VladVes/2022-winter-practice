const { Schema, model } = require('mongoose');

const Project = new Schema({
  name: { type: String, required: true },
  description: { type: String },
}, {
  collection: 'Projects',
  timestamps: { createdAt: 'createdAt' },
});

module.exports = model('Project', Project);
