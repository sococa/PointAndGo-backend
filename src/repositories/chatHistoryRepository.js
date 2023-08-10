const chatHistory = require('../models/ChatHistory')

class chatHistoryRepository {

    /**
      * Met à jour la conversation dans la BDD avec les nouveaux messages
      * @param {ObjectId} id L'id de la conversation
      * @param {Object} message L'objet contenant l'expéditeur (sender), la date et le contenu du message
      * @returns Un status 200 et la conversation
    */
    updateHistory = async (id, message) => {
        return await chatHistory.findOneAndUpdate(
            { _id: id }, { $push: { message: message } }
        );
    }

    /**
      * Récupère l'historique d'une conversation s'il existe ou en crée un dans la BDD
      * @param {ObjectId} id_driver L'id du conducteur
      * @param {ObjectId} id_passenger L'id du passager
      * @param {ObjectId} id_journey L'id du trajet
      * @returns La conversation entre deux utilisateurs
    */
    getOrCreateHistory = async (id_driver, id_passenger, id_journey) => {
        const convHistory = await chatHistory.findOne(
            {
                $and: [
                    { id_journey: id_journey },
                    { id_driver: id_driver },
                    { id_passenger: id_passenger }
                ]
            }
        )

        if (convHistory != null) {
            return convHistory;
        }
        else {
            const newHistory = new chatHistory({
                id_driver: id_driver,
                id_passenger: id_passenger,
                id_journey: id_journey
            })
            return await newHistory.save();
        }
    }
}

module.exports = chatHistoryRepository