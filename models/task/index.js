const { mongoose } = require('../../mongoose');
const { CommentSchema } = require('../base');

const TaskSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    assigneeId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        requried: true
    },
    dueDate: {
        type: Date
    },
    comments: [CommentSchema]
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task, TaskSchema }