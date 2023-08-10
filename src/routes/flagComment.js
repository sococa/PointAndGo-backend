const express = require("express");
const FlagCommentController = require("../controllers/flagCommentController");
const _controller = new FlagCommentController();
const router = express.Router();

// Route pour signaler un commentaire
router.patch("/flagComment/patch", _controller.flagComment);

// Route pour récupérer les commentaires signalés
router.get("/flagComment/get/", _controller.getFlagComment);

// Route pour passer un signalement en résolu
router.patch("/flagComment/resolve/:id", _controller.resolveFlag);

module.exports = router;
