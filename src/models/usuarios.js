const mongoose = require ("mongoose")

const usuarioSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,

    nome: {
        type: String,
        required: true
    },

    email: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true

    },

    dataNascimento: {
        type: Date 
    }

    //como diferenciar para fazer a de blogueira?? 

}, {timestamps: true})

const Usuario = mongoose.model("usuario", usuarioSchema)

module.exports = Usuario;