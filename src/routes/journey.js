//Accés serveur
const express = require("express");

//Import du modéle CRS pour le fonctionnement des routes
const JourneyRepository = require("../repositories/journeyRepository")
const JourneyService = require("../services/journeyService")
const JourneyController = require('../controllers/journeyController')
const journeyApiController = require('../controllers/journeyApiController')

// Instances de classes
const _repository = new JourneyRepository();
const _service = new JourneyService(_repository);
const _controller = new JourneyController(_service);
const _ApiController = new journeyApiController();

const router = express.Router();

//Route pour la création d'un trajet
router.post("/journey/publish", _controller.createJourney);

//Route pour l'affichage de tout les trajets
router.get('/journeys/all', _controller.getAllJourneys);

//Route pour la recherche de trajets avec ou sans filtres de recherche
router.get('/journeys', _controller.getJourneyByFilters);

// Route pour récupèrer les infos du trajet via l'API
router.get("/journeys/API", _ApiController.getTravelInfo);

// Route pour récupérer toutes les informations du trajet, du conducteur et de la voiture
router.get('/journey/:id', _controller.getJourneyInfo);

// Route pour récupérer les 3 derniers trajets enregistrés
router.get('/lastpostedjourneys/', _controller.getLastThreeJourneys);

// Route pour vérifier s'il reste assez de places sur le trajet
router.get('/journey/availablecarseat/:id', _controller.checkCarSeatNumber)

// Route pour modifier les informations d'un trajet
router.patch("/journey/edit/:id", _controller.editJourney);

// Route pour annuler une réservation
router.patch("/journey/cancel/", _controller.cancelReservation);

// Route pour supprimer un trajet
router.delete("/journey/delete/:id", _controller.deleteJourney);

//! export de mes routes
module.exports = router;