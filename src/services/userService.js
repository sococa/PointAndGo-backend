//Import des models et du repository pour leur utilisation dans les fonctions
const User = require('../models/User');
const UserRepository = require("../repositories/userRepository");
//Import bcryptjs pour l'encryptage de certaines données
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2; // npm i cloudinary . On n'oublie pas le `.v2` à la fin
require("dotenv").config();
const CarService = require('../services/carService')
const CarRepository = require('../repositories/carRepository')
const JourneyService = require('../services/journeyService');
const JourneyRepository = require('../repositories/journeyRepository');
const EmailService = require('../services/emailService');
const CommentsService = require('../services/commentsService');

class UserService {

    // Crée une instance de repository, pour pouvoir utiliser ses méthodes
    constructor(repository) {
        this._repository = new UserRepository(repository);
    }

    _carService = new CarService();
    _carRepository = new CarRepository();
    _journeyService = new JourneyService();
    _journeyRepository = new JourneyRepository();
    _emailService = new EmailService();
    _commentsService = new CommentsService();

    /**
     * Crée une version cryptée du mot de passe de l'utilisateur
     * @param {string} password Le mot de passe saisie par l'utilisateur
     * @returns Le mot de passe crypté
     */
    hashPassword = async (password) => {

        //Génération du salt nécessaire à l'encryptage
        const salt = await bcrypt.genSalt(10);

        //Encryptage
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    }

    /**
     * Crée un nouvel utilisateur avec les informations récupérées par le controller,
     * et appelle la méthode createUser() du repository.
     * @param {string} firstname Le prénom saisi par l'utilisateur
     * @param {string} lastname Le nom saisi par l'utilisateur
     * @param {string} email L'email saisi par l'utilisateur
     * @param {string} password Le mot de passe saisi par l'utilisateur
     * @param {Date} birthday La date de naissance saisie par l'utilisateur
     * @param {Boolean} handicap Détermine si l'utilisateur posséde un handicap ou non
     * @returns L'utilisateur créé
     */
    createUser = async (firstname, lastname, email, userPassword, birthday, handicap) => {

        //Convertie la valeur birthday récupérée en type Date
        birthday = new Date(birthday);

        // Crypte le mot de passe de l'utilisateur
        const password = await this.hashPassword(userPassword);

        // Crée un utilisateur grâce au model
        const newUser = new User({ firstname, lastname, email, password, birthday, handicap });

        //L'utilisateur qui a été créé par le repository
        const createdUser = await this._repository.createUser(newUser);

        return createdUser;
    }

    /**
     * Modifie les informations d'un utilisateur
     * @param {Number} id L'id de l'utilisateur à modifier
     * @param {Object} infoToEdit Les nouvelles informations à modifier
     * @returns L'utilisateur après modifications
     */
    editUser = async (id, infoToEdit) => {
        if (infoToEdit.password) {
            infoToEdit.password = await this.hashPassword(infoToEdit.password);
        }

        if (infoToEdit.birthday) {
            infoToEdit.birthday = new Date(infoToEdit.birthday);
        }

        if (infoToEdit.avatar) {
            if (infoToEdit.avatar.mimetype.slice(0, 5) !== "image") { // vérifier si les 5 premiers caractères de la clé mimetype forme le mot 'image'
                throw new Error("You must send a valid image");
            }

            //! import de notre fonction convertToBase64 qui convertit le buffer en base64.
            const convertToBase64 = require("../utils/convertToBase64");

            //! Envoi de l'image convertit à cloudinary
            const result = await cloudinary.uploader.upload(
                convertToBase64(infoToEdit.avatar),
                {
                    folder: `PointAndGo/Avatars`,  //? Dans le dossier suivant
                    public_id: `userAvatar_${infoToEdit.avatar.name}`, //? Avec le nom suivant
                }
            );

            infoToEdit.avatar = result;
        }

        // Prévient l'apparition d'un bug critique en cas non renseignement de l'image dans le formulaire
        if (infoToEdit.avatar == '') {
            delete infoToEdit.avatar;
        }

        const userEdited = this._repository.editUser(id, infoToEdit);
        return userEdited;
    }

    /**Renvoie tout les utilisateurs en BDD
    * @returns la liste des utilisateurs
    */
    getAllUsers = async () => {
        return await this._repository.getAllUsers();
    }

    /**
    * Récupère toutes les infos de l'utilisateur à partir de son id via le repository
    * @param {Number} id
    * @returns Les données de l'utilisateur à l'id correspondant
    */
    getUserById = async (id) => {
        return await this._repository.getUserById(id);
    }

    /**
     * Récupère toutes les infos de l'utilisateur à partir de son email via le repository
     * @param {String} userEmail 
     * @returns  Les données de l'utilisateur à l'email correspondant
     */
    getUserByEmail = async (userEmail) => {

        const userInfo = await this._repository.getUserByEmail(userEmail);

        return userInfo;
    }

    /**
    * Récupère uniquement certaines infos de l'utilisateur à partir de son id via le repository
    * @param {Number} id
    * @returns Les données de l'utilisateur à l'id correspondant
    */
    journey_getUserById = async (id) => {
        return await this._repository.journey_getUserById(id);
    }

    /**
     * Vérifie les informations de connexion de l'utilisateur,
     * et crée un token si les infos sont correctes.
     * @param {String} email L'email de l'utilisateur
     * @param {String} password Le mot de passe de l'utilisateur
     * @returns Le token créé
     */
    verifyUser = async (email, password) => {
        // Récupère l'utilisateur correspondant à l'email
        const user = await this._repository.getUserByEmail(email);
        if (!user) throw "Cet email n'existe pas";

        // Vérifie que le mot de passe est correct
        const passwordIsCorrect = await bcrypt.compare(password, user.password);
        if (!passwordIsCorrect) throw "Mot de passe incorrect";

        // Vérifie si le compte a été suspendu
        if (user.is_activated == false) {
            return user._id;
        }
        else {
            // Création du token
            const token = this.createToken(user);
            return token;
        }
    }

    /**
     * Vérifie si l'email existe déjà dans la BDD
     * @param {String} email L'email a vérifier
     * @returns True si l'email existe déjà en BDD, sinon false
     */
    checkEmailAlreadyExists = async (email) => {
        const emailAlreadyExists = await this._repository.getUserByEmail(email);

        // Si un utilisateur correspondant à l'email a été trouvé, renvois true
        if (emailAlreadyExists) return true;

        // Sinon, renvois false
        return false;
    }

    /**
     * Crée un token à partir des informations de l'utilisateur
     * @param {User} user 
     * @returns Le token créé
     */
    createToken = async (user) => {

        // Création du payload du token
        const payload = {
            auth: user.is_admin == true ? "admin" : "user",
            sub: user._id
        }

        // Création du token
        const token = JWT.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
        return token;
    }

    // Méthode non utilisée car vérification effectuée en Front
    /**
     * Vérifie si le token est valide
     * @param {String} token 
     * @returns Le payload si le token est valide, sinon renvois une erreur
     */
    // verifyToken = async (token) => {
    //     const tokenIsValid = JWT.verify(token, process.env.JWT_SECRET_KEY);
    //     return tokenIsValid;
    // }

    /**
     * Supprimme les trajets créés et réservés dont la date n'est pas passée,
     * envois des emails de confirmations de suppressions/annulation de réservation,
     * supprimme le compte de l'utilisateur et anonymise ses informations dans la BDD
     * @param {ObjectId} idUser 
     * @returns Une confirmation de suppression
     */
    deleteUser = async (idUser) => {
        const user = await this.getUserById(idUser);

        //Suppression de l'utilisateur des favoris des autres utilisateurs
        await this._repository.deleteUserMarks(idUser);

        // Récupération des trajets créés (conducteur)
        const createdJourneys = await this._journeyService.getDriverJourneys(idUser);

        // Récupération des trajets réservés (passager)
        const reservedJourneys = await this._journeyService.getPassengerJourneys(idUser);

        // Suppression des trajets créés si la date n'est pas encore passée
        const user_car = await this._carService.getCarByUserId(idUser);
        if (createdJourneys) {
            const currentDate = new Date();

            createdJourneys.forEach(async (journey) => {
                // Suppression des trajets à venir
                if (journey.departure_date > currentDate) {
                    // Envois des emails
                    await this._emailService.deleteJourneyPassenger(journey.passenger, journey.departure.d_city, journey.arrival.a_city, journey.departure_date)

                    //Suppression du trajet des favoris
                    await this._repository.deleteJourneyMarks(journey._id);

                    await this._journeyRepository.deleteJourney(journey._id);

                }
            })

        }

        // Suppression des réservations de trajet si la date n'est pas encore passée
        if (reservedJourneys) {
            const currentDate = new Date();

            reservedJourneys.forEach(async (journey) => {

                // Suppression des réservations pour les trajets à venir
                if (journey.departure_date > currentDate) {
                    // Envois des emails
                    const driver = await this._repository.getUserById(journey.driver);

                    await this._emailService.cancelReservation(user.email, driver.email, journey.departure.d_city, journey.arrival.a_city, journey.departure_date)

                    const newJourneyList = journey.passenger.filter((passenger) => passenger.toString() !== user._id.toString())
                    await this._journeyRepository.editJourney(journey._id, { "passenger": newJourneyList })
                }
            })
        }



        //Anonymisation de l'utilisateur
        const userInfoToEdit = {
            firstname: "Utilisateur",
            lastname: "Anonyme",
            email: "utilisateur@anonyme.com",
            password: "supprimé",
            avatar: "",
            is_admin: false,
            is_activated: false,
            is_deleted: true,
            marked_journey: [],
            marked_driver: []
        };

        //Anonymisation des commentaires de l'utilisateur
        await this._commentsService.anonymizeDeletedUserComment(idUser);

        //Anonymisation de la voiture liée à l'utilisateur supprimé
        // let carInfoToEdit = await this._carRepository.getCarByUserId(idUser);
        // carInfoToEdit.license_plate = "AA-000-AA";
        // carInfoToEdit.picture = "";

        // Modification des informations dans la BDD user
        //await this._carRepository.editCar(carInfoToEdit._id, carInfoToEdit);

        if (user_car != null) {
            await this._carService.deleteCarByUserId(idUser);
        }

        const userDeleted = await this._repository.editUser(idUser, userInfoToEdit);
        return userDeleted;
    }

    /**
     * Ajoute un conducteur dans les favoris utilisateur
     * @param {ObjectId} id 
     * @param {ObjectId} markedId
     * @returns La réponse du repository
     */
    addMarkUser = async (id, markedId) => {
        return await this._repository.addMarkUser(id, markedId);
    }

    /**
    * Retire un conducteur des favoris utilisateur
    * @param {ObjectId} id 
    * @param {ObjectId} unmarkedId
    * @returns La réponse du repository
    */
    deleteMarkUser = async (id, unmarkedId) => {
        return await this._repository.deleteMarkUser(id, unmarkedId);
    }

    /**
    * Retire un conducteur des favoris de tout les utilisateurs concernés
    * @param {ObjectId} userId
    * @returns La réponse du repository
    */
    deleteUserMarks = async (userId) => {
        return await this._repository.deleteUserMarks(userId);
    }

    /**
     * Ajoute un trajet dans les favoris utilisateur
     * @param {ObjectId} id 
     * @param {ObjectId} markedId
     * @returns La réponse du repository
     */
    addMarkJourney = async (id, markedId) => {
        return await this._repository.addMarkJourney(id, markedId);
    }

    /**
    * Retire un trajet des favoris utilisateur
    * @param {ObjectId} id 
    * @param {ObjectId} unmarkedId
    * @returns La réponse du repository
    */
    deleteMarkJourney = async (id, unmarkedId) => {
        return await this._repository.deleteMarkJourney(id, unmarkedId);
    }

    /**
    * Retire un trajet des favoris  de tout les utilisateurs concernés
    * @param {ObjectId} journeyId
    * @returns La réponse du repository
    */
    deleteJourneyMarks = async (journeyId) => {
        return await this._repository.deleteJourneyMarks(journeyId);
    }

    /**
     * Ajoute ou modifie une note pour un conducteur
     * @param {ObjectId} id_driver L'id du conducteur à noter
     * @param {ObjectId} id_user L'id de l'utilisateur qui fournit la note
     * @param {Number} rating La note
     * @returns Un status 200
     */
    rateDriver = async (id_driver, id_user, rating) => {
        return await this._repository.rateDriver(id_driver, id_user, rating);
    }

    /**
     * Récupère la liste des trajets où l'utilisateur est conducteur ou passager, 
     * avec les participants avec lesquels il peut commencer une conversation
     * @param {ObjectId} userId L'id de l'utilisateur
     * @returns La liste des trajets avec les participants
     */
    getChatList = async (userId) => {
        const list = await this._journeyRepository.getChatList(userId);

        const chatList = [];

        for (const journey of list) {

            const journeyInfo = {
                id: journey._id,
                description: `Trajet ${journey.departure.d_city} - ${journey.arrival.a_city} du ${journey.departure_date.toLocaleDateString()}`,
                role: "Driver",
                journeyChatList: []
            }

            if (journey.driver == userId && journey.passenger.length > 0) { // Si il est conducteur, et qu'il y a au moins 1 passager
                for (const passenger of [...new Set(journey.passenger.toString().split(','))]) { // Pour supprimer les doublons dans la liste de passagers
                    const passengerInfo = await this._repository.getUserById(passenger);
                    const newPassenger = {
                        id: passengerInfo._id,
                        firstname: passengerInfo.firstname,
                        lastname: passengerInfo.lastname,
                    }
                    // Pour ne pas avoir de doublons dans la liste des passagers
                    if (!journeyInfo.journeyChatList.includes(newPassenger)) {
                        journeyInfo.journeyChatList.push(newPassenger);
                    }
                }
            }

            else if (journey.driver != userId) { // Si il est passager

                // Récupère les infos du conducteur
                const driverInfo = await this._repository.getUserById(journey.driver);

                // Crée un objet avec seulements les infos nécessaires
                const driver = {
                    id: driverInfo._id,
                    firstname: driverInfo.firstname,
                    lastname: driverInfo.lastname,
                    avatar: driverInfo.avatar.secure_url
                }
                journeyInfo.journeyChatList.push(driver);
                journeyInfo.role = "Passenger"
            }

            // Condition pour n'afficher que les trajets qui ont des passagers
            if (journeyInfo.journeyChatList.length > 0) {
                chatList.push(journeyInfo);
            }
        }
        return chatList;
    }
}

module.exports = UserService;