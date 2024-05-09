const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Flag: {
        type: String,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String, // Assuming the image path or URL will be stored as a string
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("user", userSchema);