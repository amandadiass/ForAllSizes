const mongoose = require ("mongoose")

const commentarySchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,

    author: {
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

const commentary = mongoose.model("commentary", commentarySchema)

module.exports = commentary;