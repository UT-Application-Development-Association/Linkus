const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const { ReportedComment } = require('../../models/reportedComment');
const { uuidValidator } = require('../../utils/routerUtil');
const { authIsAdmin, authIsUser } = require('../../utils/authUtils');
const { getFilledObject } = require('./manager');
const { Task } = require('../../models/task');
const { Account } = require('../../models/account');
const pathName = (path) => `/report${path}`;

// http://localhost:3000/api/report
/** Report a comment
 *  @param {{ 
 *  comment: {
 *          targetId: mongoose.Types.ObjectId; 
 *          userId: mongoose.Types.ObjectId; 
 *          comment: string;
 *  }
 * }} body
 */
router.post(pathName("/"), uuidValidator, authIsUser, async (req, res) => {
    if (req.body) {
        const temp = {};
        temp.reporterId = req.account._id;
        temp.reportDate = new Date().toISOString().slice(0, 10);
        temp.comment = req.body.comment;
        try {
            const report = new ReportedComment(temp);
            const savedAcc = await report.save();
            const ret = await getFilledObject(savedAcc.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json("Database error " + e);
        }
    } else {
        res.status(400).json("Empty request body not allowed.");
    }
});

// http://localhost:3000/api/report/all
/** Get all reports
 */
router.get(pathName("/all"), authIsAdmin, async (req, res) => {
    try {
        const reports = ReportedComment.find();
        const ret = await Promise.all((await reports).map(async report => await getFilledObject(report.toObject())));
        res.json(ret);
    } catch (e) {
        res.status(500).json("Database error: " + e);
    }
})

// http://localhost:3000/api/report/delete/:uuid
/**
 * @param {mongoose.Types.ObjectId} uuid
 */
router.delete(pathName("/delete/:uuid"), uuidValidator, authIsAdmin, async (req, res) => {
    try {
        const report = await ReportedComment.findById(req.params.uuid);

        const task = await Task.findById(report.comment.targetId);
        const account = await Account.findById(report.comment.targetId);
        let ret = null;
        if (task) {
            ret = await Task.findByIdAndUpdate(
                { _id: task._id },
                { $pull: { comments: { _id: report.comment._id } } },
                { new: true });
        }
        else if (account) {
            ret = await Account.findByIdAndUpdate(
                { _id: account._id },
                { $pull: { "profile.comments": { _id: report.comment._id } } },
                { new: true });
        }
        await report.remove();
        res.json(ret);
    } catch (e) {
        res.status(500).json("Database error: " + e);
    }
})

// http://localhost:3000/api/report/ignore/:uuid
/**
 * @param {mongoose.Types.ObjectId} uuid
 */
 router.delete(pathName("/ignore/:uuid"), uuidValidator, authIsAdmin, async (req, res) => {
    try {
        const report = await ReportedComment.findById(req.params.uuid);
        const ret = await report.remove();
        res.json(ret);
    } catch (e) {
        res.status(500).json("Database error: " + e);
    }
})


module.exports = { router };