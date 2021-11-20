import { get, post, patch, deleteMethod } from "../axios";

/** Get a new task
 * @param {ObjectId} uuid task uuid 
 */
export function getTaskByUuid(uuid) {
    return get(`/task/${uuid}`);
}

/** Upload a new task
 * @param {Task} task task object
 */
export function uploadNewTask(task) {
    return post("/task", task);
}

/** Update a task
 * 
 * @param {ObjectId} uuid task uuid 
 * @param {any} modifyBody body contains modification fields
 */
export function modifyTask(uuid, modifyBody) {
    return patch(`/task/${uuid}`, modifyBody);
} 

/** Delete a task
 * @param {ObjectId} uuid task uuid 
 */
export function deleteTaskByUuid(uuid) {
    return deleteMethod(`/task/${uuid}`);
}

/** Add new comment
 * @param uuid task uuid
 * @param comment comment object (can only contain field 'comment')
 */
export function postComment(uuid, comment) {
    return post(`/task/comment/${uuid}`, comment);
}