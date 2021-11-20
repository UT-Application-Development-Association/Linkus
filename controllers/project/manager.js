const { Task } = require('../../models/task');
const { Account } = require('../../models/account');

async function getFilledProject(project) {
    // console.log(project)
    const account = await Account.findById(project.owner).lean();

    if (!account) return Promise.reject();

    project.ownerSimple = account.profile;

    const plan = [];
    for (let taskId of project.planning) {
        const task = await Task.findById(taskId).lean();
        const acc = await Account.findById(task.assigneeId).lean();
        task.userSimple = acc.profile;
        const commentTemp = [];
        for (let comment of task.comments) {
            const account = await Account.findById(comment.userId).lean();
            comment.userSimple = account.profile;
            commentTemp.push(comment);
        }
        task.comments = commentTemp;
        plan.push(task);
    }
    project.planTask = plan;

    const develop = [];
    for (let taskId of project.developing) {
        const task = await Task.findById(taskId).lean();
        const acc = await Account.findById(task.assigneeId).lean();
        task.userSimple = acc.profile;
        const commentTemp = [];
        for (let comment of task.comments) {
            const account = await Account.findById(comment.userId).lean();
            comment.userSimple = account.profile;
            commentTemp.push(comment);
        }
        task.comments = commentTemp;
        develop.push(task);
    }
    project.developTask = develop;

    const finish = [];
    for (let taskId of project.finished) {
        const task = await Task.findById(taskId).lean();
        const acc = await Account.findById(task.assigneeId).lean();
        task.userSimple = acc.profile;
        const commentTemp = [];
        for (let comment of task.comments) {
            const account = await Account.findById(comment.userId).lean();
            comment.userSimple = account.profile;
            commentTemp.push(comment);
        }
        task.comments = commentTemp;
        finish.push(task);
    }
    project.finishedTask = finish;

    const members = [];
    for (let memberId of project.members){
        const acc = await Account.findById(memberId).lean();
        const result = acc.profile
        result.memberId = memberId;
        members.push(result);
    }

    const requests = [];
    for (let req of project.requests){
        const acc = await  Account.findById(req.userId).lean();
        req.user = acc ? acc.profile : {}
        requests.push(req);
    }

    project.memberSimple = members;
    project.requests = requests

    return project;
}

async function isValidateProjectOperator(project, accountId) {
    try {
        const acc = await Account.findById(accountId);
        if (project.owner.toString() === acc._id.toString()) {
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
}

module.exports = {
    getFilledProject,
    isValidateProjectOperator
}