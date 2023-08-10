// Instances de classes
const EmailController = require('../controllers/emailController');
const _emailController = new EmailController();

const express = require("express");

const router = express.Router();

//Route pour l'envoi d'email de validation de réservation
router.post("/reservationEmail", _emailController.reservationEmail);

// Route pour envoyer un email de réinitialisation de mot de passe
router.post("/forgotPassword", _emailController.forgotPasswordEmail)

module.exports = router;