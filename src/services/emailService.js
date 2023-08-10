const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
require("dotenv").config();
const apiKey = process.env.MAILGUN_API_KEY;
const mg = mailgun.client({ username: 'api', key: apiKey });
const UserRepository = require('../repositories/userRepository');

class EmailService {

    _userRepository = new UserRepository();

    /**
     * Envois un email au passager pour confirmer la réservation d'un trajet
     * @param {String} toAddress Adresse du destinataire
     * @param {String} departureCity La ville de départ
     * @param {String} arrivalCity La ville d'arrivée
     * @param {Date} departureDate La date de départ
     * @param {Number} reservedSeats Le nombre de places reservées
     */
    reservationEmailPassenger = async (toAddress, departureCity, arrivalCity, departureDate, reservedSeats) => {
        const date = new Date(departureDate)
        await mg.messages.create(process.env.MAILGUN_DOMAIN_URL, {
            from: "pointandgo.hdf@gmail.com",
            to: [toAddress],
            subject: "Votre confirmation de réservation de trajet.",
            text: `Bonjour cher client,\n\n Votre trajet "${departureCity} - ${arrivalCity}" à la date du ${date.toLocaleDateString("fr-FR").slice(0, 15)} a bien été réservé pour ${reservedSeats} personnes !\n\n Nous vous remercions de votre confiance et vous souhaitons un agréable voyage !\n\n L'équipe Point&Go.`,
        })
            .then(msg => console.log(msg))
            .catch(err => console.log(err));
    }

    /**
     * Envois un email au conducteur pour indiquer qu'un utilisateur a réservé une place
     * @param {String} toAddress Adresse du destinataire
     * @param {String} departureCity La ville de départ
     * @param {String} arrivalCity La ville d'arrivée
     * @param {Date} departureDate La date de départ
     * @param {Number} reservedSeats Le nombre de places reservées
     */
    reservationEmailDriver = async (toAddress, departureCity, arrivalCity, departureDate, reservedSeats) => {
        const date = new Date(departureDate)
        await mg.messages.create(process.env.MAILGUN_DOMAIN_URL, {
            from: "pointandgo.hdf@gmail.com",
            to: [toAddress],
            subject: "Nouvelles informations sur votre trajet",
            text: `Bonjour cher client,\n\n Une réservation pour ${reservedSeats} personnes vient d'être effectuée sur votre trajet "${departureCity} - ${arrivalCity}" à la date du ${date.toLocaleDateString("fr-FR").slice(0, 15)} !\n\n Nous vous remercions de votre confiance et vous souhaitons un agréable voyage !\n\n L'équipe Point&Go.`,
        })
            .then(msg => console.log(msg))
            .catch(err => console.log(err));
    }

    /**
     * Envois un email au conducteur et aux passagers en cas d'annulation d'une réservation d'un trajet
     * @param {String} passengerEmail Adresse du passager
     * @param {String} driverEmail Adresse du conducteur
     * @param {String} departureCity La ville de départ
     * @param {String} arrivalCity La ville d'arrivée
     * @param {String} departure_date La date de départ
     */
    cancelReservation = async (passengerEmail, driverEmail, departureCity, arrivalCity, departure_date) => {
        departure_date = new Date(departure_date);

        //Envoi du mail d'annulation pour le passager
        await mg.messages.create(process.env.MAILGUN_DOMAIN_URL, {
            from: "pointandgo.hdf@gmail.com",
            to: [passengerEmail],
            subject: "Annulation de votre participation à un trajet",
            text: `Bonjour cher client,\n\n Nous vous confirmons que votre réservation du trajet "${departureCity} - ${arrivalCity}" à la date du ${departure_date.toLocaleDateString("fr-FR").slice(0, 15)} a bien été annulée !\n\n Nous espérons vous revoir bientôt !\n\n L'équipe Point&Go.`
        })
            .then(msg => console.log(msg))
            .catch(err => console.log(err));

        //Envoi du mail d'annulation pour le conducteur
        await mg.messages.create(process.env.MAILGUN_DOMAIN_URL, {
            from: "pointandgo.hdf@gmail.com",
            to: [driverEmail],
            subject: "Annulation de réservation sur votre trajet",
            text: `Bonjour cher client,\n\n Nous vous informons qu'une réservation sur votre trajet "${departureCity} - ${arrivalCity}" à la date du ${departure_date.toLocaleDateString("fr-FR").slice(0, 15)} a été annulée !\n\n Nous vous souhaitons une agréable journée !\n\n L'équipe Point&Go.`
        })
            .then(msg => console.log(msg))
            .catch(err => console.log(err));
    }

    /**
     * Fonction d'envoi de mail à un conducteur à la suppression de son trajet
     * @param {ObjectId} driverId 
     * @param {String} departureCity 
     * @param {String} arrivalCity 
     * @param {String} departure_date 
     */
    deleteJourneyDriver = async (driverId, departureCity, arrivalCity, departure_date) => {
        departure_date = new Date(departure_date);

        // récup données conducteur
        const driver = await this._userRepository.getUserById(driverId);
        const driverEmail = driver.email;

        // Envoi du mail d'annulation pour le conducteur
        await mg.messages.create(process.env.MAILGUN_DOMAIN_URL, {
            from: "pointandgo.hdf@gmail.com",
            to: [driverEmail],
            subject: "Annulation de votre trajet",
            text: `Bonjour cher client,\n\n Nous vous confirmons l'annulation du trajet "${departureCity} - ${arrivalCity}" à la date du ${departure_date.toLocaleDateString("fr-FR").slice(0, 15)}. \n\n Nous espérons vous revoir bientôt !\n\n L'équipe Point&Go.`
        })
            .then(msg => console.log(msg))
            .catch(err => console.log(err));
    }

    /**
     * Fonction d'envoi de mails aux passagers d'un trajet qui vient d'être supprimé
     * @param {ObjectId[]} passengerIdArray 
     * @param {String} departureCity 
     * @param {String} arrivalCity 
     * @param {String} departure_date 
     */
    deleteJourneyPassenger = async (passengerIdArray, departureCity, arrivalCity, departure_date) => {
        departure_date = new Date(departure_date);

        // itération sur un tableau des passagers uniques (on évite les requêtes en doublon)
        [...new Set(passengerIdArray)].forEach(async (passengerId) => {
            // récup infos du passager
            const passenger = await this._userRepository.getUserById(passengerId);
            const passengerEmail = passenger.email;
            // MAILGUN BRATATATA
            await mg.messages.create(process.env.MAILGUN_DOMAIN_URL, {
                from: "pointandgo.hdf@gmail.com",
                to: [passengerEmail],
                subject: "Annulation d'un de vos trajets",
                text: `Bonjour cher client,\n\n Nous vous informons que le trajet "${departureCity} - ${arrivalCity}" à la date du ${departure_date.toLocaleDateString("fr-FR").slice(0, 15)} a été annulé par son conducteur. \n\n Nous espérons vous revoir bientôt !\n\n L'équipe Point&Go.`
            })
                .then(msg => console.log(msg))
                .catch(err => console.log(err));

        })
    }

    /**
     * Fonction d'envoi de mails aux passagers d'un trajet qui vient d'être modifié
     * @param {ObjectId[]} passengerIdArray 
     * @param {String} departureCity 
     * @param {String} arrivalCity 
     * @param {String} departure_date 
     */
    updateJourneyPassenger = async (passengerIdArray, departureCity, arrivalCity, departure_date) => {
        departure_date = new Date(departure_date);

        // itération sur un tableau des passagers uniques (on évite les requêtes en doublon)
        [...new Set(passengerIdArray)].forEach(async (passengerId) => {
            // récup infos du passager
            const passenger = await this._userRepository.getUserById(passengerId);
            const passengerEmail = passenger.email;
            // MAILGUN
            await mg.messages.create(process.env.MAILGUN_DOMAIN_URL, {
                from: "pointandgo.hdf@gmail.com",
                to: [passengerEmail],
                subject: "Modification d'un de vos trajets",
                text: `Bonjour cher client,\n\n Nous vous informons que les conditions du trajet "${departureCity} - ${arrivalCity}" à la date du ${departure_date.toLocaleDateString("fr-FR").slice(0, 15)} ont été modifiées par son conducteur. \n\n Nous espérons vous revoir bientôt !\n\n L'équipe Point&Go.`
            })
                .then(msg => console.log(msg))
                .catch(err => console.log(err));

        })
    }


    /**
     * Fonction d'envoi de mail pour la confirmation d'inscription de l'utilisateur
     * @param {String} userEmail mail de l'utilisateur
     */
    confirmationEmail = async (userEmail) => {
        // MAILGUN
        await mg.messages.create(process.env.MAILGUN_DOMAIN_URL, {
            from: "pointandgo.hdf@gmail.com",
            to: [userEmail],
            subject: "Confirmation de votre email",
            text: `Bonjour cher client,\n\n Suite à votre inscription, vous devez confirmer votre email en cliquant sur le lien ci-dessous. \n\n http://localhost:5173/confirmationEmail \n\n Nous vous remercions pour votre confiance!\n\n L'équipe Point&Go.`
        })
            .then(msg => console.log(msg))
            .catch(err => console.log(err));
    }

    /**
     * Envois un email pour réinitialiser son mot de passe
     * @param {*} userId L'id de l'utilisateur (pour l'envoyer en :params dans l'URL)
     * @param {*} userEmail L'email de l'utilisateur
     */
    forgotPasswordEmail = async (userId, userEmail) => {
        await mg.messages.create(process.env.MAILGUN_DOMAIN_URL, {
            from: "pointandgo.hdf@gmail.com",
            to: [userEmail],
            subject: "Réinitialisation du mot de passe",
            text: `Bonjour cher client,\n\n Suite à votre demande, vous pouvez réinitialiser votre mot de passe en cliquant sur le lien ci-dessous. \n\n http://localhost:5173/forgotPassword/${userId} \n\n Nous vous remercions pour votre confiance!\n\n L'équipe Point&Go.`
        })
            .then(msg => console.log(msg))
            .catch(err => console.log(err));
    }
}

module.exports = EmailService;