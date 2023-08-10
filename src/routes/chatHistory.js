const express = require("express");
const chatHistoryController = require('../controllers/chatHistoryController')
const _controller = new chatHistoryController();
const router = express.Router();

// Route pour mettre à jour l'historique d'une conversation
router.patch("/updatehistory/:id", _controller.updateHistory);

// Route pour récupérer l'historique d'une conversation si elle existe et la créer sinon
router.post('/getconversation', _controller.getOrCreateHistory)

module.exports = router;
