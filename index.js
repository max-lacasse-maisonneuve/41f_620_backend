// Importations des librairies
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");

const serveur = express();
dotenv.config();

serveur.use(express.json()); //Permet de passer de la donnée json dans le body
serveur.use(express.urlencoded({ extended: true })); //Permet de passer de la donnée avec formulaire dans le body

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
serveur.get("/films", async (req, res) => {
    try {
        const { ordre = "titre", direction = "asc", limite = 100, depart = 0 } = req.query;

        const films = [];
        const docRefs = await db
            .collection("films")
            .orderBy(ordre, direction)
            .limit(Number(limite))
            .offset(Number(depart))
            .get();

        docRefs.forEach((doc) => {
            const film = { id: doc.id, ...doc.data() };
            films.push(film);
        });

        if (films.length == 0) {
            return res.status(404).json({ msg: "Aucun film trouvé" });
        }

        return res.status(200).json(films);
    } catch (erreur) {
        return res.status(500).json({ msg: "Une erreur est survenue" });
    }
});

serveur.get("/films/categories/:categorie", async (req, res) => {
    const { categorie } = req.params;
    const films = [];
    console.log(categorie);

    const docRefs = await db.collection("films").where("genres", "array-contains", categorie).get();

    docRefs.forEach((doc) => {
        const film = { id: doc.id, ...doc.data() };
        films.push(film);
    });

    if (films.length == 0) {
        return res.status(404).json({ msg: "Aucun film trouvé" });
    }
    return res.status(200).json(films);
});
serveur.get("/films/realisation/:realisation", async (req, res) => {
    let { realisation } = req.params;

    realisation = realisation.split("-");
    realisation.forEach((morceau, index) => {
        realisation[index] = morceau[0].toUpperCase() + morceau.slice(1);
    });
    realisation = realisation.join(" ");

    const films = [];

    const docRefs = await db.collection("films").where("realisation", "==", realisation).orderBy("realisation").get();

    docRefs.forEach((doc) => {
        const film = { id: doc.id, ...doc.data() };
        films.push(film);
    });

    if (films.length == 0) {
        return res.status(404).json({ msg: "Aucun film trouvé" });
    }
    return res.status(200).json(films);
});
serveur.get("/films/:id", async (req, res) => {
    //Destructuration
    const { id } = req.params;

    const docRef = await db.collection("films").doc(id).get();
    const film = { id: docRef.id, ...docRef.data() };

    return res.json(film);
});

serveur.post("/films", async (req, res) => {
    // const body = req.body;
    const { body } = req;

    await db.collection("films").add(body);

    return res.status(201).json({ msg: "Le film a été ajouté" });
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

serveur.put("/films/:id", async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    await db.collection("films").doc(id).update(body);
    return res.status(201).json({ msg: "Le film a été modifié", film: body });
});

serveur.delete("/films/:id", async (req, res) => {
    const { id } = req.params;

    await db.collection("films").doc(id).delete();
    return res.status(204).json({ msg: "Le film a été supprimé" });
});

//Ressources 404
serveur.use((req, res) => {
    res.statusCode = 404;
    return res.status(404).json({ msg: "Ressource non trouvée" });
});

serveur.listen(process.env.PORT, () => {
    console.log(`le serveur est démarré sur le port ${process.env.PORT}`);
});
