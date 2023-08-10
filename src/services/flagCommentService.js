const FlagComment = require("../models/FlagComment");
const FlagCommentRepository = require("../repositories/flagCommentRepository");

class CommentFlagService {
  _repository = new FlagCommentRepository();

      /**
     * Ajoute un commentaire signalé à la BDD
     * @param {ObjectId} comment_id L'id du commentaire
     * @param {ObjectId} author_id L'id de l'utilisateur ayant écrit le commentaire
     * @param {Array} flag_senders liste contenant l'utilisateur ayant fait le signalement ainsi que la date de celui-ci
     * @returns Un status 200 et le commentaire
     */

   addFlag = async (original_comment_id, comment_id, author_id, flag_senders) => {
     const newFlagComment = new FlagComment({ original_comment_id, comment_id, author_id, flag_senders });
     return await this._repository.addFlag(newFlagComment);
   };

   /**
     * Met à jour un commentaire signalé à la BDD avec le nouveau signalement
     * @param {ObjectId} comment_id L'id du commentaire
     * @param {Array} flag_senders liste contenant l'utilisateur ayant fait le signalement ainsi que la date de celui-ci
     * @returns Un status 200 et le commentaire
     */
  updateFlag = async(original_comment_id, comment_id, author_id, flag_senders) => {
    return await this._repository.updateFlag(original_comment_id, comment_id, author_id, flag_senders);
  }

  /**
   * Renvoie les commentaires signalés enregistrés
   * @returns Les commentaires signalés
   */
  getFlagComment = async () => {
    return this._repository.getFlagComment();
  }


   /**
   * Passe le signalement d'un commentaire en résolu dans la BDD
   * @param {ObjectId} comment_id L'id du commentaire
   * @returns La confirmation de mise à jour
   */
  resolveFlag = async (comment_id) => {
   return await this._repository.resolveFlag(comment_id);
  }
}

module.exports = CommentFlagService;
