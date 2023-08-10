const express = require("express");
const CommentsController = require('../controllers/commentsController')
const _controller = new CommentsController();
const router = express.Router();

// Route pour poster un commentaire
router.post('/comments/post', _controller.postComment)

// Route pour modifier un commentaire
router.patch('/comments/edit/:id', _controller.editComment)

// Route pour récupérer les commentaires d'un trajet
router.get('/comments/get/:id', _controller.getComments)

// Route pour récupérer les commentaires d'un utilisateur
router.get('/comments/user/get/:id', _controller.getUserComments)

// Route pour récupérer les commentaires d'un utilisateur
router.patch('/comments/disable/:id', _controller.disableComment)

//Route pour obtenir la liste des commentaires concernant l'utilisateur à partir de son id
router.get("/comments/driver/:id", _controller.getCommentedUser);

module.exports = router;
