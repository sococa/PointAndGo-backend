const mongoose = require("mongoose");

const flagCommentSchema = new mongoose.Schema({
  original_comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  //id du commentaire signalé
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },

  //Auteur du commentaire
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  //Liste des signaleurs
  flag_senders: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      date: {
        type: Date,
      },
    },
  ],

  //Si le signalement est traité par l'admin
  resolved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("flagComment", flagCommentSchema);
