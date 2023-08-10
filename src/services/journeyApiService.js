require("dotenv").config();

class JourneyApiService {

    // Fonction pour convertir des degrés en radian
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Fonction pour calculer la distance entre deux points géographiques
    calculateDistance(departureCity, arrivalCity) {
        let lat1 = departureCity.latitude;
        let lon1 = departureCity.longitude;
        let lat2 = arrivalCity.latitude;
        let lon2 = arrivalCity.longitude;

        let R = 6371; // Rayon de la Terre en kilomètres
        let dLat = this.deg2rad(lat2 - lat1);
        let dLon = this.deg2rad(lon2 - lon1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c;

        return distance.toFixed(2);
    }

    /**
     * Récupère les informations pour un trajet entre deux villes
     * @param {String} departureCity 
     * @param {String} arrivalCity 
     * @returns La latitude, longitude, code postal et distance entre deux villes
     */
    getTravelInfo = async (departureCity, arrivalCity) => {
        // Clé d'API OpenCage Geocoding
        let apiKey = process.env.JOURNEY_API_KEY;

        // Définir l'url pour récupérer les infos de la ville de départ
        let url = process.env.JOURNEY_API_URL;
        url += 'key=' + apiKey;
        url += '&q=' + encodeURIComponent(departureCity);

        // Création des variables pour stocker les resultats
        let departureInfo;
        let arrivalInfo;

        // Requête HTTP pour le départ
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                // Extraire les coordonnées de la ville de départ
                departureInfo = {
                    latitude: data.results[0].geometry.lat,
                    longitude: data.results[0].geometry.lng,
                    zip_code: data.results[0].components.postcode
                };
            })
            .catch(error => {
                console.log('Une erreur s\'est produite:', error);
            });

        // Définir l'url pour récupérer les infos de la ville d'arrivée
        url = process.env.JOURNEY_API_URL;
        url += 'key=' + apiKey;
        url += '&q=' + encodeURIComponent(arrivalCity);

        // Requête HTTP pour l'arrivée
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                // Extraire les coordonnées de la ville d'arrivée
                arrivalInfo = {
                    latitude: data.results[0].geometry.lat,
                    longitude: data.results[0].geometry.lng,
                    zip_code: data.results[0].components.postcode
                };
            })
            .catch(error => {
                console.log('Une erreur s\'est produite:', error);
            });

        // Calculer la distance en utilisant les coordonnées géographiques
        const journeyDistance = this.calculateDistance(departureInfo, arrivalInfo);

        // Création de l'objet à renvoyer
        const journeyInfo = {
            departure: departureInfo,
            arrival: arrivalInfo,
            distance: journeyDistance
        }
        return journeyInfo;
    }
}

module.exports = JourneyApiService;