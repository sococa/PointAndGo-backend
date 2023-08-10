const chatHistoryRepository = require('../repositories/chatHistoryRepository')
const chatHistory = require('../models/ChatHistory')

class chatHistoryService {

    _repository = new chatHistoryRepository();

    /**
     * Met à jour la conversation dans la BDD avec les nouveaux messages
     * @param {ObjectId} id L'id de la conversation
     * @param {Object} message L'objet contenant l'expéditeur (sender), la date et le contenu du message
     * @returns Un status 200 et la conversation
     */
    updateHistory = async (id, message) => {
        const my_regex = /^(?!.*show\s+dbs|use\s+\w+|db\s*|show\s+collections|<([a-z]+\b[^>]*)>)(?:[\p{L}\d\s!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]+|(db\.(?:dropDatabase|find|update|insert|delete)\s\([^)]+\))|.*\d+(?:\.\d{0,2})?\s*(?:€|\w+).*)$/u;

        if (!message.text.match(my_regex)) { throw "Le message contient des mots interdits"; }
        else { return await this._repository.updateHistory(id, message); }
    }

    /**
     * Récupère l'historique d'une conversation s'il existe ou en crée un sinon
     * @param {ObjectId} id_driver L'id du conducteur
     * @param {ObjectId} id_passenger L'id du passager
     * @param {ObjectId} id_journey L'id du trajet
     * @returns La conversation entre deux utilisateurs
     */
    getOrCreateHistory = async (id_driver, id_passenger, id_journey) => {
        return await this._repository.getOrCreateHistory(id_driver, id_passenger, id_journey);
    }
}

module.exports = chatHistoryService