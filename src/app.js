require('dotenv-safe').config();
const express = require("express")
const cors = require ("cors")
const db = require('./database/mongoConfig')
const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, rest) => {
    rest.status(200).send({

        title: "Reprograma -> For All Sizes - Projeto Final",
        version: "1.0.0",
        mensagem: "Olá, mudar aqui."

    }

    )
} )

db.connect()

module.exports = app; 