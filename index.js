// Importations des librairies
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");
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
serveur.get("/films", authentifier, async (req, res) => {
    try {
        // const films = require("./data/filmsDepart.js");
        const films = [];

        const docRefs = await db.collection("films").get();

        docRefs.forEach((doc) => {
            const film = { id: doc.id, ...doc.data() };
            films.push(film);
        });

        if (films.length == 0) {
            return res.status(404).json({ msg: "Aucun film trouvé" });
        }

        return res.json(films);
    } catch (erreur) {
        return res.status(500).json({ msg: "Une erreur est survenue" });
    }
});

serveur.get("/films/:id", (req, res) => {
    return res.json({ msg: "ok" });
});

serveur.post("/films", (req, res) => {
    return res.json({ msg: "ok" });
});

serveur.post("/films/initialiser", (req, res) => {
    try {
        const films = require("./data/filmsDepart");

        //TODO: Vérifier si le film est déjà dans la base de données

        films.forEach(async (film) => {
            await db.collection("films").add(film);
        });

        return res.status(201).json({ msg: "Base de données initialisée" });
    } catch (erreur) {
        console.log(erreur);

        return res.status(500).json({ msg: "Une erreur est survenue" });
    }
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
