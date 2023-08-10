const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../server');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const basePath = "src/_tests/img"
const car_image = path.resolve(basePath, 'Opel-Astra-Transparent-PNG.png')
const wrong_format_picture = path.resolve(basePath, "The White Stripes - 'Seven Nation Army' - Copie.mp3")

a = 0
beforeEach(async () => {
    await mongoose.connect(process.env.DBTEST_URI);
    app.listen(a + 2300);
    a++
});

describe("Je teste la méthode getCarByUserId() ", () => {

    describe("Avec un userId valide", () => {

        it("Doit retourner les info de la voiture correspondant à l'id user", async () => {

            const res = await request(app).get("/car/6463429e001930f4d18c63a2");
            expect(res.statusCode).toBe(200);

            expect(res.body).toStrictEqual({
                _id: "6464eaf0e23c3c25802a0338",
                id_user: "6463429e001930f4d18c63a2",
                model: "Clio",
                brand: "Renault_Client1",
                picture: {
                    url: "http://res.cloudinary.com/dlodqal4h/image/upload/v1684335132/PointAndGo/Cars/userCar_375709_449491648415649_1742297242_n.jpg.jpg"
                }
            });

        });//fin it

    });// fin describe Id valide

    describe("Avec un userId invalide", () => {

        it("Doit retourner une erreur 400", async () => {
            const res = await request(app).get("/car/6463429e001930f4d1");
            expect(res.statusCode).toBe(400);
        }); //fin it

    });//fin describe Id invalide

});// fin describe fonction getCarByUserId

describe("Je teste la méthode editCar", () => {

    describe("Je ne renseigne pas d'id afin de créer une voiture", () => {

        describe("Je renseigne toutes les informations de la voiture", () => {

            it("Doit retourner un statut 200 avec une voiture crée pour un utilisateur", async () => {

                const res = await request(app).patch("/car/edit/")
                    .field("userId", "6463429e001930f4d18c63a2")
                    .field("license_plate", "RX-333-TP")
                    .field("model", "test Astra")
                    .field("brand", "dossier img")
                    .attach("picture", fs.createReadStream(car_image));

                expect(res.statusCode).toBe(200);
                expect(res.body.model).toBe('test Astra');
                expect(res.body.id_user).toBe("6463429e001930f4d18c63a2");

            })  //fin it

        }) // fin describe cas valide

        describe("Je ne renseigne pas ou je renseigne mal les informations de la voiture", () => {

            it("Doit retourner un statut 400 avec une erreur", async () => {

                const res = await request(app).patch("/car/edit/")
                    .field("userId", "6463429e001930f4d18c63a2")
                    .field("model", "test Astra")
                    .attach("picture", fs.createReadStream(car_image));

                expect(res.statusCode).toBe(400);

            }) //fin it

        }) //fin describe cas invalide

        describe("Je renseigne une image au mauvais format", () => {

            it("Doit retourner un statut 400 avec une erreur", async () => {

                const res = await request(app).patch("/car/edit/")
                    .field("userId", "6463429e001930f4d18c63a2")
                    .field("license_plate", "RX-333-TP")
                    .field("model", "test Astra")
                    .field("brand", "dossier img")
                    .attach("picture", fs.createReadStream(wrong_format_picture));

                expect(res.statusCode).toBe(400);
                expect(res.body).toEqual({
                    message: 'You must send a valid image',
                });

            }) //fin it

        }) //fin describe cas invalide

    })//fin describe création de voiture

    describe("Je renseigne un id utilisateur afin de modifier une voiture", () => {

        describe("Je renseigne toutes les informations de la voiture", () => {

            it("Doit retourner un statut 200 avec la voiture de l'utilisateur modifiée", async () => {

                const res = await request(app).patch("/car/edit/646de7dcf682acb5431102e3")
                    .field("license_plate", "XC-937-TD")
                    .field("model", "test Volskwagen")
                    .field("brand", "on s'en fout")
                    .attach("picture", fs.createReadStream(car_image));

                expect(res.statusCode).toBe(200);
                expect(res.body.modifiedCount).toBe(1);
                expect(res.body.acknowledged).toBe(true);
                expect(res.body.matchedCount).toBe(1);

            }) // fin it cas valide

        })//fin describe cas valide

        describe("L'id de la voiture n'est pas valide", () => {

            it("Doit retourner une erreur 400", async () => {

                const res = await request(app).patch("/car/edit/646de7dcf682acb5431102")
                    .field("license_plate", "XC-937-TD")
                    .field("model", "test Volskwagen")
                    .field("brand", "on s'en fout")
                    .attach("picture", fs.createReadStream(car_image));

                expect(res.statusCode).toBe(400);

            })//fin it cas invalide

        })// fin describe cas invalide

        describe("Je renseigne une image au mauvais format", () => {

            it("Doit retourner un statut 400 avec une erreur", async () => {

                const res = await request(app).patch("/car/edit/646de7dcf682acb5431102e3")
                    .field("license_plate", "RX-333-TP")
                    .field("model", "test Astra")
                    .field("brand", "dossier img")
                    .attach("picture", fs.createReadStream(wrong_format_picture));

                expect(res.statusCode).toBe(400);
                expect(res.body).toEqual({
                    message: 'You must send a valid image',
                });

            }) //fin it

        }) //fin describe cas invalide

    })// fin describe modificaton de voiture

}) //fin describe fonction editCar

afterEach(async () => {
    await mongoose.connection.close();
});

// COMMENTAIRES :

// Ignorer carService lignes 48,126 (sont couvertes mais apparaissent lorsqu'on test les 2 méthodes avec une image au mauvais format)