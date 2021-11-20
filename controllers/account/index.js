const router = require('express').Router();
var mongoose = require('mongoose');
const { Account } = require('../../models/account');
const { ReportedComment } = require('../../models/reportedComment');
const pathName = (path) => `/account${path}`;
const { authIsAdmin, authIsUser } = require('../../utils/authUtils');
// md5 Encryption
const md5 = require("js-md5");
const { excludeArray, uuidValidator } = require('../../utils/routerUtil');
const { getFilledObject } = require('./manager');

// User registration  http://localhost:3000/api/account/registration
/** Register an account.
 * 
 * Expected request body: Accoutn object
 */
router.post(pathName("/registration"), async (req, res) => {
    if (req.body) {
        try {
            // Verify that the database is registered
            if (await Account.findOne({ email: req.body.email })) {
                res.status(500).json("Failed: username email already exists.");
                return;
            }
            // Failed to enter the registration process
            // Encryption password
            let userdata = {
                email: req.body.email,
                password: md5(req.body.password),
                profile: {
                    username: req.body.username,
                    yearOfStudy: 1,
                    program: 'none',
                    exGPA: 4,
                    bio: 'No bio found',
                    courses: [],
                    comments: [],
                },
                role: 1,
                myProjects: []
            }
            // save user
            const acc = new Account(userdata);
            const result = await acc.save();
            // set session
            req.session.userId = result._id;
            // Return login ID, provide front-end usage, and get user related information
            const ret = await getFilledObject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json("Error: " + e);
        }
    }
    else {
        res.status(500).json("Failed: field \"username\" is required");
    }
});

// User registration  http://localhost:3000/api/account/registrationAdmin
/** Register an account.
 *
 * Expected request body: Accoutn object
 */
router.post(pathName("/registrationAdmin"), async (req, res) => {
    if (req.body) {
        try {
            // Verify that the database is registered
            if (await Account.findOne({ email: req.body.email })) {
                res.status(500).json("Failed: username email already exists.");
                return;
            }
            // Failed to enter the registration process
            // Encryption password
            let userdata = {
                email: req.body.email,
                password: md5(req.body.password),
                profile: {
                    username: req.body.username,
                    yearOfStudy: 1,
                    program: 'none',
                    exGPA: 4,
                    bio: 'No bio found',
                    courses: [],
                    comments: [],
                },
                role: 2,
                myProjects: []
            }
            // save user
            const acc = new Account(userdata);
            const result = await acc.save();
            // set session
            req.session.userId = result._id;
            // Return login ID, provide front-end usage, and get user related information
            res.json(result);
        } catch (e) {
            res.status(500).json("Error: " + e);
        }
    }
    else {
        res.status(500).json("Failed: field \"username\" is required");
    }
});

// login http://localhost:3000/api/account/loginuser
/** Login user.
 *  Expected request body: 
 * {
 *      email,
 *      password
 * }
*/
router.post(pathName("/login"), async (req, res) => {
    if (req.body) {
        try {
            let email = req.body.email;
            let password = req.body.password;

            const result = await Account.verifyLoginInfo(email, password);
            if (result) {
                // Return login ID, provide front-end usage, and get user related information
                
                // set session
                req.session.userId = result._id;

                const ret = await getFilledObject(result.toObject());
                res.status(200).json(ret);
                return;
            } else {
                res.status(401).json("login");
            }
        } catch (e) {
            res.status(401).json("login");
        }
    }
    else {
        res.status(401).json("login");
    }
});

router.get(pathName("/logout"), authIsUser, async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.status(500).json("Database error: " + error);
        }
        else res.send();
    });
})

// http://localhost:3000/api/account/getinfo Get user information , Display of user information
router.get(pathName("/user/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    try {
        const result = await Account.findById(req.params.uuid);
        if (result) {
            const ret = await getFilledObject(result.toObject());
            res.json(ret);
        } else {
            res.status(500).json("Failed to ge profile: uuid not exist.");
        }
    } catch (e) {
        res.status(500).json("Error:", e);
    }
});

router.get(pathName("/users"), authIsAdmin, async (req, res) => {
    try {
        const results = await Account.find();
        if (results) {
            ret = await Promise.all(results.map(async acc => await getFilledObject(acc.toObject())));
            res.json(ret);
        } else {
            res.status(500).json("Failed: uuid not exist.");
        }
    } catch (e) {
        res.status(500).json("Error:", e);
    }
});

//  http://localhost:3000/api/account/updatainfo  Modify user information
/** Patch fields in profile
 * 
 * Expected request body:
 * {
 *      <any field in profile except arary objects>: <new value>
 * }
 */
router.patch(pathName("/profile"), uuidValidator, authIsUser, async (req, res) => {
    // Update user information according to user ID
    if (req.body) {
        try {
            const acc = await Account.findById(req.account._id);
            if (!acc) {
                res.status(401).json("User not found.")
            }
            for (let field in req.body) {
                if (field === "comments") continue;
                acc.profile[field] = req.body[field];
            }
            const result = await acc.save();
            const ret = await getFilledObject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json("Error: " + e);
        }
    }
    else {
        res.status(500).json("Error: Request body should not be empty.");
    }
});

/** Add new comemnt.
 * 
 * Expected request body: CommentSchema
 */
router.post(pathName("/comment/:uuid"), uuidValidator, authIsUser, async (req, res) => {
    if (req.body) {
        req.body.targetId = req.params.uuid;
        req.body.userId = req.account._id;
        try {
            const result = await Account.findByIdAndUpdate(
                { _id: req.body.targetId },
                { $push: { "profile.comments": req.body } },
                { new: true });
            const ret = await getFilledObject(result.toObject());
            res.json(ret);
        } catch (e) {
            res.status(500).json(e);
        }
    } else { 
        res.status(400).json("Request body should not be empty.");
    }
})

router.get(pathName("/check-session"), authIsUser, async (req, res) => {
    const ret = await getFilledObject(req.account.toObject());
    res.json(ret);
})




module.exports = { router };