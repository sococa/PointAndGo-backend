const express = require("express");
const fileUpload = require("express-fileupload");

const CarController = require('../controllers/carController');
const _carController = new CarController();

const router = express.Router();

router.get("/car/:userId", _carController.getCarByUserId);

router.patch("/car/edit/:id?", fileUpload(), _carController.editCar);

module.exports = router;