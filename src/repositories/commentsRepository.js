const mongoose = require("mongoose");
const Comment = require('../models/Comments')

class CommentsRepository {

    /**
     * Ajoute un commentaire à la BDD
     * @param {Comment} comment Le commentaire de l'utilisateur
     * @returns Le commentaire créé
     */
    postComment = async (comment) => {
        await comment.save();
        return comment;
    }

    /**
     * Met à jour la l'historique des commentaires dans la BDD
     * @param {ObjectId} commentId L'id du commentaire
     * @param {Object} newCommentHistory Le nouveau tableau contenant les commentaires
     * @returns Un status 200
     */
    editComment = async (commentId, newCommentHistory) => {

        return await Comment.findOneAndUpdate(
            { _id: commentId },
            { $push: { commentHistory: newCommentHistory } }
        );
    }

    /**
     * Met à jour un commentaire dans la BDD
     * @param {ObjectId} comment_id L'id du commentaire
     * @param {Object} newCommentHistory Le nouveau tableau contenant les commentaires
     * @returns Un status 200
     */
    setFlagComment = async (comment_id) => {
        return await Comment.findOneAndUpdate({ _id: comment_id} ,{is_flagged: true});
    }

    /**
     * Rend anonyme les commentaires d'un utilisateur supprimé
     * @param {ObjectId} id L'id de l'utilisateur
     * @returns La confirmation d'anonymisation
     */
    anonymizeDeletedUserComment = async (id) => {
        return await Comment.updateMany(
            { user_id: id}, { user_firstname: "Utilisateur", user_lastname: "Anonyme" }
            );
    }

    /**
     * Récupère la liste des commentaires pour un trajet
     * @param {ObjectId} journeyId 
     * @returns La liste des commentaires correspondants au trajet
     */
    getComments = async (journeyId) => {
        return await Comment.find({ journey_id: journeyId })
    }

    /**
     * Récupère la liste des commentaires pour un utilisateur
     * @param {ObjectId} userId L'id de l'utilisateur
     * @returns La liste des commentaires correspondants à l'utilisateur
     */
    getUserComments = async (userId) => {
        return await Comment.find({ user_id: userId });
    }

    /**
     * Active ou désactive l'affichage du commentaire sélectionné
     * @param {ObjectId} commentId L'id du commentaire
     * @returns Confirmation de la maj
     */
         disableComment = async (commentId) => {
            return await Comment.updateOne({_id: commentId}, [ { "$set": { "disabled": { "$eq": [false, "$disabled"] } } } ]);
        }
}

module.exports = CommentsRepository;
