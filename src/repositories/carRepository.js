const Car = require('../models/Car')

class CarRepository {

    /**
     * Récupère la voiture crée par le service et l'ajoute à la BDD.
     * @param {Car} newCar La voiture à ajouter à la BDD
     * @returns La voiture ajoutée à la BDD
     */
    createCar = async (newCar) => {

        await newCar.save();
        return newCar;
    }

    /**
     * Modifie les informations d'une voiture
     * @param {Number} id L'id de la voiture
     * @param {Object} infoToEdit Les informations à modifier
     * @returns La voiture après modifications
     */
    editCar = async (id, infoToEdit) => {
        return await Car.updateOne({ _id: id }, infoToEdit)
    }

    /**
    * Récupère la voiture à partir de l'id du conducteur associé
    * @param {ObjectId} userId
    * @returns Les données de la voiture du conducteur à l'id correspondant
    */
    getCarByUserId = async (userId) => {
        return await Car.findOne({ id_user: userId });
    }

    /**
    * Supprime la voiture appartenant à l'id du conducteur associé
    * @param {ObjectId} userId
    * @returns La confirmation de suppression de la voiture du conducteur à l'id correspondant
    */
    deleteCarByUserId = async (userId) => {
        return await Car.deleteOne({ id_user: userId });
    }
}

module.exports = CarRepository;