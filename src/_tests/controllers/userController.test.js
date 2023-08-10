const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../server');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const basePath = "src/_tests/img"
const car_image = path.resolve(basePath, 'Opel-Astra-Transparent-PNG.png')
const wrong_format_picture = path.resolve(basePath, "The White Stripes - 'Seven Nation Army' - Copie.mp3")

d = 0
beforeEach(async () => {
    await mongoose.connect(process.env.DBTEST_URI);
    app.listen(d + 2480);
    d++;
});

describe("Je test la fonction createUser()", () => {

    describe("Toutes les informations de l'utilisateur sont renseignées correctement", () => {

        it("Doit retourner un statut 200 avec un utilisateur créé sans voiture", async () => {

            const res = await request(app).post("/users/register")
                .send({
                    firstname: "jest",
                    lastname: "coverage",
                    email: "jest@coverage.com",
                    password: "jestcoverage",
                    birthday: "2023-07-21",
                    handicap: false
                })

            expect(res.body);
            expect(res.statusCode).toBe(200);

        });//fin it

    }) //fin describe

    describe("Toutes les informations de l'utilisateur et de la voiture sont renseignées correctement", () => {

        it("Doit retourner un statut 200 avec un utilisateur créé avec une voiture", async () => {

            const res = await request(app).post("/users/register")
                .field("firstname", "jest")
                .field("lastname", "coverage")
                .field("email", "jest@coverage.com")
                .field("password", "jestcoverage")
                .field("birthday", "2023-07-21")
                .field("handicap", false)
                .field("license_plate", "TX-340-RC")
                .field("brand", "Nethe")
                .field("model", "KAM-IO")
                .attach("picture", fs.createReadStream(car_image));

            expect(res.body);
            expect(res.statusCode).toBe(200);

        });//fin it

    }) // fin describe

    describe("Le champ picture reçoit un fichier au mauvais format", () => {

        it("Doit retourner un statut 400 avec une erreur", async () => {

            const res = await request(app).post("/users/register")
                .field("firstname", "jest")
                .field("lastname", "coverage")
                .field("email", "jest@coverage.com")
                .field("password", "jestcoverage")
                .field("birthday", "2023-07-21")
                .field("handicap", false)
                .field("license_plate", "TX-340-RC")
                .field("brand", "Nethe")
                .field("model", "KAM-IO")
                .attach("picture", fs.createReadStream(wrong_format_picture));

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                message: 'You must send a valid image',
            });

        });//fin it

    }) // fin describe
})

describe("Je test la fonction editUser()", () => {

    describe("Je renseigne les bonnes informations, sans fournir de photo", () => {

        it("Doit retourner un status 200", async () => {

            const res = await request(app).patch("/users/edit/64804308a4f6eab132ccfc49")
                .send({
                    firstname: "jest",
                    lastname: "coverage",
                    email: "jest@coverage.com",
                    password: "jestcoverage",
                    birthday: "2023-07-21",
                    verify_email: true
                })

            expect(res.statusCode).toBe(200);
            // expect(res.body);
        });
    })

    describe("Je renseigne des mauvaise informations, sans fournir de photo", () => {

        it("Doit retourner une erreur et un status 400", async () => {

            const res = await request(app).patch("/users/edit/64804308a4f6eab132ccfc49")
                .send({
                    firstname: 44,
                    lastname: "coverage",
                    email: false,
                    password: "jestcoverage",
                    birthday: "att",
                    verify_email: "test"
                })

            expect(res.statusCode).toBe(400);
            // expect(res.body);
        });
    })

    describe("Je renseigne les bonnes informations et je fournis une photo", () => {

        it("Doit retourner un status 200", async () => {

            const res = await request(app).patch("/users/edit/64804308a4f6eab132ccfc49")
                .field("firstname", "jestEdit")
                .field("lastname", "coverageEdit")
                .field("email", "jest@coverage.com")
                .field("password", "jestcoverage")
                .field("birthday", "2023-07-21")
                .field("pay_points", "3000")
                .attach("avatar", fs.createReadStream(car_image));

            expect(res.statusCode).toBe(200);
        });
    })

    describe("Je renseigne les bonnes informations mais je fournis une photo au mauvais format", () => {

        it("Doit retourner une erreur et un status 400", async () => {

            const res = await request(app).patch("/users/edit/64804308a4f6eab132ccfc49")
                .field("firstname", "jestEdit")
                .field("lastname", "coverageEdit")
                .field("email", "jest@coverage.com")
                .field("password", "jestcoverage")
                .field("birthday", "2023-07-21")
                .field("pay_points", "3000")
                .attach("avatar", fs.createReadStream(wrong_format_picture));

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                message: 'You must send a valid image',
            });
        });
    })
});

describe("Je test la fonction loginUser()", () => {

    describe("Je renseigne les bonnes informations", () => {

        it("Doit retourner un status 200", async () => {

            const res = await request(app).post("/users/login").send({
                email: "jest@coverage.com",
                password: "jestcoverage"
            })

            expect(res.statusCode).toBe(200);
        });
    })

    describe("Je renseigne des informations invalides", () => {

        it("Doit retourner une erreur et un status 400", async () => {

            const res = await request(app).post("/users/login").send({
                email: "jest@coge.cm",
                password: "jesrage"
            })

            expect(res.statusCode).toBe(400);
        });
    })
});

describe("Je test la fonction getUserById()", () => {

    describe("Je renseigne un id valide", () => {

        it("Doit retourner un status 200", async () => {

            const res = await request(app).get("/user/6463429e001930f4d18c63a2")

            expect(res.statusCode).toBe(200);
            expect(res.body.firstname).toBe("client1");
            expect(res.body.lastname).toBe("NE_PAS_EFFACER");
            expect(res.body.email).toBe("PGO.usager1@gmail.com");
        });

    })

    describe("Je renseigne un id invalide", () => {

        it("Doit retourner un erreur et un status 400", async () => {

            const res = await request(app).get("/user/64429e0019303a2")

            expect(res.statusCode).toBe(400);
        });
    })
});

describe("Je test la fonction checkEmailAlreadyExists()", () => {

    describe("Je renseigne un email valide, qui existe", () => {

        it("Doit retourner un status 200", async () => {

            const res = await request(app).post("/users/verifyEmail").send({
                email: "PGO.usager1@gmail.com"
            })

            expect(res.statusCode).toBe(200);
            expect(res.body).toBe(true);
        });
    })

    describe("Je renseigne un email valide, qui n'existe pas", () => {

        it("Doit retourner un status 200", async () => {

            const res = await request(app).post("/users/verifyEmail").send({
                email: "PGO.usager1@gmail.comzaze"
            })

            expect(res.statusCode).toBe(200);
            expect(res.body).toBe(false);
        });
    })

    describe("Je renseigne un id invalide", () => {

        it("Doit retourner une erreur et un status 400", async () => {

            const res = await request(app).post("/users/verifyEmail").send({
                email: { lastname: "test" }
            })

            expect(res.statusCode).toBe(400);
        });
    })
});

describe("Je test la fonction getPassengerJourneys()", () => {

    describe("Je renseigne un id passager valide", () => {

        it("Doit retourner un status 200", async () => {

            const res = await request(app).get("/userJourneys/passenger/6463429e001930f4d18c63a2")

            expect(res.statusCode).toBe(200);
        });
    })

    describe("Je renseigne un id passager invalide", () => {

        it("Doit retourner une erreur et un status 400", async () => {

            const res = await request(app).get("/userJourneys/passenger/6463429e0018c63a2")

            expect(res.statusCode).toBe(400);
        });
    })
});

describe("Je test la fonction getDriverJourneys()", () => {

    describe("Je renseigne un id driver valide", () => {

        it("Doit retourner un status 200", async () => {

            const res = await request(app).get("/userJourneys/driver/6463455cca3f1b32ad7514c6")

            expect(res.statusCode).toBe(200);
        });
    })

    describe("Je renseigne un id driver invalide", () => {

        it("Doit retourner une erreur et un status 400", async () => {

            const res = await request(app).get("/userJourneys/driver/6463429e0018c63a2")

            expect(res.statusCode).toBe(400);
        });
    })
});

describe("Je test la fonction deleteUser()", () => {

    // Comportement bizarre, "MongoNetworkError: connection establishment was cancelled"

    // describe("Je renseigne un id valide", () => {

    //     it("Doit retourner un status 200", async () => {

    //         const res = await request(app).patch("/user/delete/6463429e001930f4d18c63a2")

    //         expect(res.statusCode).toBe(200);
    //     });
    // })

    describe("Je renseigne un id invalide", () => {

        it("Doit retourner une erreur et un status 400", async () => {

            const res = await request(app).patch("/user/delete/64634291930fc63a2")

            expect(res.statusCode).toBe(400);
        });
    })
});

describe("Je test la fonction confirmEmail()", () => {

    describe("Je renseigne un id valide", () => {

        it("Doit retourner un status 200", async () => {

            const res = await request(app).patch("/user/confirmationEmail").send({
                id: "6463429e001930f4d18c63a2"
            })

            expect(res.statusCode).toBe(200);
        });

    })

    describe("Je renseigne un id invalide", () => {

        it("Doit retourner une erreur et un status 400", async () => {

            const res = await request(app).patch("/user/confirmationEmail").send({
                id: { lastname: "test" }
            })

            expect(res.statusCode).toBe(400);
        });
    })
});

afterEach(async () => {
    await mongoose.connection.close();
});
