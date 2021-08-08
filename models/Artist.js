const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    info: {
        type: String,
        required: true
    },
    published: {
        type: Boolean,
        required: true,
        default: false,
        validate: {
            validator: async value => {
                if (value.length < 8) return false;
            },
            message: "Password must be longer than 8 symbols"
        }
    },

});

const Artist = mongoose.model("Artist", ArtistSchema);
module.exports = Artist;




