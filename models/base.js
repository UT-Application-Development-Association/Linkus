const { mongoose } = require("../mongoose");

const CommentSchema = new mongoose.Schema({
    targetId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
        minlength: 1,
        required: true
    }
});

const RequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    info: {
        type: String,
        required: true,
        minlength: 1
    }
});

module.exports = {
    CommentSchema,
    RequestSchema
}