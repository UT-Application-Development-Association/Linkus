const { mongoose } = require('../../mongoose');
const { CommentSchema } = require('../base');

const ReportedCommentSchema = new mongoose.Schema({
    comment: {
        type: CommentSchema,
        required: true
    },
    reporterId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    reportDate: {
        type: Date,
        required: true
    }
})


const ReportedComment = mongoose.model('ReportedComment', ReportedCommentSchema);

module.exports = { ReportedComment };