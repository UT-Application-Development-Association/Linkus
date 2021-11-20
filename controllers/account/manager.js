const { Account } = require('../../models/account');
const { Project } = require('../../models/project');

async function getFilledObject(acc) { 
    delete acc.password;

    let temp = [];
    for (let p of acc.myProjects) {
        let project = await Project.findById(p);
        let account = await Account.findById(project.owner);
        temp.push({
            projectId: p,
            title: project.title,
            deadline: project.deadline,
            owner: account.profile,
            description: project.description,
            ownerId: project.owner
        });
    }
    acc.myProjects = temp;

    temp = [];
    for (let comment of acc.profile.comments) {
        let cmt = await Account.findById(comment.userId).lean();
        comment.userSimple = cmt.profile;
        temp.push(comment);
    }

    acc.profile.comments = temp;

    return acc;
}



module.exports = {
    getFilledObject
}