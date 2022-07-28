const controller = require("../controller/publicationController")
const express = require("express")

const router = express.Router()

router.get("/publication", controller.getPublication)
router.post("/publication", controller.createPublication)

router.get("/publication/:id", controller.getPublicationById)
router.delete("/publication/:id", controller.deletePublicationById)
router.put("/publication/:id", controller.updatePublicationById)

router.post("/publication/:id/commentary", controller.createCommentary)
router.patch("/publication/:id/commentary/:commentaryId", controller.likeCommentary)
router.delete("/publication/:id/commentary/:commentaryId", controller.deleteCommentary)


module.exports = router