const express = require("express");//Accés serveur

//Import du modéle CRS pour le fonctionnement des routes
const PaymentRepository = require("../repositories/paymentRepository")
const PaymentService = require("../services/paymentService")
const PaymentController = require('../controllers/paymentController')

// Instances de classes
const _repository = new PaymentRepository();
const _service = new PaymentService(_repository);
const _controller = new PaymentController(_service);

const router = express.Router();

//Route pour l'envoi du token Stripe afin de valider le paiement
router.post("/pay", _controller.stripeValidation);


module.exports = router;