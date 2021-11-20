const { mongoose } = require("../mongoose");

const uuidValidator = (req, res, next) => {
    if (req.params.uuid) {
        if (!isValidObjectId(req.params.uuid)) {
            res.status(400).json(`Invalid uuid: ${req.params.uuid}.`);
            return;
        }
    }
    if (req.params.id) {
        if (!isValidObjectId(req.params.id)) {
            res.status(400).json("Invalid uuid.");
            return;
        }
    }
    next();
}

function isValidObjectId(...args) {
    for (let arg of args) {
        if (!mongoose.Types.ObjectId.isValid(arg)) {
            console.log(arg);
            return false;
        }
    }
    return true;
}

function excludeArray(req, res, next){
    for (let field in req.body) {
        if (Array.isArray(req.body[field])) {
            res.status(200).json("Array field not allowed.");
            return;
        }
    }
    next();
}



module.exports = {
    isValidObjectId,
    uuidValidator,
    excludeArray
}