const e = require("express");
const { Account } = require("../../models/account");
const { Task } = require("../../models/task");


async function getFilledObject(report) {
    const reporter = await Account.findById(report.reporterId);  
    const commenter = await Account.findById(report.comment.userId);

    report.reporter = reporter.profile;
    report.commenter = commenter.profile;

    const task = await Task.findById(report.comment.targetId);
    const acc = await Account.findById(report.comment.targetId);
    if (task) {
        report.task = task;
        report.account = null;
    } else if (acc) {  
        report.task = null;
        report.account = acc;
    }
    return report;
}

module.exports = {
    getFilledObject
}