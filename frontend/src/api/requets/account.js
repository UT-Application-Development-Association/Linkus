import { deleteMethod, get, patch, post } from "../axios";
const pathName = (path) => ["/account", path].join("/");

/**
 * user login
 * @param {{
 *  username: string,
 *  password: string
 * }} userInfo
 */
export const signin = (userInfo) => post(pathName("login"), userInfo);

/**
 * user logout
 */
export const signout = () => get(pathName("logout"));

/**
 * user registration
 * @param {{
 *  username: string,
 *  password: string,
 *  repeatpassword: string,
 *  email: string
 * }} regInfo
 */
export const signup = (regInfo) => post(pathName("registration"), regInfo);

/**
 * get user profile detail
 * @param {string} userId
 */
export const getUserById = (userId) => get(pathName(`user/${userId}`), { id: userId });

/**
 * update user profile
 * @param {{
 *  username: string,
 * }} updatedUserInfo
 */
export const updateUser = (updatedUserInfo) => patch(pathName("profile"), updatedUserInfo);

/**
 * Get all users
 */
export const getAllUsers = () => get(pathName("users"));

/**
 * Post a comment to target user with targetId.
 * @param {ObjectId} targetId 
 * @param {{comment: string}} comment 
 * @returns 
 */
export const postComment = (targetId, comment) => post(pathName(`comment/${targetId}`), {comment: comment});

export const checkSession = () => get(pathName("check-session"));

/**
 * Admin get all account
 */
export const getAllAccounts = () => get(pathName("users"));

/**
 * Admin get all account
 * @param {string} acctId
 */
// export const deleteAccount = (acctId) => deleteMethod(pathName(`users/${acctId}`));