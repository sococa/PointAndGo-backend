const express = require("express");//Accés serveur

/** npm i express-fileupload 
 * Import de fileupload qui nous permet de recevoir des formdata
 * middleware à placer sur les routes
 * qui auront besoin de réceptionner des fichiers
 */
const fileUpload = require("express-fileupload");

//Import du modéle CRS pour le fonctionnement des routes
const UserRepository = require("../repositories/userRepository")
const UserService = require("../services/userService")
const UserController = require('../controllers/userController')

// Instances de classes
const _repository = new UserRepository();
const _service = new UserService(_repository);
const _controller = new UserController(_service);

const router = express.Router();

// Route pour la création d'un compte utilisateur
router.post("/users/register", fileUpload(), _controller.createUser);

//Route pour l'affichage tout les utilisateurs
router.get("/users/all", _controller.getAllUsers);

//Route pour obtenir les informations de l'utilisateur à l'id correspondant
router.get("/user/:id", _controller.getUserById);

//Route pour obtenir les informations de l'utilisateur à l'email correspondant
router.post("/userByEmail/:email", _controller.getUserByEmail);

// Route pour la connexion
router.post("/users/login", _controller.loginUser);

// Route pour modifier les informations d'un utilisateur
router.patch("/users/edit/:id", fileUpload(), _controller.editUser);

// Route pour vérifier si l'email existe déjà dans la BDD
router.post("/users/verifyEmail", _controller.checkEmailAlreadyExists);

//Route pour ajouter un conducteur aux favoris utilisateur
router.patch("/users/mark/driver", _controller.addMarkUser);

//Route pour retirer un conducteur des favoris utilisateur
router.patch("/users/unmark/driver", _controller.deleteMarkUser);

//Route pour ajouter un trajet aux favoris utilisateur
router.patch("/users/mark/journey", _controller.addMarkJourney);

//Route pour retirer un trajet des favoris utilisateur
router.patch("/users/unmark/journey", _controller.deleteMarkJourney);

//Route pour noter un conducteur
router.patch("/users/rateDriver/:id", _controller.rateDriver);

// Route pour vérifier la validité du token
// router.post("/users/token", _controller.verifyToken);

//Route pour obtenir les informations de l'utilisateur à l'id correspondant
router.get("/userJourneys/passenger/:id", _controller.getPassengerJourneys);

//Route pour obtenir les informations de l'utilisateur à l'id correspondant
router.get("/userJourneys/driver/:id", _controller.getDriverJourneys);

// Route pour supprimer un compte
router.patch("/user/delete/:id", _controller.deleteUser);

// Route pour confirmer l'email utilisateur
router.patch("/user/confirmationEmail/", _controller.confirmEmail);

// Route pour récupérer la liste des utilisateurs avec qui je peux discuter
router.get('/user/chatlist/:id', _controller.getChatList)

module.exports = router;