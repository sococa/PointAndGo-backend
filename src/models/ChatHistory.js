const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({

    // L'id unique de la room (id conversation + "-" + id trajet)
    id_journey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Journey",
        required: true
    },

    // La première personne du chat
    id_driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // La deuxième personne du chat
    id_passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    message: [
        {
            // La personne qui a envoyé le message
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },

            // La date d'envoie du message
            date: {
                type: Date,
            },

            // Le message
            text: {
                type: String,
            }
        }
    ]
});

module.exports = mongoose.model('ChatHistory', chatHistorySchema);