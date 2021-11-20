const router = require('express').Router();
const { Project } = require('../../models/project');
const { uuidValidator } = require('../../utils/routerUtil');
const {authIsUser, authIsAdmin} = require("../../utils/authUtils");
const { getFilledProject, isValidateProjectOperator} = require('./manager');
const {Account} = require("../../models/account");

'use strict'
const pathName = (path) => `/project${path}`;


function isExpired(project){
    const current = new Date();
    return current > project.deadline;
}

function hasAccess(req, project) {
    // console.log(project)
    if (req.account._id.toString() === project.owner.toString()){
        return true;
    }
    for(const member of project.members){
        if(member.toString() === req.account._id.toString()){
            return true;
        }
    }
    return false;
}


/** GET
 * Get all projects stored in the database.
 */
router.get(pathName("/"), authIsAdmin, async (req, res) => {
    Project.find()
        .exec(async function (err, projects) {
            if (err) res.status(500).json("Database error: " + err.message);
            else {
                const result = []
                for (let temp of projects){
                    // if (await isExpired(temp)) continue;
                    const ret = await getFilledProject(temp.toObject());
                    result.push(ret)
                }
                res.json(result);
            }
        })
});

/** GET
 * Get a project by its ObjectId.
 */
router.get(pathName("/id/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    try {
        const project = await Project.findById(req.params.uuid);
        if (!project) { 
            res.status(404).json("Project not found");
            return;
        }
        const ret = await getFilledProject(project.toObject());
        res.json(ret);
    } catch (e) {
        res.status(500).json("Database error: " + err.message);
    }
})

/** POST
 * Upload a new Project object. It does the following operations:
 * Create a new Project object
 * Expected request body: (Project Object)
 * {
 * title: string,
 * description: string,
 * courseCode: string,
 * department: string,
 * capacity: number,
 * deadline: Date,
 * creationDate: Date
 * }
 * Return new Project object.
 */
router.post(pathName("/"), authIsUser, async (req, res) => {
    if (req.body) {
        const project = {
            title: req.body.title,
            description: req.body.description,
            owner: req.account._id,
            courseCode: req.body.courseCode,
            department: req.body.department,
            capacity: req.body.capacity,
            members: [],
            deadline: req.body.deadline,
            creationDate: new Date(),
            requests: [],
            planning: [],
            developing: [],
            finished: []
        };
        project.members.push(project.owner)
        // Create new Project
        const newProject = new Project(project);
        try {
            const result = await newProject.save();
            const acc = await Account.findById(result.owner);
            acc.myProjects.push(result._id);
            await acc.save();
            // Return Result
            const ret = await getFilledProject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json("Database error: " + e.message);
        }
    }
    else {
        res.status(400).json("No request body.")
    }
})

/** POST
 * Manage a Request
 * 1. Add Member to Project if a request is approved and delete the request:
 * 2. Delete the request if a request is declined:
 * {
 *      requesterId: ObjectId,
 *      decision: Number 
 * }
 * decision:
 * 0 = approved
 * 1 = declined
 * Return the updated project object.
 */
router.post(pathName("/manageRequest/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    if(req.body) {
        try {
            const projectDoc = await Project.findById(req.params.uuid);
            // console.log(projectDoc)
            if (!hasAccess(req, projectDoc)){res.status(400).json("User is not a member of the project.")}
            if (!await isValidateProjectOperator(projectDoc, req.account._id)) {
                res.status(401).json("You are not the owner of this project.");
                return;
            }
            // if (isExpired(projectDoc)) res.status(400).json("the project has expired") ;
            if(req.body.decision === 0) {
                for (let acc in projectDoc.members) {
                    if (acc.uuid === req.body.requesterId) {
                        res.status(400).json("Input error: Member already in Project");
                        return;
                    }
                }
                const acc = await Account.findById((req.body.requesterId))
                acc.myProjects.push(req.params.uuid);
                await acc.save();
                projectDoc.members.push(req.body.requesterId);
                projectDoc.requests = projectDoc.requests.filter(item => item.userId.toString() !== req.body.requesterId);
                const ret = await projectDoc.save();
                res.json(ret);
            } else if (req.body.decision === 1) {
                // console.log(projectDoc.requests[0].userId, req.body.requesterId);
                projectDoc.requests = projectDoc.requests.filter(item => item.userId.toString() !== req.body.requesterId);
                const result = await projectDoc.save();
                const ret = await getFilledProject(result.toObject());
                res.json(ret);
            } else{
                res.status(400).json("Input error: \n" +
                    "0 = approved\n" +
                    "1 = declined")
            }
        } catch (e) {
            res.status(500).json("Database error: " + e.message);
        }
    }
    else {
        res.status(400).json("No request body.")
    }
})

/** POST
 * Move a Task to a different field:
 * Expects the following request body:
 * {
 *      taskId: ObjectId,
 *      previous: Number,
 *      target: Number
 * }
 * 0 -- planning
 * 1 -- developing
 * 2 -- finished
 * Return the updated project object.
 */
router.post(pathName("/moveTask/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    if(req.body) {
        try {
            const projectDoc = await Project.findById(req.params.uuid)
            if (!hasAccess(req, projectDoc)){res.status(400).json("User is not a member of the project.")}
            // if (isExpired(projectDoc)) res.status(400).json("the project has expired") ;
            if(req.body.previous === 0) {
                projectDoc.planning = projectDoc.planning.filter(item => item.toString() !== req.body.taskId);
            }
            else if(req.body.previous === 1){
                projectDoc.developing = projectDoc.developing.filter(item => item.toString() !== req.body.taskId);
            }
            else if(req.body.previous === 2) {
                projectDoc.finished = projectDoc.finished.filter(item => item.toString() !== req.body.taskId);
            }
            else{
                res.status(400).json("Invalid queue type: valid types are: \n" +
                    "0 -- planning\n" +
                    "1 -- developing\n" +
                    "2 -- finished")
            }
            if(req.body.target === 0){
                projectDoc.planning.push(req.body.taskId)
            }else if(req.body.target === 1){
                projectDoc.developing.push(req.body.taskId)
            }else if(req.body.target === 2) {
                projectDoc.finished.push(req.body.taskId)
            }else{
                res.status(400).json("Invalid queue type: valid types are: \n" +
                    "0 -- planning\n" +
                    "1 -- developing\n" +
                    "2 -- finished")
            }
            const result = await projectDoc.save();
            const ret = await getFilledProject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json("Database error: " + e.message);
        }
    }
    else {
        res.status(400).json("No request body.")
    }
})

/** POST
 * Add Request to a Project:
 * Expects the following request body: (Request object)
 * {
 *      info: string
 * }
 * Return the updated project object.
 */
router.post(pathName("/addRequest/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    if(req.body) {
        try {
            const requestInfo = {
                userId: req.account._id,
                info : req.body.info
            }
            const projectDoc = await Project.findById(req.params.uuid);
            // if (await isExpired(projectDoc)) res.status(400).json("the project has expired") ;
            projectDoc.requests.push(requestInfo);
            const result = await projectDoc.save();
            const ret = await getFilledProject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json("Database error: " + e.message);
        }
    }
    else {
        res.status(400).json("No request body.");
    }
})

/** PATCH
 * Update a Project object. It does the following operations:
 * 1. Update fields in Task Collection
 * Expected request body:
 * {
 *   <any field in Task>: new value
 * }
 * Return the new Task object.
 * Only updating non-list datatype
 */
router.patch(pathName("/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    if (req.body) {
        try {
            const project = await Project.findById(req.params.uuid);
            if (!hasAccess(req, project)){res.status(400).json("User is not a member of the project.")}
            // if (await isExpired(project)) res.status(400).json("the project has expired") ;
            if (!await isValidateProjectOperator(project, req.account._id)) {
                res.status(401).json("You are not the owner of this project.");
                return;
            }
            for (let field in req.body) {
                if (field === '_id' || typeof field === 'object') continue;
                if (project[field]) {
                    project[field] = req.body[field];
                }
            }
            const result = await project.save();
            const ret = await getFilledProject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json("Database error: " + e.message);
        }
    }
    else {
        res.status(400).json("No request body.")
    }
})

/** DELETE
 * Delete a Project object. It does the following operations:
 * 1. Delete the tasks in the project
 * 2. Delete project.
 * Return deleted project object.
 */
router.delete(pathName("/delete/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    try {
        const projectDoc = await Project.findById(req.params.uuid);
        if (req.account.role !== 2) {
            if (!hasAccess(req, projectDoc)){res.status(400).json("User is not a member of the project.")}
            if (!await isValidateProjectOperator(projectDoc, req.account._id)) {
                res.status(401).json("You are not the owner of this project.");
                return;
            }
        }
        if (!projectDoc) res.status(400).json("no such project");
        projectDoc.planning = [];
        projectDoc.finished = [];
        projectDoc.developing = [];
        await projectDoc.save();
        await Project.deleteOne(projectDoc);
        const owner = await Account.findById(projectDoc.owner);
        owner.myProjects = owner.myProjects.filter( p => p.toString() !== req.params.uuid);
        await owner.save();
        for (const member of projectDoc.members){
            const acc = await Account.findById(member);
            acc.myProjects = acc.myProjects.filter( p => p.toString() !== req.params.uuid);
            await acc.save();
        }
        const ret = await getFilledProject(projectDoc.toObject());
        res.json(ret);
    } catch (e) {
        res.status(500).json("Database error: " + e.message);
    }
})

/** Delete
 * Delete a member in the project. It does the following operations:
 * Expects the following request body:
 * {
 *      memberId: ObjectId
 * }
 * Return the updated project object.
 */
router.delete(pathName("/deleteMember/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    if (req.body) {
        try {
            const projectDoc = await Project.findById(req.params.uuid);
            if (!await isValidateProjectOperator(projectDoc, req.account._id)) {
                res.status(401).json("You are not the owner of this project.");
                return;
            }
            projectDoc.members = projectDoc.members.filter(item => item.toString() !== req.body.memberId);
            const result = await projectDoc.save();
            const acc = await Account.findById(req.body.memberId);
            acc.myProjects.filter( p => p.toString() !== req.params.uuid);
            await acc.save();
            const ret = await getFilledProject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json("Database error: " + e.message);
        }
    }
})


/** POST
 * Search for projects:
 * Expects the following request body:
 * {
 *       notFull: boolean,
 *       department: string,
 *       deadline: date,
 *       groupSize: string
 * }
 * Return a list of matched project object.
 */
router.post(pathName("/search"), async (req, res) => {
    try {
        const searchContent = req.query.content;
        let projects = await Project.find({
            title: {$regex: new RegExp(`^(.*)${searchContent}(.*)$`), $options: 'i'},
        });
        // projects = projects.filter(temp => isExpired(temp.deadline));
        if (Object.keys(req.body).length !== 0) {
            if (req.body.notFull !== null) {
                if (req.body.notFull === true) {
                    projects = projects.filter(temp => temp.members.length < temp.capacity);
                } else {
                    projects = projects.filter(temp => temp.members.length >= temp.capacity);
                }
            }
            if (req.body.department !== null) {
                const re = RegExp(`^(.*)${req.body.department}(.*)$`)
                projects = projects.filter(temp => re.test(temp.department))
            }
            if (req.body.deadline !== "1970-01-01T00:00:00.000Z") {
                const deadline = new Date(req.body.deadline)
                projects = projects.filter(temp => ((deadline.getFullYear() === temp.deadline.getFullYear())
                    && (deadline.getMonth() === temp.deadline.getMonth())) && (deadline.getDate() === temp.deadline.getDate()))
            }
            if (req.body.groupSize !== null) {
                projects = projects.filter(temp => temp.members.length === req.body.groupSize)
            }
        }
        
        const ret = await Promise.all(projects.map(async project => await getFilledProject(project.toObject())));
        res.json(ret);
    } catch (e) {
        res.status(500).json("Database error: " + e);
    }
})


module.exports = { router };
