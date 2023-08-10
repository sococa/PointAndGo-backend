//Import du model et du repository pour leur utilisation dans les fonctions
const Car = require('../models/Car');
const CarRepository = require("../repositories/carRepository");

//Import bcryptjs pour l'encryptage de certaines données
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2; // npm i cloudinary . On n'oublie pas le `.v2` à la fin

class CarService {

    // Crée une instance de repository, pour pouvoir utiliser ses méthodes
    constructor(repository) {
        this._repository = new CarRepository(repository);
    }

    /**
     * Crée une version chiffrée de l'immatriculation de la voiture
     * @param {string} license_plate L'immatriculation saisie par l'utilisateur
     * @returns L'immatriculation cryptée
     */
    hashLicense = async (license_plate) => {

        //Génération du salt nécessaire à l'encryptage
        const salt = await bcrypt.genSalt(10);

        //Encryptage
        const hashedLicense = await bcrypt.hash(license_plate, salt);

        return hashedLicense;
    }

    /**
     * Crée une nouvelle voiture avec les informations récupérées par le controller de User lors de l'inscription,
     * et appelle la méthode createCar() du repository.
     * @param {ObjectId} id_user L'id utilisateur du conducteur
     * @param {string} license_plate L'immatriculation du véhicule
     * @param {string} picture L'image de la voiture saisie par l'utilisateur
     * @returns La voiture créé
     */
    createCar = async (id_user, license_plate, picture, brand, model) => {
        //! immatriculation du véhicule
        license_plate = await this.hashLicense(license_plate);

        //! Traitement de l'image de la voiture
        if (license_plate && picture) {

            //! On vérifie qu'on a bien affaire à une image et pas un .txt un .pdf etc.
            if (picture.mimetype.slice(0, 5) !== "image") { // vérifier si les 5 premiers caractères de la clé mimetype forme le mot 'image'
                throw new Error("You must send a valid image");
            }

            //! import de notre fonction convertToBase64 qui convertit le buffer en base64.
            const convertToBase64 = require("../utils/convertToBase64");

            //! Envoi de l'image convertit à cloudinary
            const result = await cloudinary.uploader.upload(
                convertToBase64(picture),
                {
                    folder: `PointAndGo/Cars`,  //? Dans le dossier suivant
                    public_id: `userCar_${picture.name}`, //? Avec le nom suivant
                }
            );

            picture = result;

            //! Crée une voiture grâce au model
            const newCar = new Car({ id_user, license_plate, picture, brand, model });

            this._repository.createCar(newCar);

            return newCar;
        }
    }

    /**
     * Modifie les informations d'une voiture
     * @param {Number} id L'id de la voiture
     * @param {Object} infoToEdit Les informations à modifier
     * @returns La voiture après modifications
     */
    editCar = async (carId, license_plate, picture, brand, model) => {

        //! On vérifie qu'on a bien affaire à une image et pas un .txt un .pdf etc.
        if (picture.mimetype.slice(0, 5) !== "image") { // vérifier si les 5 premiers caractères de la clé mimetype forme le mot 'image'
            throw new Error("You must send a valid image");
        }

        //! import de notre fonction convertToBase64 qui convertit le buffer en base64.
        const convertToBase64 = require("../utils/convertToBase64");

        //! Envoi de l'image convertit à cloudinary
        const result = await cloudinary.uploader.upload(
            convertToBase64(picture),
            {
                folder: `PointAndGo/Cars`,  //? Dans le dossier suivant
                public_id: `userCar_${picture.name}`, //? Avec le nom suivant
            }
        );
        picture = result;

        // Création de l'objet qui contient les nouvelles informations à mettre à jour
        const infoToEdit = {
            picture: picture,
            brand: brand,
            model: model
        }

        // Si on fournit une license_plate
        if (license_plate != "") {
            license_plate = await this.hashLicense(license_plate);
            infoToEdit.license_plate = license_plate;
        }

        const carEdited = await this._repository.editCar(carId, infoToEdit);
        return carEdited;
    }

    /**
* Récupère la voiture à partir de l'id du conducteur associé via le repository
* @param {Number} userId
* @returns Les données de la voiture du conducteur à l'id correspondant
*/
    getCarByUserId = async (id) => {
        const car = await this._repository.getCarByUserId(id);
        let carInfo = {}
        if (car != null){
            //Crée un nouveau document avec les infos voulues (permet d'afficher model et brand même s'ils n'existent pas)
            carInfo = { _id: car._id, id_user: car.id_user, model: car.model ? car.model : null, brand: car.brand ? car.brand : null, picture: { url: car.picture.url } };
        }
        else {carInfo = null;}

        return carInfo;
    }

    /**
     * Supprime la voiture associée à l'id de l'utilisateur
     * @param {ObjectId} id 
     * @returns Confirmation de suppression
     */
    deleteCarByUserId = async (userId) => {
        return await this._repository.deleteCarByUserId(userId);
    }
}

module.exports = CarService;