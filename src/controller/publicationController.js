const publicationModel = require("../models/publication")
const userModel = require("../models/user")
const commentModel = require("../models/comment")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const SECRET = process.env.SECRET

const getPublication = async (req, res) => {
    try {
        const { category, author } = req.query
        const publications = await publicationModel.find({category: category, author: author})
        res.status(200).json(publications)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

const createPublication = async (req, res) => {
    try {
        const authHeader = req.get('authorization')

        if (!authHeader) {
            return res.status(401).json({ message: "User not logged in" })
        }
        const token = authHeader.split(" ")[1]
        await jwt.verify(token, SECRET, async function (erro) {
            if (erro) {
                return res.status(403).send("Not authorized")
            }
            const { author, banner, category, text } = req.body

            const newPublication = new publicationModel({
                author, banner, category, text
            })
            console.log(author)
            let authorId = new mongoose.Types.ObjectId(author);
            userModel.findById(authorId, (err, user) => {
                console.log(user.name)
                if (err) {
                    return res.status(403).send("User not found")
                }
                if (!user.verified) {
                    return res.status(403).send("User has not permission to create publication")
                }
            })

            const savedMemory = await newPublication.save()
            res.status(201).json({ message: "Publication created", savedMemory })
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getPublicationById = async (req, res) => {
    try {
        const { id } = req.params
        const publication = await publicationModel.findById(id)
        if (publication == null) {
            return res.status(404).json({ message: "Invalid ID" })
        }
        res.status(200).json(publication)      
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deletePublicationById = async (req, res) => {
    try {
        const authHeader = req.get('authorization')

        if (!authHeader) {
            return res.status(401).json({ message: "User not logged in" })
        }
        const token = authHeader.split(" ")[1]
        decoded = await jwt.verify(token, SECRET, async function (err, user) {
            if (err) {
                return res.status(403).send("Not authorized")
            } 
            console.log(user.email)     
            userModel.findOne({email: user.email}, (err, user1) => {
                console.log(user1.name)
                if (err) {
                    return res.status(403).send("User not found")
                }
                if (!user1.verified) {
                    return res.status(403).send("User has not permission to delete publication")
                }
                const { id } = req.params
                publicationModel.findByIdAndDelete(id)
                res.status(200).json({ message: "Deleted publication" })
            })
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updatePublicationById = async (req, res) => {
    try {
        const authHeader = req.get('authorization')

        if (!authHeader) {
            return res.status(401).json({ message: "User not logged in" })
        }
        const token = authHeader.split(" ")[1]
        decoded = await jwt.verify(token, SECRET, async function (err, user) {
            if (err) {
                return res.status(403).send("Not authorized")
            } 
            console.log(user.email)     
            userModel.findOne({email: user.email}, (err, user1) => {
                console.log(user1.name)
                if (err) {
                    return res.status(403).send("User not found")
                }
                if (!user1.verified) {
                    return res.status(403).send("User has not permission to delete publication")
                }
                const { id } = req.params
                const { author, banner, category, text } = req.body
                publicationModel.findById(id, (err, publication) => {
                    if (publication == null) {
                        return res.status(404).json({ message: "id inválido!" })
                    }
        
                    publication.author = author || publication.author
                    publication.banner = banner || publication.banner
                    publication.category = category || publication.category
                    publication.text = text || publication.text
        
                    publication.save((err, savedPublication) => {
                        res.status(200).json(savedPublication)
                    })
                })
    
            })
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getPublication,
    createPublication,
    getPublicationById,
    deletePublicationById,
    updatePublicationById
}