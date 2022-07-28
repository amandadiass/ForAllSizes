const controller = require("../controller/publicationController")
const express = require("express")

const router = express.Router()

router.get("/publication", controller.getPublication)
router.post("/publication", controller.createPublication)

router.get("/publication/:id", controller.getPublicationById)
router.delete("/publication/:id", controller.deletePublicationById)
router.put("/publication/:id", controller.updatePublicationById)

// router.post("/publication/:id/comment", controller.createComment)
// router.patch("/publication/:id/comment/:id", controller.likeComment)
// router.delete("/publication/:id/comment/:id", controller.deleteComment)


module.exports = router