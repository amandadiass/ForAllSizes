const publicationModel = require("../models/publication")
const userModel = require("../models/user")
const commentaryModel = require("../models/commentary")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const SECRET = process.env.SECRET

const getPublication = async (req, res) => {
    try {
        const { category, author } = req.query
        let publications = await publicationModel.find()
        console.log(publications)
        if (category)
            publications = publications.filter((p) => {
                return p.category == category
            })
        if (author)
            publications = publications.filter((p) => {
                return p.author == author
            })
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
            let authorId = new mongoose.Types.ObjectId(author);
            userModel.findById(authorId, (err, user) => {
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
            userModel.findOne({email: user.email}, (err, user1) => {
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
            userModel.findOne({email: user.email}, (err, user1) => {
                if (err) {
                    return res.status(403).send("User not found")
                }
                if (!user1.verified) {
                    return res.status(403).send("User has not permission to update publication")
                }
                const { id } = req.params
                const { author, banner, category, text } = req.body
                publicationModel.findById(id, (err, publication) => {
                    if (publication == null) {
                        return res.status(404).json({ message: "Publication not found" })
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

const createCommentary = async (req, res) => {
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
            userModel.findOne({email: user.email}, (err, user1) => {
                if (err) {
                    return res.status(403).send("User not found")
                }
                if (!user1.verified) {
                    return res.status(403).send("User has not permission to create publication")
                }
                const { id } = req.params
                const { text } = req.body
                publicationModel.findById(id, (err, publication) => {
                    if (publication == null) {
                        return res.status(404).json({ message: "Publication not found" })
                    }
                    
                    commentary = new commentaryModel({author: user1._id, text: text, likes: 0})
                    publication.comments.push(commentary)
                    publication.save((err, savedPublication) => {
                        commentary.save()
                        res.status(200).json(savedPublication)
                    })
                })
    
            })
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const likeCommentary = async (req, res) => {
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
            userModel.findOne({email: user.email}, (err, user1) => {
                if (err) {
                    return res.status(403).send("User not found")
                }
                if (!user1.verified) {
                    return res.status(403).send("User has not permission to delete commentary")
                }
                const { id, commentaryId } = req.params
                publicationModel.findById(id, (err, publication) => {
                    if (publication == null) {
                        return res.status(404).json({ message: "Commentary not found" })
                    }
                    
                    commentaryModel.findById(commentaryId, (err, commentary) => {
                        commentary.likes = commentary.likes + 1

                        commentary.save((err, savedcommentary) => {
                            res.status(200).json(savedcommentary)
                        })
                    })
                })    
            })
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteCommentary = async (req, res) => {
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
            userModel.findOne({email: user.email}, (err, user1) => {
                if (err) {
                    return res.status(403).send("User not found")
                }
                if (!user1.verified) {
                    return res.status(403).send("User has not permission to delete commentary")
                }
                const { id, commentaryId } = req.params
                publicationModel.findById(id, (err, publication) => {
                    if (publication == null) {
                        return res.status(404).json({ message: "Commentary not found" })
                    }             
                    const index = publication.comments.indexOf(commentaryId);
                    if (index > -1) 
                        publication.comments.splice(index, 1); // 2nd parameter means remove one item only
                    publication.save()
                    commentaryModel.findByIdAndDelete(commentaryId, () => {                        
                        res.status(200).send("Successful deleted commentary")                        
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
    updatePublicationById,
    createCommentary,
    likeCommentary,
    deleteCommentary
}