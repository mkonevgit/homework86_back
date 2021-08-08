const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const {nanoid} = require("nanoid");
const SALT_WORK_FACTOR = 10;

const UserSchema = mongoose.Schema({
    username: {
        type: "String",
        required: true,
        unique: true,
        validate: {
            validator: async value => {
                const user = await User.findOne({username: value});
                return !user;
            },
            message: "This user is already registered"
        }
    },
    display: {
        type: "String",
        required: true
    },
    phone: {
        type: "String",
        required: true
    },
    password: {
        type: "String",
        required: true,
        // validate: {
        //     validator: async value => {
        //         if (value.length < 8) return false;
        //     },
        //     message: "Password must be longer than 8 symbols"
        // }
    },
    token: {
        type: "String",
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true,
        default: "user"
    },


});

UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

UserSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

const User = mongoose.model("User", UserSchema);
module.exports = User;