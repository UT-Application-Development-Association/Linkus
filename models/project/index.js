const { mongoose } = require("../../mongoose");
const { RequestSchema } = require('../base');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    members: [mongoose.Types.ObjectId],
    capacity: {
        type: Number,
        required: true,
    },
    creationDate: {
        type: Date,
        required: true
    },
    courseCode: {
        type: String,
        required: true,
        minlength: 1
    },
    department: {
        type: String,
        required: true,
        minlength: 1
    },
    deadline: {
        type: Date,
        required: true
    },
    requests: [RequestSchema],
    planning: [mongoose.Types.ObjectId],
    developing: [mongoose.Types.ObjectId],
    finished: [mongoose.Types.ObjectId]
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = { Project, ProjectSchema };