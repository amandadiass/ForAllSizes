const mongoose = require ("mongoose")

const publicationSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,

    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "usuario"
    },

    banner: {
        type: String        
    },

    category: {
        type: String,
        enum : ['publicity','education', 'personal'],
        default: 'personal',
        required: true
    },

    text: {
        type: String, 
        required: true,
    },

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }]
})

const publication = mongoose.model("publication", publicationSchema)

module.exports = publication;