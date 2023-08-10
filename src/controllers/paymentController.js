const PaymentService = require("../services/paymentService")


class PaymentController {
    _service = new PaymentService();


    /**
   * Récupère les informations de la requête et appelle la méthode stripeValidation() du service.
   * Renvoie un statut 200 en cas de succès, la transaction est validé, les points sont achetés.
   * Renvoie un statut 400 en cas d'erreur, le paiement n'est pas accepté.
   */

    stripeValidation = async (req, res) => {
        try {
            //Récupération des informations contenues dans le formulaire de paiement
            const transaction_date = req.body.transaction_date;
            const amount = req.body.amount;
            const currency = req.body.currency;
            const transaction_state = req.body.transaction_state;
            const transaction_type = req.body.transaction_type;
            const id_user = req.body.id_user;
            const product_list = req.body.product_list;
            const source = req.body.source; // =stripeToken reçu depuis l'API Stripe

            const newPayment = await this._service.stripeValidation(transaction_date, amount, currency, transaction_state, transaction_type, id_user, product_list, source)

            res.status(200).json(newPayment.status);

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log("error.message: ", error.message);
        }
    }
}

module.exports = PaymentController;