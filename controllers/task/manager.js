const { Project } = require('../../models/project');
const { Account } = require('../../models/account');

async function getFilledObject(task) {
    const project = await Project.findById(task.projectId).lean();
    if (!project) return Promise.reject();
    
    const account = await Account.findById(task.assigneeId).lean();
    if (!account) return Promise.reject();

    let section = "planning";
    if (project.planning.filter(item => item.toString() === task._id).length > 0) section = "planning";
    else if (project.developing.filter(item => item.toString() === task._id).length > 0) section = "developing";
    else if (project.finished.filter(item => item.toString() === task._id).length > 0) section = "finished";
    
    task.projectSimple = {
        name: project.title,
        deadline: project.deadline
    }
    const temp = [];
    for (let comment of task.comments) {
        let acc = await Account.findById(comment.userId).lean();
        comment.userSimple = acc.profile;
        temp.push(comment);
    }
    task.comments = temp;

    task.assigneeSimple = account.profile;

    task.section = section;

    return task;
}

async function isValidateTaskOperator(projectId, account) {
    try {
        if (account.role === 2) return true;
        const project = await Project.findById(projectId);
        if (project.owner.toString() === account._id.toString()) {
            return true;
        }
        for (let m in project.members) {
            if (m.toString() === account._id.toString()) {
                return true;
            }
        }
    } catch (e) {
        return false;
    }
    return false;
}

module.exports = {
    getFilledObject,
    isValidateTaskOperator
}