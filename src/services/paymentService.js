const PaymentRepository = require("../repositories/paymentRepository")

const Payment = require('../models/Payment');


class PaymentService {
    _repository = new PaymentRepository();

    /**
   * Crée une nouvelle transaction avec les informations récupérées par le controller,
   * et appelle la méthode stripeValidation() du repository.
   * @param {Date} transaction_date Date du paiement, par défaut la date du jour
   * @param {Number} amount Montant de la transaction
   * @param {String} currency Devise utilisée pour la transaction
   * @param {String} transaction_state Etat actuel de la transaction 
   * @param {String} transaction_type Le type de transaction
   * @param {ObjectId} id_user Réf vers l'id de l'acheteur
   * @param {Object} product_list Détails des produits sélectionnés
   * @param {Number} quantity Quantité du produit sélectionné
   * @param {String} id_formula Id de l'offre choisie
   * @param {String} source Token généré par Stripe
   * @returns Le nouveau paiement créé
   */
    stripeValidation = async (transaction_date, amount, currency, transaction_state, transaction_type, id_user, product_list, source) => {

        transaction_date = new Date(transaction_date);

        // Crée une transaction grâce au model
        const newPayment = new Payment({ transaction_date, amount, currency, transaction_state, transaction_type, id_user, product_list, source });

        // La transaction qui a été créé par le repository
        const ValidateTransaction = this._repository.stripeValidation(newPayment);

        return ValidateTransaction;

    }


}

module.exports = PaymentService;