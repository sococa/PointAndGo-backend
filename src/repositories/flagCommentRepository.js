const mongoose = require("mongoose");
const FlagComment = require("../models/FlagComment");

class FlagCommentRepository {
  /**
   * Ajoute un commentaire signalé à la BDD
   * @param {Object} flagComment le signalement de l'utilisateur
   * @returns Le commentaire signalé créé
   */

  addFlag = async (flagComment) => {
    await flagComment.save();
    return flagComment;
  };

   /**
     * Met à jour un commentaire signalé à la BDD avec le nouveau signalement
     * @param {ObjectId} comment_id L'id du commentaire
     * @param {Array} flag_senders liste contenant l'utilisateur ayant fait le signalement ainsi que la date de celui-ci
     * @returns La confirmation de maj
     */
   updateFlag = async(original_comment_id, comment_id, author_id, flag_senders) => {
    return await FlagComment.findOneAndUpdate(
      { original_comment_id: original_comment_id, comment_id: comment_id, author_id: author_id,
        "flag_senders.user_id": {$nin: flag_senders.user_id}},
      { $push: {flag_senders: flag_senders } })
  }


  /**
   * Renvoie les commentaires signalés enregistrés
   * @returns Les commentaires signalés
   */
    getFlagComment = async () => {
      return FlagComment.find()
      //Ce populate est pour récupérer le message du commentaire signalé mais il ne fonctionne pas
      .populate({
        path: "original_comment_id",
        select:"commentHistory"
      })
      .populate({
        path: "author_id",
        // récupérer les infos suivantes du users...
        select: "firstname lastname",
      })
      .populate({
        path:"flag_senders.user_id",
        select:"firstname lastname"
      });
    }

  /**
  * Passe le signalement d'un commentaire en résolu dans la BDD
  * @param {ObjectId} comment_id L'id du commentaire
  * @returns La confirmation de mise à jour
  */
    resolveFlag = async (comment_id) => {
      return await FlagComment.updateOne({comment_id: comment_id}, {resolved: true});
     }
}

module.exports = FlagCommentRepository;
