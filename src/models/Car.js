const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
        // ObjectId de l'utilisateur provenant de la table User
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },

    //Plaque d'immatriculation de la voiture
    license_plate:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },

    //Marque de la voiture
    brand:{
        type: String,
        required: true,
        minlength: 1,
        max: 15,
        
    },

    //Modèle de la voiture
    model:{
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
  
    //Photo de la voiture
    picture: {
        type: mongoose.Schema.Types.Mixed, default: {}, // mongoose.Schema.Types.Mixed est un type souple qui peut contenir n'importe quel type
        required: true
    }
});

module.exports = mongoose.model('Car', carSchema);