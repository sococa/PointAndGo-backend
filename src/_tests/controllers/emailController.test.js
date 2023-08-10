const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../server');
require("dotenv").config();

b = 0
beforeEach(async () => {
    await mongoose.connect(process.env.DBTEST_URI);
    app.listen(b + 2350);
    b++;
});

describe("Je teste la méthode sendEmail() ", () => {

    describe("Avec un email valide", () => {

        it("Doit retourner un statut 200 avec confirmation d'envoi", async () => {

            const res = await request(app).post("/reservationEmail")
                .send({
                    passengerEmail: "pgo.usager1@gmail.com",
                    driverEmail: "pgo.usager2@gmail.com",
                    reservedSeats: 3,
                    departureCity: "Lille",
                    arrivalCity: "Bordeaux",
                    departureDate: "2023-07-15"
                });
            expect(res.statusCode).toBe(200);
            expect(res.text).toStrictEqual("Réservation validée");

        });//fin it

    }); // fin describe mail valide

    describe("Avec un email conducteur invalide", () => {

        it("Doit retourner un statut 400", async () => {

            const res = await request(app).post("/reservationEmail")
                .send({
                    passengerEmail: "j.doe@gmail.com",
                    driverEmail: { driver: "jacques" },
                    reservedSeats: 3,
                    departureCity: "Lille",
                    arrivalCity: "Bordeaux",
                    departureDate: "2023-07-15"
                });
            expect(res.statusCode).toBe(400);

        });//fin it

    }); // fin describe mail conduteur invalide

    describe("Avec un email passager invalide", () => {

        it("Doit retourner un statut 400", async () => {

            const res = await request(app).post("/reservationEmail")
                .send({
                    passengerEmail: { passenger: "john" },
                    driverEmail: "j.doe@gmail.com",
                    reservedSeats: 3,
                    departureCity: "Lille",
                    arrivalCity: "Bordeaux",
                    departureDate: "2023-07-15"
                });
            expect(res.statusCode).toBe(400);

        });//fin it

    }); // fin describe mail passager invalide

}); // fin describe fonction sendEmail

afterEach(async () => {
    await mongoose.connection.close();
});

// COMMENTAIRES :

// Ignorer emailService ligne 47 (car comportement inexplicable)