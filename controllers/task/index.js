const router = require('express').Router();
const { Task } = require('../../models/task');
const { Project } = require('../../models/project');
const { getFilledObject, isValidateTaskOperator } = require('./manager');
const { uuidValidator } = require('../../utils/routerUtil');
const { authIsAdmin, authIsUser } = require('../../utils/authUtils');

const pathName = (path) => `/task${path}`;

/** GET
 * Get all tasks stored in the database.
 */
router.get(pathName("/"), authIsAdmin, async (req, res) => {
    try {
        const tasks = await Task.find();
        const ret = await Promise.all(tasks.map(async task => 
            await getFilledObject(task.toObject())
        ));
        res.json(ret);
    } catch (e) {
        res.status(500).json("Database error: " + e.message);
    }
    
    
});

/** GET
 * Get a task by its ObjectId.
 */
router.get(pathName("/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    try {
        const task = await Task.findById(req.params.uuid);
        if (!await isValidateTaskOperator(task.projectId, req.account)) {
            res.status(401).json("You are not in this project.");
            return;
        }
        const ret = await getFilledObject(task.toObject());
        res.json(ret);
    } catch (e) {
        res.status(500).json("Database error: " + e.message);
    }
    
    
})

/** POST
 * Upload a new Task object. It does the following operations:
 * 1. Create a new Task object
 * 2. Insert a record in corresponding Project object.
 * Expected request body:
 * {
 *   projectId,
 *   assigneeId,
 *   title,
 *   description,
 *   dueDate,
 *   comments
 * }
 * Return new Task object.
 */
router.post(pathName("/"), authIsUser, async (req, res) => {
    if (req.body) {
        if (!await isValidateTaskOperator(req.body.projectId, req.account)) {
            res.status(401).json("You are not in this project.");
            return;
        }
        try {
            // Insert new Task
            const task = new Task(req.body);
            task.comments = [];
            const result = await task.save();
            // Update Project field: planning
            await Project.findByIdAndUpdate(
                { _id: req.body.projectId },
                { $push: { planning: result._id } });
            // Return Result
            const ret = await getFilledObject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json("Database error: " + e.message);
        }
    }
    else {
        res.status(400).json("No request body.")
    }
})

router.post(pathName("/comment/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    if (req.body) {
        req.body.targetId = req.params.uuid;
        req.body.userId = req.account._id;

        try {
            const task = await Task.findById(req.params.uuid);
            if (!await isValidateTaskOperator(task.projectId, req.account)) {
                res.status(401).json("You are not in this project.");
                return;
            }

            const result = await Task.findByIdAndUpdate(
                { _id: req.params.uuid },
                { $push: { comments: req.body } },
                { new: true });
            const ret = await getFilledObject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(400).json("Database error: " + e);
        }
        
    } else {
        res.status(400).json("Request body is empty.");
    }
})

/** PATCH
 * Update a Task object. It does the following operations:
 * 1. Update fields in Task Collection
 * Params: 
 * uuid: task uuid
 * 
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
            const task = await Task.findById(req.params.uuid);
            if (!await isValidateTaskOperator(task.projectId, req.account)) {
                res.status(401).json("You are not in this project.");
                return;
            }

            for (let field in req.body) {
                if (field === '_id') continue;
                if (task[field]) {
                    task[field] = req.body[field];
                }
            }
            const result = await task.save();
            const ret = await getFilledObject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json("Database error: " + e.message);
        }
    }
    else {
        res.status(400).json("No request body.");
    }
})

/** DELETE
 * Delete a Task object. It does the following operations:
 * 1. Delete the task object
 * 2. Delete field in Project.
 * Return deleted Task object.
 */
router.delete(pathName("/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    try {
        const task = await Task.findById(req.params.uuid);
        const project = await Project.findById(task.projectId);
        // check permission
        if (!isValidateTaskOperator(task.projectId, req.account)) {
            res.status(401).json("Unauthorized.");
            return;
        }

        // Remove reference field in project
        deleteIdInFields(project, req.params.uuid);
        await project.save();
        // Remove task
        const ret = task.remove();
        res.json(ret);
    } catch (e) {
        res.status(500).json("Database error: " + e.message);
    }
})

function deleteIdInFields(project, uuid) {
    project.planning = project.planning.filter(id => id.toString() !== uuid);
    project.developing = project.developing.filter(id => id.toString() !== uuid);
    project.finished = project.finished.filter(id => id.toString() !== uuid);
}

module.exports = { router };