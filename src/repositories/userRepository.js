// Importation de la librairie mongoose pour les traitements de données sur la BDD
const mongoose = require("mongoose");
const Users = require("../models/User");

class UserRepository {
  /**
   * Récupère l'utilisateur créé par le service et l'ajoute à la BDD.
   * @param {User} newUser L'utilisateur à ajouter à la BDD
   * @returns L'utilisateur ajouté à la BDD
   */
  createUser = async (newUser) => {

    await newUser.save();
    return newUser;
  };

  /**
   * Modifie les informations d'un utilisateur
   * @param {Number} id L'id de l'utilisateur à modifier
   * @param {Object} infoToEdit Les nouvelles informations à modifier
   * @returns L'utilisateur après modifications
   */
  editUser = async (id, infoToEdit) => {
    return await Users.updateOne({ _id: id }, infoToEdit);
  };

  /**Renvoie tout les utilisateurs en BDD
   * @returns la liste des utilisateurs
   */
  getAllUsers = async () => {
    return await Users.find({});
  }

  /**
   * Récupère toutes les infos de l'utilisateur à partir de son id via le repository
   * @param {Number} id
   * @returns Les données du trajet à l'id correspondant
   */
  getUserById = async (id) => {
    return await Users.findById(
      id,
      "_id firstname lastname birthday email avatar free_points pay_points is_admin is_activated handicap preferences_options rating marked_driver marked_journey"
    );
  };

  /**
   * Récupère uniquement certaines infos de l'utilisateur à partir de son id via le repository
   * @param {Number} id
   * @returns Les données du trajet à l'id correspondant
   */
  journey_getUserById = async (id) => {
    return await Users.findById(id, "_id firstname lastname avatar rating"); //Ne renvoie que les attributs demandés dans la chaine
  };

  /**
  * Récupère un utilisateur en fonction de son email
  * @param {String} userEmail 
  * @returns L'utilisateur correspondant à l'email
  */
  getUserByEmail = async (userEmail) => {
    return await Users.findOne({ email: userEmail });
  }

  /**
  * Ajoute un conducteur dans la liste des favoris conducteurs de l'utilisateur
  * @param {ObjectId} id L'id de l'utilisateur
  * @param {ObjectId} markedId L'id du conducteur à ajouter dans les favoris
  * @returns Les infos mises à jour de l'utilisateur si l'ajout est fait, rien sinon
  */
  addMarkUser = async (id, markedId) => {
    return await Users.findOneAndUpdate(
      { _id: id, marked_driver: { $nin: markedId } },
      { $push: { marked_driver: markedId } }
    )
  };

  /**
  * Retire un conducteur de la liste des favoris conducteurs de l'utilisateur
  * @param {ObjectId} id L'id de l'utilisateur
  * @param {ObjectId} unmarkedId L'id du conducteur à retirer des favoris
  * @returns Rien même si la suppresion est effective
  */
  deleteMarkUser = async (id, unmarkedId) => {
    return await Users.findOneAndUpdate(
      { _id: id, marked_driver: { $in: unmarkedId } },
      { $pull: { marked_driver: unmarkedId } }
    )
  }

    /**
    * Retire un conducteur des favoris de tout les utilisateurs concernés
    * @param {ObjectId} userId
    * @returns Confirmation de mise à jour
    */
      deleteUserMarks = async (userId) => {
        return await Users.updateMany(
          { marked_driver: { $in: userId } },
          { $pull: { marked_driver: userId } }
          )
    }

  /**
* Ajoute un trajet dans la liste des favoris conducteurs de l'utilisateur
* @param {ObjectId} id L'id de l'utilisateur
* @param {ObjectId} markedId L'id du trajet à ajouter dans les favoris
* @returns Les infos mises à jour de l'utilisateur si l'ajout est fait, rien sinon
*/
  addMarkJourney = async (id, markedId) => {
    return await Users.findOneAndUpdate(
      { _id: id, marked_journey: { $nin: markedId } },
      { $push: { marked_journey: markedId } }
    )
  };

  /**
  * Retire un trajet de la liste des favoris conducteurs de l'utilisateur
  * @param {ObjectId} id L'id de l'utilisateur
  * @param {ObjectId} unmarkedId L'id du trajet à retirer des favoris
  * @returns Rien même si la suppresion est effective
  */
  deleteMarkJourney = async (id, unmarkedId) => {
    return await Users.findOneAndUpdate(
      { _id: id, marked_journey: { $in: unmarkedId } },
      { $pull: { marked_journey: unmarkedId } }
    )
  }

    /**
    * Retire un trajet des favoris  de tout les utilisateurs concernés
    * @param {ObjectId} journeyId
    * @returns Confirmation de mise à jour
    */
      deleteJourneyMarks = async (journeyId) => {
        return await Users.updateMany(
          { marked_journey: { $in: journeyId } },
          { $pull: { marked_journey: journeyId } }
          )
    }

  /**
   * Ajoute ou modifie une note pour un conducteur
   * @param {ObjectId} id_driver L'id du conducteur à noter
   * @param {ObjectId} id_user L'id de l'utilisateur qui fournit la note
   * @param {Number} rating La note
   * @returns Un status 200
   */
  rateDriver = async (id_driver, id_user, rating) => {
    const UserFound = await Users.find({ "_id": id_driver });

    // Supprime la note correspondant à l'id user si elle existe (en cas de modification)
    UserFound[0].rating = UserFound[0].rating.filter((rating) => {
      return rating.id_user != id_user
    })

    // Ajoute la nouvelle note
    UserFound[0].rating.push({
      id_user: id_user,
      rating: rating
    })

    // Update l'utilisateur dans la BDD
    return await Users.updateOne(
      { _id: id_driver },
      { $set: { rating: UserFound[0].rating } }
    );
  }
}

module.exports = UserRepository;
