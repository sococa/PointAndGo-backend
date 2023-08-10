const EmailService = require('../services/emailService')
//! * EmailService

class EmailController {
    _emailService = new EmailService();

    //Envoie d'email de confirmation de réservation de trajet pour le passager ayant réservé et le conducteur du trajet
    reservationEmail = async (req, res) => {

        // Récupération des informations
        const passengerEmail = req.body.passengerEmail;
        const driverEmail = req.body.driverEmail;
        const reservedSeats = req.body.reservedSeats;

        const departureCity = req.body.departureCity;
        const arrivalCity = req.body.arrivalCity;
        const departureDate = req.body.departureDate;

        try {
            //Envoi de l'email pour le passager
            await this._emailService.reservationEmailPassenger(passengerEmail, departureCity, arrivalCity, departureDate, reservedSeats);

            //Envoi de l'email pour le conducteur
            await this._emailService.reservationEmailDriver(driverEmail, departureCity, arrivalCity, departureDate, reservedSeats);

            res.status(200).send("Réservation validée");

        } catch (error) { res.status(400).send({ error: error.message }); }
    } //TEST_DONE

    /**
    /*Envois un email pour réinitialiser son mot de passe
     */
    forgotPasswordEmail = async (req, res) => {

        const userId = req.body.id;
        const userEmail = req.body.userEmail;

        try {
            //Envoi de l'email
            await this._emailService.forgotPasswordEmail(userId, userEmail);

            res.status(200).send("Email envoyé");

        } catch (error) { res.status(400).send({ error: error.message }); }
    }
}

module.exports = EmailController;