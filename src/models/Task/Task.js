const { Schema, model } = require('mongoose');

const Task = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    creator: { type: 'ObjectId', required: true, ref: 'User' },
    assignedTo: { type: 'ObjectId', required: true, ref: 'User' },
    boardId: { type: 'ObjectId', required: true, ref: 'Board' },
    statusId: { type: 'ObjectId', required: true, ref: 'Status' },
  },
  {
    collection: 'Tasks',
    timestamps: { createdAt: 'createdAt' },
  },
);

/**
 * Вычисляем прошедшее время от создания.
 */
Task.virtual('elapsedTime').get(() => Date.now() - Date.parse(this.createdAt));

module.exports = model('Task', Task);
