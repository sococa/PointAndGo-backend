const express = require("express"); // import du serveur Express
const app = express(); //création du serveur
require("dotenv").config(); // Pour activer les variables d'environnement qui se trouvent dans le fichier `.env`
const cors = require("cors"); // pr autoriser ou non les demandes provenant de l'extérieur.
const mongoose = require("mongoose"); // méthodes pour gérer la BDD MongoDB
const cloudinary = require("cloudinary").v2; // npm i cloudinary . On n'oublie pas le `.v2` à la fin

const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const { createServer } = require("http");
const httpServer = createServer(app);

app.use(express.json()); // pr récupérer les paramètres de type Body
app.use(cors(corsOptions));

const corsOptions = {
  origin: 'https://pointandgo-frontend-alpha.vercel.app',
}

const io = new Server(httpServer, {
  cors: {
    origin: corsOptions.origin,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
    optionsSuccessStatus: 200
  },
});

function generateUniqueID() {
  return uuidv4();
}

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);
  socket.on("CLIENT_MSG", (data) => {
    const message = {
      id: generateUniqueID(), // Utilisation de l'ID unique du socket comme identifiant du message
      ...data,
    };
    console.log("msg=", message);
    io.emit("SERVER_MSG", message); //tester avec .broadcast
  });
});

//! connexion à la BDD
const DatabaseConnexion = () => {
  try {
    mongoose.set("strictQuery", false);
    if (process.argv[1].includes("jest")) {
      mongoose.connect(process.env.DBTEST_URI);
      console.log("connected to TEST database 🗃️");
    } else {
      mongoose.connect(process.env.MONGODB_URI);
      console.log("connected to database 🗃️");
    }
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
DatabaseConnexion();

//! Connexion à l'espace de stockage cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//! import des routes
const user = require("./src/routes/user");
const journey = require("./src/routes/journey");
const payment = require("./src/routes/payment");
const car = require("./src/routes/car");
const email = require("./src/routes/email");
const comments = require("./src/routes/comments");
const chatHistory = require("./src/routes/chatHistory");
const flagComment = require("./src/routes/flagComment");

app.use(user);
app.use(journey);
app.use(car);
app.use(email);
app.use(payment);
app.use(comments);
app.use(chatHistory);
app.use(flagComment);

app.get("/", (req, res) => {
  res.json("👩‍💻 Bienvenue sur le serveur Point&Go 🔥");
});

app.all("*", (req, res) => {
  // route qui va envoyer une erreur 404 en cas de mauvaise URL
  res
    .status(404)
    .json({ message: "⚠️ Oh no ! This route doesn't exist ! ( ´•̥×•̥` )" });
});

if (!process.argv[1].includes("jest"))
  httpServer.listen(process.env.PORT || 3100, () => {
    console.log("(๑•͈ᴗ•͈)  ├┬┴┬┴ Server started ┬┴┬┴┤  🚀 ");
  });

module.exports = app;
