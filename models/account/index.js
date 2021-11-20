const { mongoose } = require('../../mongoose');
const { CommentSchema } = require('../base');
const validator = require('validator');
const md5 = require("js-md5");

const AccountSchema = new mongoose.Schema({
    email: {// UNIQUE
        type: String,
        required: true,
        minLength: 1,
        validate: {
            validator: validator.isEmail,
            message: "Invalid email"
        },
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 1
    },
    myProjects: [mongoose.Types.ObjectId],
    profile: {
        avatar: {
            type: String,
            default: "https://www.sibberhuuske.nl/wp-content/uploads/2016/10/default-avatar-300x300.png"
        },
        yearOfStudy: {
            type: Number
        },
        program: {
            type: String
        },
        username: {
            type: String,
            required: true,
            minLength: 1,
            trim: true
        },
        exGPA: {
            type: Number
        },
        bio: {
            type: String
        },
        courses: [String],
        comments: [CommentSchema]
    },
    role: {
        type: Number,
        required: true
    },
});
AccountSchema.statics.verifyLoginInfo = function (email, password) {
    const Account = this;
    return Account.findOne({ email: email }).then(acc => {
        if (!acc) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            if (acc.password === md5(password)) {
                resolve(acc);
            }
            else {
                reject();
            }
        })
    });
}

const Account = mongoose.model("Account", AccountSchema);

module.exports = { Account, AccountSchema };