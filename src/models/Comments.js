const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

    // Le trajet associé
    journey_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Journey",
        required: true
    },

    // L'utilisateur qui poste le commentaire
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    user_firstname: {
        type: String,
    },

    user_lastname: {
        type: String,
    },

    commentHistory: [
        {
            // La date à laquelle le commentaire est posté
            post_date: {
                required: true,
                type: Date
            },

            // La date à laquelle le commentaire a été modifié
            edit_date: {
                type: Date
            },

            // Un tableau qui contient tous les commentaires
            message: {
                type: String,
                minLength: 1,
                maxLength: 300
            },

            // Si le commentaire a été modifié
            edited: {
                type: Boolean,
                default: false
            },
        }
    ],
    // Si le commentaire est signalé par un utilisateur, pour qu'il soit traité par un admin
    is_flagged:{
        type: Boolean,
        default: false
    },
    // Si le commentaire est désactivé par un admin ou par l'utilisateur, pour ne plus l'afficher
    disabled: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Comment', commentSchema);
