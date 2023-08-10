const Comment = require("../models/Comments");
const CommentsRepository = require("../repositories/commentsRepository");
const UserRepository = require("../repositories/userRepository");
const JourneyRepository = require("../repositories/journeyRepository");

class CommentsService {
  _repository = new CommentsRepository();
  _userRepository = new UserRepository();
  _journeyRepository = new JourneyRepository();

  /**
   * Crée un nouveau commentaire et appelle la méthode postComment() du Repo
   * @param {ObjectId} journey_id
   * @param {ObjectId} user_id
   * @param {String} message
   * @returns Le commentaire créé
   */
  postComment = async (journey_id, user_id, message, anonymous) => {
    const my_regex =
      /^(?!.*show\s+dbs|use\s+\w+|db\s*|show\s+collections|<([a-z]+\b[^>]*)>)(?:[\p{L}\d\s!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]+|(db\.(?:dropDatabase|find|update|insert|delete)\s\([^)]+\))|.*\d+(?:\.\d{0,2})?\s*(?:€|\w+).*)$/u;
    if (!message.match(my_regex)) {
      throw "Le message contient des mots interdits";
    } else {
      const post_date = new Date();

      const newCommentHistory = {
        post_date: post_date,
        message: message,
      };

      let user_firstname = "";
      let user_lastname = "";

      const userInfo = await this._userRepository.getUserById(user_id);

      //Rend le commentaire anonyme si l'utilisateur a coché la case correspondante
      if (anonymous) {
        user_firstname = "Utilisateur";
        user_lastname = "anonyme";
      } else {
        user_firstname = userInfo.firstname;
        user_lastname = userInfo.lastname;
      }

      const comment = new Comment({
        journey_id,
        user_id,
        user_firstname,
        user_lastname,
      });

      comment.commentHistory.push(newCommentHistory);

      const newComment = await this._repository.postComment(comment);

      return newComment;
    }
  };

  /**
   * Ajoute le nouveau commentaire à la liste et appelle la méthode editComment() du Repo
   * @param {ObjectId} commentId L'id du commentaire
   * @param {String} oldMessage Le message précédent (avant modifications)
   * @param {Boolean} editedMessage Le nouveau message
   * @returns Un status 200
   */
  editComment = async (commentId, oldMessage, editedMessage) => {
    const my_regex =
      /^(?!.*show\s+dbs|use\s+\w+|db\s*|show\s+collections|<([a-z]+\b[^>]*)>)(?:[\p{L}\d\s!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]+|(db\.(?:dropDatabase|find|update|insert|delete)\s\([^)]+\))|.*\d+(?:\.\d{0,2})?\s*(?:€|\w+).*)$/u;

    if (!editedMessage.match(my_regex)) {
      throw "Le message contient des mots interdits";
    } else {
      const edition_date = new Date();

      // Création d'un nouvel objet pour le nouveau message (le message édité)
      const newCommentHistory = {
        post_date: oldMessage.commentHistory[0].post_date, // Pour conserver la post_date
        edit_date: edition_date,
        message: editedMessage,
        edited: true,
      };

      // Ajout du nouvel objet dans le tableau (historique) de commentaires
      oldMessage.commentHistory.push(newCommentHistory);

      const editedComment = await this._repository.editComment(
        commentId,
        newCommentHistory
      );

      return editedComment;
    }
  };

  /**
   * Rend anonyme les commentaires d'un utilisateur supprimé
   * @param {ObjectId} id L'id de l'utilisateur
   * @returns La confirmation d'anonymisation
   */
  anonymizeDeletedUserComment = async (id) => {
    return await this._repository.anonymizeDeletedUserComment(id);
  };

  /**
   * Récupère la liste des commentaires pour un trajet
   * @param {ObjectId} journeyId L'id du trajet
   * @returns La liste des commentaires correspondants au trajet
   */
  getComments = async (journeyId) => {
    const commentList = await this._repository.getComments(journeyId);

    const comments = [];

    let index = 0;

    // Création d'un objet pour chaque utilisateur qui a commenté le trajet
    for (const comment of commentList) {
      const newCommentaire = {
        original_comment_id: comment._id,
        //commentId: commentList[index]._id, // Pour stocker l'id du commentaire et la récupérer en front pour la modification
        journey_id: comment.journey_id,
        user_id: comment.user_id,
        user_firstname: comment.user_firstname,
        user_lastname: comment.user_lastname,
        disabled: comment.disabled,
        is_flagged: comment.is_flagged,
        commentHistory: [],
      };

      // Pour ne récupérer que le dernier commentaire dans l'historique (la dernière modification)
      newCommentaire.commentHistory.push(
        comment.commentHistory[comment.commentHistory.length - 1]
      );
      newCommentaire.commentId = newCommentaire.commentHistory[0]._id;

      // Ajout du dernier commentaire dans le tableau de l'objet
      comments.push(newCommentaire);

      index++;
    }
    return comments;
  };

  /**
   * Récupère la liste des commentaires pour un utilisateur
   * @param {ObjectId} userId L'id de l'utilisateur
   * @returns La liste des commentaires correspondants à l'utilisateur
   */
  getUserComments = async (userId) => {
    return await this._repository.getUserComments(userId);
  };

  /**
   * Récupère la liste des commentaires concernant un utilisateur
   * @param {ObjectId} userId L'id de l'utilisateur
   * @returns La liste des commentaires concernant cet utilisateur
   */
  getCommentedUser = async (userId) => {
    const journeyList = await this._journeyRepository.getDriverJourneys(userId);
    const commentsList = [];

      for (let journey of journeyList) {
        let comment = await this.getComments(journey._id.toString());
        console.log(comment);
        if(comment.length != 0) commentsList.push(comment);
      }

      return commentsList;
  }

  /**
   * Marque un commentaire comme signalé
   * @param {ObjectId} comment_id L'id de l'utilisateur
   * @returns La confirmation de signalement
   */
  setFlagComment = async (comment_id) => {
    return await this._repository.setFlagComment(comment_id);
}

  /**
   * Active ou désactive l'affichage du commentaire sélectionné
   * @param {ObjectId} commentId L'id du commentaire
   * @returns Confirmation de la maj
   */
  disableComment = async (commentId) => {
    return await this._repository.disableComment(commentId);
  };
}

module.exports = CommentsService;
