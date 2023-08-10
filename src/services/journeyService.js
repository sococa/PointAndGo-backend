//Import des models et du repository pour leur utilisation dans les fonctions
const Journey = require('../models/Journey');
const User = require('../models/User');
const JourneyRepository = require("../repositories/journeyRepository");
const UserRepository = require("../repositories/userRepository");
const UserService = require("../services/userService");

//Import uid2 pour la génération de chaine de caractéres
const uid = require('uid2');

class JourneyService {
    userRepository = new UserRepository();
    JourneyRepository =new JourneyRepository();

    // Crée une instance de repository, pour pouvoir utiliser ses méthodes
    constructor(repository) {
        this._repository = repository;
    }

    /**
     * Crée un nouveau trajet avec les informations récupérées par le controller,
     * et appelle la méthode createJourney() du repository.
     * @param {ObjectId} driver Le conducteur du trajet
     * @param {Number} car_seats Le nombre de place possibles pour le trajet
     * @param {Number} small_luggage Le nombre de petits bagages maximum pour le trajet
     * @param {Number} big_luggage Le nombre de gros bagages maximum pour le trajet
     * @param {Number} route_price Le prix à payer pour le trajet en points
     * @param {Object} departure Les informations du lieu de départ
     * @param {Object} arrival Les informations du lieu d'arrivée
     * @param {String} d_latitude Latitude du lieu de départ
     * @param {String} d_longitude Longitude du lieu de départ
     * @param {String} d_adress Adresse du lieu de départ
     * @param {String} d_zip_code Code Postal du lieu de départ
     * @param {String} d_city Ville du lieu de départ
     * @param {String} a_latitude Latitude du lieu d'arrivée
     * @param {String} a_longitude Longitude du lieu d'arrivée
     * @param {String} a_adress Adresse du lieu d'arrivée
     * @param {String} a_zip_code Code Postal du lieu d'arrivée
     * @param {String} a_city Ville du lieu d'arrivée
     * @param {String} departure_date Date de départ du trajet converti au format UTC
     * @param {Boolean} prm_compatible Prise en charge ou non des PMR
     * @returns le trajet ajouté à la BDD
     */
    createJourney = async (driver, car_seats, small_luggage, big_luggage, departure, arrival, departure_date, preferences_options, prm_compatible, route_price) => {

        //Crétation d'un numéro de réservation avec un générateur de String
        const booking_number = uid(16);

        //Conversion de la date de départ du type String au type Date
        departure_date = new Date(departure_date);

        // Crée un trajet grâce au model
        const newJourney = new Journey({ driver, car_seats, small_luggage, big_luggage, booking_number, route_price, departure, arrival, departure_date, preferences_options, prm_compatible });
        const journeyCreated = this._repository.createJourney(newJourney);

        return journeyCreated;
    }

    /**
     * Modifie les informations d'un trajet
     * @param {Number} id L'id du trajet à modifier
     * @param {Object} infoToEdit Les nouvelles informations à modifier
     * @returns Le trajet après modifications
     */
    editJourney = async (id, infoToEdit) => {
        const journeyEdited = this._repository.editJourney(id, infoToEdit);
        return journeyEdited;
    }

    /**Renvoie tout les trajets en BDD
    * @returns la liste des trajets
    */
        getAllJourneys = async() => {
            return await this._repository.getAllJourneys();
        }

    /**
     * Récupère la liste des trajets selon les filtres appliqués
     * @param {Object} filters Les filtres à appliquer
     * @param {Date} departureDate La date de départ sélectionnée
     * @param {Number} car_seats Le nombre de places disponibles dans le trajet
     * @returns La liste des trajets filtrés
     */
    getJourneyByFilters = async (filters, departureDate, car_seats) => {
        // Récupère la liste des trajets en fonction des filtres
        let journeysList = await this._repository.getJourneyByFilters(filters);

        // Filtre la liste pour récupérer seulement les trajets correspondants à la date voulue
        // Le '.toString().slice(0,15)' est nécessaire pour filter par date sans prendre l'heure en compte
        journeysList = journeysList.filter(journey => {
            return journey.departure_date.toString().slice(0, 15) == departureDate.toString().slice(0, 15);
        });

        //Renvoie les trajets dont le nombre de places disponibles est
        //Supérieur ou égal à celui du filtre car_seats
        journeysList = journeysList.filter(journey => {
            const car_seats_filter = parseInt(car_seats) + journey.passenger.length;
            return journey.car_seats >= car_seats_filter;
        });
        return journeysList;
    }

    /**
    * Récupère le trajet à partir de son id via le repository
    * @param {ObjectId} id
    * @returns Les données du trajet à l'id correspondant
    */
    getJourneyById = async (journey_id) => {

        return await this._repository.getJourneyById(journey_id);
    }

    /**
    * Récupère les trois trajets les plus récents de la BDD
    * @returns Les données des trajets
    */
    getLastThreeJourneys = async () => {
        const journeyList = await this._repository.getLastThreeJourneys();
        return journeyList;
    }

    /**
     * Renvoie le nombre de place disponibles dans le trajet souhaité
     * @param {Number} journeyId L'id du trajet à rechercher
     * @returns Le nombre de places encore disponibles dans le trajet
     */
    checkCarSeatNumber = async (journeyId) => {
        const journey = await this._repository.checkCarSeatNumber(journeyId);

        const availableSeats = journey.car_seats - journey.passenger.length;

        return availableSeats;
    }

     /**
   * Récupère les trajets où l'utilisateur est inscrit en tant que passager
   * @param {ObjectId} id L'id de l'utilisateur
   * @returns Les trajets reservés par l'utilisateur
   */
    getPassengerJourneys =  async (id) =>  {
        const passengerJourneys = await this.JourneyRepository.getPassengerJourneys(id);
        return passengerJourneys;
       }

        /**
   * Récupère les trajets où l'utilisateur est inscrit en tant que conducteur
   * @param {ObjectId} id L'id de l'utilisateur
   * @returns Les trajets où l'utilisateur est un conducteur
   */
    getDriverJourneys =  async (id) =>  {
        const driverJourneys = await this.JourneyRepository.getDriverJourneys(id);
        return driverJourneys;
    }

    /**
     * Supprime le trajet ciblé
     * @param {ObjectId} id id du trajet
     * @returns confirmation de suppression
     */
    deleteJourney = async (id) => {
        const journey = await this.JourneyRepository.deleteJourney(id);
        return journey;
    }
}

module.exports = JourneyService;