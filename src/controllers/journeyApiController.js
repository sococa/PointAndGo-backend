const ApiService = require("../services/journeyApiService");

class journeyApiController {

    _ApiService = new ApiService();

    /**
     * Récupère les infos de la requête et appelle la méthode getTravelInfo() du service
     */
    getTravelInfo = async (req, res) => {
        const departureCity = req.body.departureCity;
        // const departureAddress = req.body.departureAddress;
        const arrivalCity = req.body.arrivalCity;
        // const arrivalAddress = req.body.arrivalAddress;

        try {
            const travelInfo = await this._ApiService.getTravelInfo(departureCity, arrivalCity);
            res.status(200).json(travelInfo);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error);
        }
    }
}

module.exports = journeyApiController;