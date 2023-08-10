const CommentsService = require('../services/commentsService')

class CommentsController {

    _service = new CommentsService();

    /**
     * Récupère les informations de la requête et appelle la méthode postComment() du service
     */
    postComment = async (req, res) => {
        try {
            const { journey_id, user_id, message, anonymous } = req.body;

            const newComment = await this._service.postComment(journey_id, user_id, message, anonymous);

            res.status(200).send(newComment);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }

    /**
     * Récupère les informations de la requête et appelle la méthode editComment() du service
     */
    editComment = async (req, res) => {
        try {
            const commentId = req.params.id;

            const { oldMessage, editedMessage } = req.body;

            const editedComment = await this._service.editComment(commentId, oldMessage, editedMessage);

            res.status(200).send(editedComment);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }

    /**
    * Récupère les informations de la requête et appelle la méthode getComments() du service
    */
    getComments = async (req, res) => {
        try {
            const journeyId = req.params.id;

            const commentList = await this._service.getComments(journeyId);

            res.status(200).send(commentList);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }

    /**
    * Récupère les informations de la requête et appelle la méthode getUserComments() du service
    */
        getUserComments = async (req, res) => {
            try {
                const userId = req.params.id;
    
                const userCommentsList = await this._service.getUserComments(userId);
    
                res.status(200).send(userCommentsList);
            } catch (error) {
                res.status(400).json({ message: error.message });
                console.log(error)
            }
        }

        /**
        * Récupère les informations de la requête et appelle la méthode getCommentedUser() du service
        */
        getCommentedUser = async (req, res) => {
            try {
                const driverId = req.params.id;
    
                const driverCommentsList = await this._service.getCommentedUser(driverId);
    
                res.status(200).send(driverCommentsList);
            } catch (error) {
                res.status(400).json({ message: error.message });
                console.log(error)
            }
        }

    /**
    * Récupère les informations de la requête et appelle la méthode disableComment() du service
    */
        disableComment = async (req,res) => {
            try {
                const commentId = req.params.id;
                const disabledComment = await this._service.disableComment(commentId);

                res.status(200).send(disabledComment);
            } catch (error) {
                res.status(400).json({ message: error.message });
                console.log(error)
            }
        }

}


module.exports = CommentsController;