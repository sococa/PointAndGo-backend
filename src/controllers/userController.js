const CarService = require('../services/carService');
const JourneyService = require('../services/journeyService');
const Users = require('../models/User');
const EmailService = require('../services/emailService');
const User = require('../models/User');

class UserController {

    // Crée une instance de service, pour pouvoir utiliser ses méthodes
    _carService = new CarService();
    _journeyService = new JourneyService();
    _emailService = new EmailService();

    constructor(service) {
        this._service = service;
    }

    /**
     * Récupère les informations de la requête et appelle la méthode createUser() du service.
     * Envoie un mail de confirmation d'inscription à l'utilisateur
     * Renvoi un status 200 en cas de succès ou un status 400 en cas d'erreur.
     */
    createUser = async (req, res) => {
        try {
            //! Création d'un nouvel USER

            //? destructuring des clés
            const { firstname, lastname, email, password, birthday, handicap, license_plate, brand, model } = req.body;



            //! Envoi de NewUser 
            const newUser = await this._service.createUser(firstname, lastname, email, password, birthday, handicap)

            await this._emailService.confirmationEmail(email);

            //Vérifie que tout les éléments de la voiture existent
            if (license_plate && req.files.picture && brand && model) {

                //! Création d'une nouvelle CAR avec l'_id de l'utilisateur qui vient d'être créé
                const id_user = newUser._id;
                const pictureToUpload = req.files.picture;

                //! Création de newCar vers carService avec la photo brute pictureToUpload)
                const newCar = await this._carService.createCar(id_user, license_plate, pictureToUpload, brand, model)

                //! Réceptionner newUser et newCar à CarService (dont la photo)
                res.status(200).send([newUser, newCar]);
            }
            else {
                //! Réceptionner newUser seulement
                res.status(200).send([newUser]);
            }

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log("⛔", error)
        }
    }//TEST_DONE

    /**
     * Récupère l'id de l'utilisateur à modifier dans les paramètres de la requête,
     * récupère les infos à modifier dans le body et appelle la méthode editUser() du service
     */
    editUser = async (req, res) => {
        const id = req.params.id;
        const infoToEdit = req.body;

        try {
            if (req.files) {
                infoToEdit.avatar = req.files.avatar
            }
            const userEdited = await this._service.editUser(id, infoToEdit);
            res.status(200).json(userEdited);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }//TEST_DONE

    /**
     * Récupère les informations de la requête et appelle la méthode getUserByEmail() du service
     * Renvois un status 200 en cas de succès ou un status 400 en cas d'erreur. 
     */
    loginUser = async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        try {
            const token = await this._service.verifyUser(email, password)

            res.status(200).json({ token: token });
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }//TEST_DONE

    /**
    * Renvoie tout les utilisateurs en BDD
    */
    getAllUsers = async (req, res) => {
        try {
            const users = await this._service.getAllUsers();
            res.status(200).send(users);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }

    /**
     * Récupère les informations liées à l'id de l'utilisateur 
     */
    getUserById = async (req, res) => {

        try {
            const userId = req.params.id;
            const userInfo = await this._service.getUserById(userId);

            res.status(200).send(userInfo);
        } catch (error) { res.status(400).json({ message: error.message }); }

    }//TEST_DONE

    /**
     * Récupère les informations liées à l'email de l'utilisateur 
     */
    getUserByEmail = async (req, res) => {

        const userEmail = req.params.email;

        try {
            const userInfo = await this._service.getUserByEmail(userEmail);

            res.status(200).send(userInfo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    /**
     * Récupère les informations de la requête et appelle la méthode checkEmailAlreadyExists() du service
     * Renvois true si l'email existe déjà, sinon renvois false
     */
    checkEmailAlreadyExists = async (req, res) => {
        const email = req.body.email;

        try {
            const emailAlreadyExists = await this._service.checkEmailAlreadyExists(email)
            res.status(200).send(emailAlreadyExists);

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }//TEST_DONE

    // Méthode non utilisée car vérification effectuée en Front
    /**
     * Récupère le token et appelle la méthode verifyToken() du service
     */
    // verifyToken = async (req, res) => {
    //     const token = req.headers.authorization;
    //     try {
    //         const result = await this._service.verifyToken(token)
    //         res.status(200).send(result);
    //     } catch (error) {
    //         res.status(400).json({ message: error.message });
    //         console.log(error)
    //     }
    // }

    /**
    * Récupère l'id utilisateur et appelle la méthode getPassengerJourneys() de journeyService
    */
    getPassengerJourneys = async (req, res) => {
        const idPassenger = req.params.id;
        try {
            const passengerJourneys = await this._journeyService.getPassengerJourneys(idPassenger)
            res.status(200).send(passengerJourneys);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }//TEST_DONE

    /**
    * Récupère l'id utilisateur et appelle la méthode getDriverJourneys() de journeyService
    */
    getDriverJourneys = async (req, res) => {
        const idDriver = req.params.id;
        try {
            const driverJourneys = await this._journeyService.getDriverJourneys(idDriver)
            res.status(200).send(driverJourneys);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }//TEST_DONE

    /**
     * Récupère les infos de la requête et appelle la méthode deleteUser() du service
     */
    deleteUser = async (req, res) => {
        const idUser = req.params.id;
        try {
            const userDeleted = await this._service.deleteUser(idUser);
            res.status(200).send(userDeleted);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }//TEST_DONE

    /**
    * Récupère l'id fourni dans la requête et appelle la méthode confirmEmail() du service
    * Renvois true une fois l'email confirmé, sinon renvoie false
    */
    confirmEmail = async (req, res) => {
        const id = req.body.id;

        try {
            const confirmEmail = await this._service.editUser(id, { "verify_email": true })
            res.status(200).send(confirmEmail);

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }//TEST_DONE

    /**
    * Récupère l'id utilisateur fourni dans la requête et appelle la méthode addMarkUser() du service
    * Renvoie les infos à jour de l'utilisateur en cas d'ajout dans les favoris, rien sinon
    */
    addMarkUser = async (req, res) => {
        const id = req.body.id_user;
        const markedId = req.body.id_driver;
        try {
            const addedUser = await this._service.addMarkUser(id, markedId);
            res.status(200).send(addedUser);

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }

    /**
    * Récupère l'id utilisateur fourni dans la requête et appelle la méthode deleteMarkUser() du service
    * Renvoie un statut 200 si la suppression s'est déroulée correctement
    */
    deleteMarkUser = async (req, res) => {
        const id = req.body.id_user;
        const unmarkedId = req.body.id_driver;
        try {
            const retiredUser = await this._service.deleteMarkUser(id, unmarkedId);
            res.status(200).send(retiredUser);

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }

    /**
    * Récupère l'id du trajet fourni dans la requête et appelle la méthode addMarkJourney() du service
    * Renvoie les infos à jour de l'utilisateur en cas d'ajout dans les favoris, rien sinon
    */
    addMarkJourney = async (req, res) => {
        const id = req.body.id_user;
        const markedId = req.body.id_journey;
        try {
            const addedJourney = await this._service.addMarkJourney(id, markedId);
            res.status(200).send(addedJourney);

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }

    /**
    * Récupère l'id utilisateur fourni dans la requête et appelle la méthode deleteMarkJourney() du service
    * Renvoie un statut 200 si la suppression s'est déroulée correctement
    */
    deleteMarkJourney = async (req, res) => {
        const id = req.body.id_user;
        const unmarkedId = req.body.id_journey;
        try {
            const retiredJourney = await this._service.deleteMarkJourney(id, unmarkedId);
            res.status(200).send(retiredJourney);

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }

    /**
     * Récupère les infos de la requête et appelle la méthode rateDriver() du service
    */
    rateDriver = async (req, res) => {
        const id_driver = req.params.id;
        const id_user = req.body.id_user;
        const rating = req.body.rating

        try {
            const ratedUser = await this._service.rateDriver(id_driver, id_user, rating);
            res.status(200).send(ratedUser);

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }

    /**
     * Récupère l'id de l'utilisateur et appelle la méthode getChatList du service
     */
    getChatList = async (req, res) => {

        const userId = req.params.id;

        try {
            const chatList = await this._service.getChatList(userId);
            res.status(200).json(chatList);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error)
        }
    }
}

module.exports = UserController;
