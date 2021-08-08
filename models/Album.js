const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const idValidator = require("mongoose-id-validator");

const AlbumSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: "Artist",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        required: true,
        default: false
    }
});

AlbumSchema.plugin(idValidator, {
    message: "Bad id value for {PATH}"
});

const Album = mongoose.model("Album", AlbumSchema);
module.exports = Album;
