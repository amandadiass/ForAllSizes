const mongoose = require ("mongoose")

const commentSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,

    autor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "usuario"
    },

    text: {
        type: String, 
        required: true,
    },

    likes: {
        type: Number
    }

})

const comment = mongoose.model("comment", commentSchema)

module.exports = comment;