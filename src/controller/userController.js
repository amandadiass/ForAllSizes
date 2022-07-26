const userModel = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET

const create = (req, res) => {
    const {name, email, password, verified} = req.body
    const hashPassword = bcrypt.hashSync(password, 4)
    const user = new userModel({ name, email, password:hashPassword, verified})
    user.save(function (error) {
        if (error) {
            res.status(500).json({ message: error.message })
        } else {
            res.status(201).json(user)
        }
    })
}

const getAll = (req, res) => {
    userModel.find(function (err, user) {
        if (err) {
            res.status(500).json({ message: err.message })
        }
        res.status(200).json(user)
    })
}

const updatePassword = async (req, res) => {
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
                const { password } = req.body
                user1.password = bcrypt.hashSync(password, 4) || user1.password
                user1.save((err, u) => {
                    res.status(200).json(u)
                })  
                  
            })
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteById = async (req, res) => {
    try {
        const { id } = req.params
        await userModel.findByIdAndDelete(id)
        res.status(200).json({ message: "Deleted user" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

const login = (req, res) => {
    userModel.findOne({ email: req.body.email }, function (error, user) {
        if (!user) {
            return res.status(404).send("Email is not registered")
        }

        const validPassword = req.body.password == user.password

        if (!validPassword) {
            return res.status(403).send("Invalid password")
        }

        const token = jwt.sign({ email: req.body.email }, SECRET)
        res.status(200).json(token)
    })
}

module.exports = {
    create,
    getAll,
    deleteById,
    login,
    updatePassword
}