const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../server');
require("dotenv").config();
const ObjectId = require('mongoose').Types.ObjectId;
const JourneyController = require('../../controllers/journeyController')

const _journeyController = new JourneyController();

c = 0
beforeEach(async () => {
    await mongoose.connect(process.env.DBTEST_URI);
    app.listen(c + 2400);
    c++;
});

describe("Je teste la méthode createJourney()", () => {

    describe("Je renseigne toutes les informations", () => {

        it("Doit retourner un statut 200 et créer un trajet", async () => {

            const res = await request(app).post("/journey/publish")
                .send({
                    driver: "6463429e001930f4d18c63a2",
                    car_seats: 4,
                    small_luggage: 3,
                    big_luggage: 2,
                    route_price: 50,
                    departure: {
                        d_city: "Bordeaux"
                    },
                    arrival: {
                        a_city: "Paris",
                    },
                    departure_date: "2023-07-15",
                    preferences_options: {
                        "silence": "Veut du silence",
                        "music": ["Rock", "Variété"],
                        "smoker": "Tolère la fumée",
                        "animals": false,
                        "material": "Possède un porte vélo"
                    },
                    prm_compatible: true
                });

            expect(res.status).toBe(200);
            expect(res.body.car_seats).toBe(4);
            expect(res.body.preferences_options).toStrictEqual({
                "silence": "Veut du silence",
                "music": ["Rock", "Variété"],
                "smoker": "Tolère la fumée",
                "animals": false,
                "material": "Possède un porte vélo"
            });

        });//fin it

    })

    describe("Je ne renseigne pas toutes les informations", () => {

        it("Doit retourner un statut 400 et une erreur", async () => {

            const res = await request(app).post("/journey/publish")
                .send({
                    driver: "6463429e001930f4d18c63a2",
                    car_seats: 4,
                    small_luggage: 3,
                    big_luggage: 2,
                    preferences_options: {
                        "silence": "Veut du silence",
                        "music": ["Rock", "Variété"],
                        "smoker": "Tolère la fumée",
                        "animals": false,
                        "material": "Possède un porte vélo"
                    },
                    prm_compatible: true
                });

            expect(res.status).toBe(400);

        });//fin it

    })

}); // fin describe 

describe("Je test la fonction editJourney()", () => {

    describe("Je renseigne une id valide et des informations à modifier", () => {

        it("Doit retourner un statut 200 et un trajet modifié", async () => {

            const res = await request(app).patch("/journey/edit/646b3f37df9d80875d13fa49")
                .send({
                    car_seats: 6,
                    passenger: [
                        "64566e5b9f53b5d5bc937bc6", "645674975bfc2e46c5593a28"
                    ]
                });

            expect(res.statusCode).toBe(200);

        });//fin it

    })

    // describe("Je renseigne une id invalide", () => {

    //     it("Doit retourner une erreur avec un statut 400", async () => {

    //         const res = await request(app).patch("/journey/edit/646b3f37df9d80875d13fa48")
    //             .send({
    //                 car_seats: 6,
    //                 passenger: [
    //                     "64566e5b9f53b5d5bc937bc6", "645674975bfc2e46c5593a28"
    //                 ]
    //             });

    //         expect(res.statusCode).toBe(400);

    //     });//fin it
    // })
});

describe("Je test la fonction cancelReservation()", () => {

    describe("Je renseigne toutes les informations", () => {

        it("Doit retourner un status 200 ", async () => {

            const res = await request(app).patch("/journey/cancel/").send({
                journeyId: "646b3f37df9d80875d13fa49",
                passengerId: "6478ab78485fdc5c62edc442",
                driverId: "6463429e001930f4d18c63a2",
                newPassengerList: [],
                editPoints: "33",
            })

            expect(res.status).toBe(200);
        });
    })

    describe("Je renseigne des informations invalides", () => {

        it("Doit retourner une erreur et un status 400", async () => {

            const res = await request(app).patch("/journey/cancel/").send({
                journeyId: "646b3f37df9d80875d13",
                passengerId: "6478ab78485fdc5c62ed",
                driverId: "6463429e001930f4d18",
                newPassengerList: [],
                editPoints: "33",
            })

            expect(res.status).toBe(400);

        });
    })
});

describe("Je test la fonction getJourneyByFilters()", () => {

    describe("Je renseigne une ville de départ, une date de départ et un nombre de places", () => {

        it("Doit retourner une liste de trajets et un statut 200", async () => {

            const res = await request(app).get("/journeys?a_city=Paris&departure_date=2023-07-15&d_city=Bordeaux&car_seats=1")

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].car_seats).toBeGreaterThan(1);
            expect(res.body[0].departure.d_city).toBe("Bordeaux");
            expect(res.body[0].arrival.a_city).toBe("Paris");

        });//fin it

    })

    describe("Je ne renseigne pas toutes les informations requises", () => {

        it("Doit retourner un tableau vide", async () => {

            const res = await request(app).get("/journeys?departure_date=2023-07-15&d_city=Bordeaux")

            expect(res.body.length).toBe(0);
        });//fin it
    })
});

describe("Je test la fonction getJourneyInfo()", () => {

    describe("Je renseigne un id valide", () => {

        it("Doit retourner les informations du trajet, du conducteur et de sa voiture", async () => {

            const res = await request(app).get("/journey/646b3f37df9d80875d13fa49")

            expect(res.statusCode).toBe(200);
            expect(res.body.journeyInfo.car_seats).toBe(6);
            expect(res.body.driverInfo.firstname).toBe("client1");
            expect(res.body.driverCarInfo.brand).toBe("Renault_Client1");

        });//fin it

    })

    describe("Je renseigne un id invalide", () => {

        it("Doit retourner une erreur et un statut 400", async () => {

            const res = await request(app).get("/journey/646b3f37df9d80875")

            expect(res.statusCode).toBe(400);

        });//fin it
    })
});

describe("Je test la fonction getLastThreeJourneys()", () => {

    it("Doit retourner un tableau avec les 3 derniers trajets de la BDD", async () => {

        const res = await request(app).get("/lastpostedjourneys")

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(3);
        expect(res.body[1].car_seats).toBe(4);
        expect(res.body[0].departure.d_city).toBe("Bordeaux");
        expect(res.body[0].arrival.a_city).toBe("Paris");

    });//fin it

});

describe("Je test la fonction checkCarSeatNumber()", () => {

    describe("Je renseigne un id valide", () => {

        it("Doit retourner le nombre de places disponibles sur le trajet", async () => {

            const res = await request(app).get("/journey/availablecarseat/646b3f37df9d80875d13fa49")

            expect(res.statusCode).toBe(200);
            expect(res.body).toBe(4);

        });//fin it

    })

    describe("Je renseigne un id invalide", () => {

        it("Doit retourner une erreur et un statut 400", async () => {

            const res = await request(app).get("/journey/availablecarseat/647f3392df9d")

            expect(res.statusCode).toBe(400);

        });//fin it
    })
});

describe("Je test la fonction deleteJourney()", () => {

    //
    // Il faudrait supprimer un trajet avec des vraies infos, mais ça ne fonctionnera qu'une seule fois
    //

    // describe("Je renseigne une id valide", () => {

    //     it("Doit retourner un status 200", async () => {

    //         const req = { params: { id: '64917e212f7d23d21312716a' } };

    //         const res = await request(app).delete("/journey/delete/64917e212f7d23d21312716a")

    //         // expect(res.statusCode).toBe(200)
    //         expect(_journeyController.deleteJourney()).toHaveBeenCalledWith("64917e212f7d23d21312716a")
    //     });
    // })

    describe("Je renseigne une id invalide", () => {

        it("Doit retourner une erreur et un status 400", async () => {

            const res = await request(app).delete("/journey/delete/64917e212f7d23d21312716a")

            expect(res.statusCode).toBe(400)
        });
    })
});

afterEach(async () => {
    await mongoose.connection.close();
});

// COMMENTAIRES :

// Ignorer dans journeyController :

// catch editJourney
// getJourneyByFilters
// catch getLastThreeJourneys

// (car impossible d'obtenir le statut 400)