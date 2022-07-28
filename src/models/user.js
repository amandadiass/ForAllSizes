const mongoose = require ("mongoose")

const userSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,

    name: {
        type: String,
        required: true
    },

    email: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true

    },

    password: {
        type: String, 
        required: true,
    },

    verified: {
        type: Boolean
    }

}, {timestamps: true})

const user = mongoose.model("user", userSchema)

module.exports = user;