const chatHistoryService = require('../services/chatHistoryService')

class chatHistoryController {

    _service = new chatHistoryService();

    /**
     *  Récupère les informations de la requête et appelle la méthode updateHistory() du service
     */
    updateHistory = async (req, res) => {
        const id = req.params.id;
        const message = req.body;

        try {
            const conversation = await this._service.updateHistory(id, message);
            res.status(200).json(conversation);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error);
        }
    }

    /**
     *  Récupère les informations de la requête et appelle la méthode getOrCreateHistory() du service
     */
    getOrCreateHistory = async (req, res) => {

        const { id_driver, id_passenger, id_journey } = req.body

        try {
            const conversation = await this._service.getOrCreateHistory(id_driver, id_passenger, id_journey);
            res.status(200).json(conversation);
        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error);
        }
    }
}

module.exports = chatHistoryController;