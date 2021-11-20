import { get, patch, post, deleteMethod } from "../axios";

const pathName = (path) => `/project${path}`;

/**
 * 
 * @param {string} content 
 * @param { 
 *          notFull?: bool | null,
 *          department?: string | null,
 *          deadline?: string | null,
 *          groupSize?: number | null
 * } filterInfo 
 */
export async function searchForProjects(content, filterInfo = {}) {
    const params = new URLSearchParams({
        content: content
    }).toString();
    return post(pathName(`/search?${params}`), filterInfo);
}

/**
 * 
 * @param {
 *  {
 *      title: string;
 *      description: string;
 *      courseCode: string;
 *      department: string;
 *      capacity: number;
 *      deadline: string;
 *  }
 * } projectData 
 */
export async function createProject(projectData) {
    return post(pathName("/"), projectData);
}

/**
 * 
 * admin get all projects
 */
export const getAllProjects = () => get(pathName(""))

/**
  * 
  * get project
  * @param {string} projId project id
  */
export const getProjectDetail = (projId) => get(pathName(`/id/${projId}`))
 
/**
  * 
  * delete project
  * @param {string} projId project id
  */
export const deleteProject = (projId) => deleteMethod(pathName(`/delete/${projId}`))

/**
  * 
  * get all request
  * @param {string} requestId
  */
export const acceptProjectRequest = (projectId, requesterId) => post(pathName(`/manageRequest/${projectId}`), {
  decision: 0,
  requesterId: requesterId
})

/**
  * 
  * get all request
  * @param {string} requestId
  */
export const rejectProjectRequest = (projectId, requesterId) => post(pathName(`/manageRequest/${projectId}`), {
  decision: 1,
  requesterId: requesterId
})

/**
  * 
  * get all request
  * @param {string} projId
  * @param {string} taskId
  * @param {string} previous
  * @param {string} target
  */
 export const moveTask = (projId, taskId, previous, target) => post(pathName(`/moveTask/${projId}`), {
  taskId,
  previous: Number(previous),
  target: Number(target)
 })

export const addRequest = (infoString, projectId) => post(pathName(`/addRequest/${projectId}`), { info: infoString });