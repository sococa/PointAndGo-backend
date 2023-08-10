//Importation du model de Journey pour son utilisation dans repository
const Journey = require("../models/Journey");

class JourneyRepository {
  /**
   * Récupère le trajet créé par le service et l'ajoute à la BDD.
   * @param {Journey} newJourney le trajet à ajouter à la BDD
   * @returns le trajet ajouté à la BDD
   */
  createJourney = async (newJourney) => {
    await newJourney.save();
    return newJourney;
  };

  /**
   * Modifie les informations d'un trajet
   * @param {Number} id L'id du trajet à modifier
   * @param {Object} infoToEdit Les nouvelles informations à modifier
   * @returns Le trajet après modifications
   */
  editJourney = async (id, infoToEdit) => {
    return await Journey.updateOne({ _id: id }, infoToEdit);
  };

   /**Renvoie tout les trajets en BDD
   * @returns la liste des trajets
   */
   getAllJourneys = async () => {
    return await Journey.find();
  }

  /**
   * Récupère le trajet à partir de son id
   * @param {ObjectId} id
   * @returns Les données du trajet à l'id correspondant
   */
  getJourneyById = async (journey_id) => {
    return await Journey.findById(journey_id);
  };

  /**
   * Récupère les trois trajets les plus récents de la BDD
   * @returns Les données des trajets
   */
  getLastThreeJourneys = async () => {
    return await Journey.find().sort({ _id: -1 }).limit(3).populate({
      path: "driver",
      // récupérer les infos suivantes du users...
      select: "firstname lastname avatar",
    });
  };

  /**
   * Récupère la liste des trajets filtrés
   * @returns La liste des trajets filtrés, triés par ordre croissant de Date et Heure de départ
   */
  getJourneyByFilters = async (filters) => {
    const journeys = await Journey.find(filters)
      .populate({
        path: "driver",
        // récupérer les infos suivantes du users...
        select: "firstname lastname email preferences_options rating",
      })
      .sort({ departure_date: 1 });
    return journeys;
  };

  /**
   * Récupère un trajet par son Id
   * @param {Number} journeyId L'id du trajet à rechercher
   * @returns Le trajet correspodant à l'Id
   */
  checkCarSeatNumber = async (journeyId) => {
    return await Journey.findById(journeyId);
  };

  /**
   * Récupère les trajets où l'utilisateur est inscrit en tant que passager
   * @param {ObjectId} id L'id de l'utilisateur
   * @returns Les trajets reservés par l'utilisateur
   */
  getPassengerJourneys = async (id) => {
    return await Journey.find({ passenger: { $in: id } });
  };
  /**
   * Récupère les trajets où l'utilisateur est inscrit en tant que conducteur
   * @param {ObjectId} id L'id de l'utilisateur
   * @returns Les trajets où l'utilisateur est un conducteur
   */
  getDriverJourneys = async (id) => {
    return await Journey.find({ driver: id });
  };

  /**
   * 
   * @param {ObjectId} id l'id du trajet
   * @returns confirmation de suppression
   */
  deleteJourney = async (id) => {
    return await Journey.deleteOne({ _id: id });
  }

  /**
   * Récupère la liste des trajets où l'utilisateur est un conducteur ou un passager
   * @param {ObjectId} userId L'id de l'utilisateur
   * @returns La liste des trajets où l'utilisateur est un conducteur ou un passager
   */
  getChatList = async (userId) => {
    return await Journey.find(
      { $or: [{ driver: userId }, { passenger: { $in: userId } }] }
    );
  }

}

module.exports = JourneyRepository;
