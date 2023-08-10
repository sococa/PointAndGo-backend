const CarService = require('../services/carService');

class CarController {
    _carService = new CarService();

    /**
     * Récupère les infos de la requête et appelle la méthode editCar() du service si une id est fournie,
     * sinon appelle la méthode createCar() du service
     */
    editCar = async (req, res) => {

        const carId = req.params.id;
        const { userId, license_plate, brand, model } = req.body;
        const picture = req.files.picture;

        if (carId) { // Si la voiture existe déjà et qu'on souhaite la modifier
            try {
                const car = await this._carService.editCar(carId, license_plate, picture, brand, model);
                res.status(200).send(car);
            } catch (error) {
                res.status(400).json({ message: error.message });
                console.log(error);
            }
        } else { // Si la voiture n'existe et qu'on souhaite la créer
            try {
                const car = await this._carService.createCar(userId, license_plate, picture, brand, model);
                res.status(200).send(car);
            } catch (error) {
                res.status(400).json({ message: error.message });
                console.log(error);
            }
        }
    } // TEST_DONE

    /**
     * Récupère les informations liées à la voiture de l'utilisateur 
     */
    getCarByUserId = async (req, res) => {

        try {
            const userId = req.params.userId;
            const carInfo = await this._carService.getCarByUserId(userId);
            res.status(200).send(carInfo);
        } catch (error) { res.status(400).json({ message: error.message }); }
    }// TEST_DONE
}

module.exports = CarController;