const express = require("express")
const router = express.Router()
const controller = require("../controller/userController")

router.post("/user", controller.create)
router.post("/user/login", controller.login)
router.get("/user", controller.getAll)
router.delete("/user/:id", controller.deleteById)
router.patch("/user", controller.updatePassword)

module.exports = router