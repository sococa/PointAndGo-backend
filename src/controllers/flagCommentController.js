const FlagCommentService = require("../services/flagCommentService");
const CommentsService = require("../services/commentsService");

class FlagCommentController {
  _service = new FlagCommentService();
  _commentsService = new CommentsService();

  /**
   * Récupère les informations de la requête et appelle la méthode flagComment() du service
   */
  flagComment = async (req, res) => {
    try {

      const { original_comment_id, comment_id, author_id, flag_senders } = req.body;
      
      if (req.body.is_flagged) {
        const updatedFlagComment = await this._service.updateFlag(original_comment_id, comment_id, author_id, flag_senders);
        res.status(200).send(updatedFlagComment);
      } else {
        const newFlagComment = await this._service.addFlag(original_comment_id, comment_id, author_id, flag_senders);
        await this._commentsService.setFlagComment(original_comment_id);
        res.status(200).send(newFlagComment);
      }

    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(error);
    }
  };

  /**
   * Récupère les informations de la requête et appelle la méthode getFlagComment() du service
   */
  getFlagComment = async (req, res) => {
    try{
      const flaggedComments = await this._service.getFlagComment();
      res.status(200).send(flaggedComments);
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(error);
    }
  }

    /**
   * Récupère les informations de la requête et appelle la méthode resolveFlag() du service
   */
  resolveFlag = async (req, res) => {
    try{
      const comment_id = req.params.id;
      const resolvedFlag = await this._service.resolveFlag(comment_id);
      res.status(200).send(resolvedFlag);
    } catch (error) {
      res.status(400).json({ message: error.message });
      console.log(error);
    }
  }
}

module.exports = FlagCommentController;
