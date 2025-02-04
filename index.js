// Importations des librairies
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const serveur = express();
dotenv.config();

//Permettre l'accès au dossier
const dossierPublic = path.join(__dirname, "public");
serveur.use(express.static(dossierPublic));

//Middleware
function authentifier(req, res, next) {
    console.log("Authentification en cours");
    next();
}

//Routes
/**
 * Route servant à récuperer tous les films de la base de données
 */
serveur.get("/films", authentifier, (req, res) => {
    return res.json({ msg: "ok" });
});

serveur.get("/films/:id", (req, res) => {
    return res.json({ msg: "ok" });
});

serveur.post("/films", (req, res) => {
    return res.json({ msg: "ok" });
});

serveur.post("/films/initialiser", authentifier, (req, res) => {
    return res.json({ msg: "ok" });
});

serveur.put("/films/:id", (req, res) => {
    return res.json({ msg: "ok" });
});

serveur.delete("/films/:id", (req, res) => {
    return res.json({ msg: "ok" });
});

//Ressources 404
serveur.use((req, res) => {
    res.statusCode = 404;
    return res.status(404).json({ msg: "Ressource non trouvée" });
});

serveur.listen(process.env.PORT, () => {
    console.log(`le serveur est démarré sur le port ${process.env.PORT}`);
});
