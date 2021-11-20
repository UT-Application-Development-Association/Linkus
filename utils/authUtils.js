const { Account } = require('../models/account');

/** Authenticate user if session is a valid userId.
 * If success, store the entire account obj in req.account.
 */
const authIsUser = async (req, res, next) => {
    if (req.session.userId) {
        try {
            const acc = await Account.findById(req.session.userId);
            if (!acc) {
                res.status(401).json("Account not found.");
                return;
            }
            req.account = acc;
            next();
        } catch (e) {
            res.status(401).json("login");
        }
        
    } else {
        res.status(401).json("No session.");
    }
}

const authIsAdmin = async (req, res, next) => {
    if (req.session.userId) {
        try {
            const acc = await Account.findById(req.session.userId);
            if (!acc) {
                res.status(401).json("login");
                return;
            }
            if (acc.role !== 2) {
                res.status(401).json("login");
                return;
            }
            req.account = acc;
            next();
        } catch (e) {
            res.status(401).json("login");
        }
        
    } else {
        res.status(401).json("login");
    }
}

module.exports = {
    authIsUser,
    authIsAdmin
}