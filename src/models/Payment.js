const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    // Date à laquelle la transaction a été effectuée
    transaction_date: {
        type: Date,
        default: Date.now(),
    },

    // Montant de la transaction
    amount: {
        type: Number,
        min: 0,
        max: 5000
    },

    // Devise utilisée pour la transaction
    currency: {
        type: String,
        min: 1,
        default: "EUR"
    },

    // Etat actuel de la transaction 
    transaction_state: {
        type: String,
        default: "Transaction validée"
    },

    // Le type de transaction (crédit ou débit)
    transaction_type: {
        type: String,
        required: true,
    },

    // Référence vers l'id de l'acheteur
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    // Détails des produits sélectionnés
    product_list: {

        // Quantité du produit sélectionnée par l'utilisateur
        quantity: {
            type: Number,
            min: 1
        },

        // Id de l'offre proposée
        id_formula: {
            type: String
        }

    },

    // Token généré par Stripe
    source: {
        type: String
    }
})

module.exports = mongoose.model('Payment', paymentSchema);