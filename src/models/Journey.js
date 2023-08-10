// ne pas toucher aux autres fichiers
const mongoose = require("mongoose");

// création du modèle TRAJET (JOURNEY) --★゜・。。・゜゜・。。・゜☆゜・。。・゜゜・。。・゜★゜・。。・゜゜・。。・゜☆
const journeySchema = new mongoose.Schema({
        //id_user du conducteur du trajet provenant de la table User
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
        //Nombre de passagers que peut acceuillir le conducteur
    car_seats: {
         required: true,
         type: Number,
         min: 1,
         max: 7 
    },
        //Nombre de petits bagages transortables
    small_luggage: {
        type: Number, min: 0, max: 3,
        required: true,
    },
        //Nombre de gros bagages transportables
    big_luggage: {
        type: Number, min: 0, max: 2,
        required: true,
    },
        //Liste des id_user des passagers qui sont inscrit sur le trajet
    passenger: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
        //Validation du trajet (par les participants) une fois celui-ci réalisé
    validation: {
        type: Boolean,
        default: false
    },
        //Numéro de réservation du trajet généré aléatoirement
    booking_number: {
        type: String,
        minlength: 16
    },
        //Temps estimé du trajet en minutes
        travel_time:{
            type: Number,
        },
        //Prix du trajet en points
    route_price: {
        type: Number,
        min: 1,
        max: 5000,
        required: true
    },
        //Informations sur le lieu de départ
    departure: {
        d_latitude: String,
        d_longitude: String,
        d_adress: String,
        d_zip_code: Number,
        d_city: {
            required: true,
            type: String
        },
    },
    
        //Informations sur le lieu d'arrivée
    arrival: {
        a_latitude: String,
        a_longitude: String,
        a_adress: String,
        a_zip_code: Number,
        a_city: {
            required: true,
            type: String
        },
    },
        //Date de départ du trajet au format UTC
    departure_date: {
        required: true,
        type: Date, min: Date.now // ("<YYYY-mm-ddTHH:MM:ssZ>")
    },
        //Liste des préférences et des options permises du conducteur provenant de la table User
    preferences_options: {
        type: mongoose.Schema.Types.Mixed,
        ref: "User",
    },
        //Détermine si le trajet est adapté aux personnes à mobilité réduite ou non
        prm_compatible: {
            type: Boolean,
            required: true,
            default: false
        },
        //Notes du trajet par les passagers ayant participés
    ratings:{
        type: Array
    }

})

//! ne pas oublier l'export --★゜・。。・゜゜・。。・゜☆゜・。。・゜゜・。。・゜★゜・。。・゜゜・。。・゜☆
module.exports = mongoose.model('Journey', journeySchema);