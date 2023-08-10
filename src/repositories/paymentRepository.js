const mongoose = require("mongoose");

//Importation du model de Payment pour son utilisation dans repository
const Payment = require("../models/Payment")


class PaymentRepository {

    /**
    * Sauvegarde de la transaction dans la BDD
    * @param {newPayment} stripeValidation infos de la transaction 
    * @returns le paiement enregistré dans la BDD
    */
    stripeValidation = async (newPayment) => {
        await newPayment.save();
        return newPayment;
    }

}
module.exports = PaymentRepository;