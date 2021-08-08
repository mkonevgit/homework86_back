const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const idValidator = require("mongoose-id-validator");


const TrackSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    trackNumber: {
        type: String,
        required: true
    },
    trackLink: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    album: {
        type: Schema.Types.ObjectId,
        ref: "Album",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        required: true,
        default: false
    }
});

TrackSchema.plugin(idValidator, {
    message: "Bad id value for {PATH}"
});

const Track = mongoose.model("Track", TrackSchema);
module.exports = Track;

