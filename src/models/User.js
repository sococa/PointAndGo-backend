const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    //Prénom de l'utilisateur
    firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
    },
    //Nom de famille de l'utilisateur
    lastname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    //Adresse mail de l'utilisateur
    email: {
        type: String,
        required: true,
        maxlength: 50,
    },
    //Vérification de l'adresse mail
    verify_email: {
        type: Boolean,
        default: false
    },
    //Mot de passe de l'utilisateur encrypté
    password: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    //Date de naissance de l'utilisateur
    birthday: {
        type: Date,
        required: true,
    },
    //Photo de profil de l'utilisateur
    avatar: {
        type: mongoose.Schema.Types.Mixed, default: {
            secure_url: "https://res.cloudinary.com/dlodqal4h/image/upload/v1690193043/PointAndGo/Avatars/avatar_blue_zoijp3.png",
            url: "https://res.cloudinary.com/dlodqal4h/image/upload/v1690193043/PointAndGo/Avatars/avatar_blue_zoijp3.png"
        },
        //url: String
    },
    //Nombre de points acquis gratuitement par l'utilisateur
    free_points: {
        type: Number,
        default: 50,
        min: 0
    },
    //Nombre de points acquis via paiement par l'utilisateur
    pay_points: {
        type: Number,
        default: 0,
        min: 0
    },
    //Détermine le rôle d'administrateur de l'utilisateur
    is_admin: {
        type: Boolean,
        default: false
    },
    //Activation du compte utilisateur lui permettant son accés aux fonctionnalités du site
    is_activated: {
        type: Boolean,
        default: true
    },
    // Suppression du compte utilisateur
    is_deleted: {
        type: Boolean,
        default: false
    },
    //Détermine si l'utilisateur posséde des handicaps ou non
    handicap: {
        type: Boolean,
        default: false
    },
    //Liste des préférences et options permises de l'utilisateur
    preferences_options: {
        silence: {
            type: String,
        },
        music: {
            type: Array, // au lieu de [String]
        },
        smoker: {
            type: String,
        },
        animals: {
            type: Boolean,
        },
        material: {
            type: String,
            minlength: 2,
            maxlength: 25
        }
    },
    //Liste des notes attribués à l'utilisateur par d'autres utilisateurs
    rating: {
        type: Array,
        default: []
    },
    //Liste des trajets en favoris
    marked_journey: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Journey"
    }],
    //Liste des conducteurs en favoris
    marked_driver: [{
        type: mongoose.Schema.Types.ObjectId
    }]

});

module.exports = mongoose.model('User', userSchema);
