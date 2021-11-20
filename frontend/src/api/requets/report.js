import { get, post, deleteMethod } from "../axios";

const pathName = (path) => `/report${path}`;

/** Report a comment
 * 
 * @param { {
 * comment: {
 *      targetId: mongoose.Types.ObjectId; 
 *      userId: mongoose.Types.ObjectId; 
 *      comment: string;
 * }} } commentData a copy of reported comment, 
 *      you can just pass the comment object accquired from server
 */
export async function reportComment(commentData) {
    return post(pathName("/"), {comment: commentData});
}

/** Get all reports.
 * 
 * @returns 
 */
export async function getAllReports() {
    return get(pathName("/all"));
}

/**
 * 
 * @param {mongoose.Types.ObjectId} uuid uuid of the comment object (i.e. comment._id)
 * @returns 
 */
export async function deleteComment(uuid) {
    return deleteMethod(pathName(`/delete/${uuid}`));
}

/**
 * 
 * @param {mongoose.Types.ObjectId} uuid uuid of the comment object (i.e. comment._id)
 * @returns 
 */
 export async function ignoreReport(uuid) {
    return deleteMethod(pathName(`/ignore/${uuid}`));
}

/**
 * 
 * @param {mongoose.Types.ObjectId} uuid uuid of the comment object (i.e. comment._id)
 * @returns 
 */
 export async function deleteReport(uuid) {
    return deleteMethod(pathName(`/delete/${uuid}`));
}


