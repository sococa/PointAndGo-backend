const UserService = require('../services/userService')
const CarService = require('../services/carService')
const EmailService = require('../services/emailService')

class JourneyController {

    // Crée une instance de service, pour pouvoir utiliser ses méthodes
    _userService = new UserService();
    _carService = new CarService();
    _emailService = new EmailService();

    constructor(service) {
        this._service = service;
    }

    /**
     * Récupère les informations de la requête et appelle la méthode createUser() du service.
     * Renvois un status 200 en cas de succès ou un status 400 en cas d'erreur.
     */
    createJourney = async (req, res) => {
        try {
            //Récupération des informations contenues dans la requête
            const driver = req.body.driver;
            const car_seats = req.body.car_seats;
            const small_luggage = req.body.small_luggage;
            const big_luggage = req.body.big_luggage;
            const departure = req.body.departure;
            const arrival = req.body.arrival;
            const departure_date = req.body.departure_date;
            const preferences_options = req.body.preferences_options;
            const prm_compatible = req.body.prm_compatible;
            const route_price = req.body.route_price;

            //Création du trajet à partir des informations reçues
            const newJourney = await this._service.createJourney(driver, car_seats, small_luggage, big_luggage, departure, arrival, departure_date, preferences_options, prm_compatible, route_price)

            res.status(200).send(newJourney);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }//TEST_DONE
    }//TEST_DONE

    /**
   * Récupère l'id du trajet à modifier dans les paramètres de la requête,
   * récupère les infos à modifier dans le body et appelle la méthode editJourney() du service
   */
    editJourney = async (req, res) => {
        const id = req.params.id;
        const infoToEdit = req.body;
        try {
            const journeyInfo = await this._service.getJourneyById(id);
            if(infoToEdit.passenger && infoToEdit.passenger[(infoToEdit.passenger.length -1)] != journeyInfo.driver.toString() ){
                const journeyEdited = await this._service.editJourney(id, infoToEdit);
                await this._emailService.updateJourneyPassenger(journeyInfo.passenger,journeyInfo.departure.d_city, journeyInfo.arrival.a_city, journeyInfo.departure_date);
                res.status(200).json(journeyEdited);
            }
            else { throw new Error ("Un conducteur ne peut pas réserver son trajet")}
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }//TEST_DONE

    /**
  * Annule la participation d'un passager à un trajet,
  * rend les points dépensés au passager et informe le passager et le conducteur via un mail de confirmation d'annulation
  */
    cancelReservation = async (req, res) => {
        const journeyId = req.body.journeyId;
        const passengerId = req.body.passengerId;
        const driverId = req.body.driverId;
        const newPassengerList = req.body.passenger;
        const editPoints = req.body.pay_points;

        try {

            //Mise à jour des informations du trajet et de l'utilisateur passager
            const updatedPassengers = await this._service.editJourney(journeyId, { "passenger": newPassengerList });
            const updatedPoints = await this._userService.editUser(passengerId, { "pay_points": editPoints });
            const passengerInfo = await this._userService.getUserById(passengerId);
            const driverInfo = await this._userService.getUserById(driverId);
            const journeyInfo = await this._service.getJourneyById(journeyId);

            //Envoi du mail de confirmation d'annulation de participation d'un passager au trajet
            await this._emailService.cancelReservation(passengerInfo.email, driverInfo.email, journeyInfo.departure.d_city, journeyInfo.arrival.a_city, journeyInfo.departure_date);

            res.status(200).send({ updatedPassengers, updatedPoints });
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }//TEST_DONE

    /**
    * Renvoie tout les trajets en BDD
    */
        getAllJourneys = async(req,res) => {
            try {
                const journeys = await this._service.getAllJourneys();
                res.status(200).send(journeys);
            } catch (error) {
                res.status(400).json({ message: error.message });
                console.log(error)
            }
        }

    /**
     * Récupère la liste des trajets selon les filtres demandés
     */
    getJourneyByFilters = async (req, res) => {

        // Récupération des filtres
        const departureCity = req.query.d_city;
        const arrivalCity = req.query.a_city;

        const departure_date = new Date(req.query.departure_date);
        const car_seats = req.query.car_seats;

        // Création de l'objet filters pour l'envoyer au Service
        const filters = {}

        // Vérifie si les filtres ont été passés en paramètres,
        // Si oui, je les rajoute à l'objet filters

        if (departureCity) {
            filters["departure.d_city"] = departureCity;
        }

        if (arrivalCity) {
            filters["arrival.a_city"] = arrivalCity;
        }

        try {
            //Récupération de la liste des trajets correspondant aux filtres demandés
            const journeys = await this._service.getJourneyByFilters(filters, departure_date, car_seats);
            res.status(200).json(journeys);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }//TEST_DONE

    /**
     * Récupère toutes les informations liées au trajet sélectionné
     */
    getJourneyInfo = async (req, res) => {
        //Récupére l'id du trajet qui se trouve dans l'url du trajet affiché
        const journey_id = req.params.id;

        try {
            //Récupére les informations du trajet que l'on veut afficher grâce à son id
            const journeyInfo = await this._service.getJourneyById(journey_id);

            //Récupére les informations du conducteur lié au trajet grâce à son id (qui se trouve dans les infos de trajet)
            const driverInfo = await this._userService.journey_getUserById(journeyInfo.driver);

            //Récupére les informations de la voiture du conducteur faisant le trajet grâce à l'id du conducteur
            const driverCarInfo = await this._carService.getCarByUserId(journeyInfo.driver);

            //Renvoie toutes les infos sous forme JSON en cas de succés
            res.status(200).send({ journeyInfo, driverInfo, driverCarInfo });

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }//TEST_DONE

    /**
     * Récupère toutes les informations liées aux trois trajets les plus récents
     */
    getLastThreeJourneys = async (req, res) => {
        try {
            const firstjourneys = await this._service.getLastThreeJourneys();

            //Renvoie toutes les infos des trois premiers trajets en cas de succés
            res.status(200).send(firstjourneys);

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }

    }//TEST_DONE

    /**
     * Récupère les infos de la requête et appelle checkCarSeatNumber() du service
     */
    checkCarSeatNumber = async (req, res) => {
        const journeyId = req.params.id;

        try {
            const seatsAvailable = await this._service.checkCarSeatNumber(journeyId);
            res.status(200).json(seatsAvailable);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error);
        }
    }//TEST_DONE

    /**
     * requête suppression de trajet
     * appelle le rendu de points aux passagers et envoie des mails au conducteur et à chaque passager
     */
    deleteJourney = async (req, res) => {
        const journeyId = req.params.id;

        try {
            // récupération du trajet à supprimer
            const journey = await this._service.getJourneyById(journeyId);
            // conducteur
            const driverId = journey.driver;

            if(journey.passenger.length != 0){
                // mise en forme exploitable du tableau des passagers
                const passenger_id_list = journey.passenger.toString().split(',');
                
                // suppression des doublons pour itération
                const passengerSet = [...new Set(passenger_id_list)];
                
                // itération pour rendre les points aux utilisateurs
                passengerSet.forEach(async (id) => {
                    // compteur des occurences d'un passager donné dans le tableau des passagers du trajet
                    let occurences = 0;
                    for (let p of passenger_id_list) {
                        if (p === id) {
                            occurences++;
                        }
                    }
                    // récupération des points, calcul, et requête patch
                    const passenger = await this._userService.getUserById(id);
                    const points = passenger.pay_points + (journey.route_price * occurences);
                    await this._userService.editUser(id, { "pay_points": points });
                })

                // envoi de mail au passager
                await this._emailService.deleteJourneyPassenger(journey.passenger, journey.departure.d_city, journey.arrival.a_city, journey.departure_date);
            }
            
            // envoi de mail au conducteur
            await this._emailService.deleteJourneyDriver(driverId, journey.departure.d_city, journey.arrival.a_city, journey.departure_date);

            //Supprime le trajet des favoris des utilisateurs
            await this._userService.deleteJourneyMarks(journeyId);

            // appel de la fonction de suppression de trajet
            const deleteJourney = await this._service.deleteJourney(journeyId);
            res.status(200).json(deleteJourney);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error);
        }
    }
}

module.exports = JourneyController;