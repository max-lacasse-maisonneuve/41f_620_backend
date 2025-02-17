// Importations des librairies
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");

//Importation de la librairie de date
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
//On charge le module pour la langue
require("dayjs/locale/fr");
dayjs.locale("fr"); //On change la langue
//On importe le module pour la date universelle
dayjs.extend(utc);

const { check, validationResult } = require("express-validator");
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
serveur.get(
    "/films",
    [
        check("ordre").escape().trim().optional().isLength({ max: 100 }),
        check("direction").escape().trim().optional().isIn(["asc", "desc"]),
    ],
    async (req, res) => {
        try {
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                console.log(validationErrors);

                return res.status(400).json({ msg: "Données invalides" });
            }

            //TEST de date
            // const date = dayjs("2025-02-17T15:30:03Z");
            // console.log(date.format("Jour:dddd le DD MM YYYY"));

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
    }
);

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

serveur.get(
    "/films/:id",
    [
        check("id")
            .escape()
            .trim()
            .notEmpty()
            .isString()
            .isLength({ min: 22, max: 22 })
            .matches(/([A-z0-9\-\_]){22}/),
    ],
    async (req, res) => {
        //Destructuration
        const { id } = req.params;
        const docRef = await db.collection("films").doc(id).get();
        const film = { id: docRef.id, ...docRef.data() };

        return res.json(film);
    }
);

serveur.post(
    "/films",
    [
        check("titre").escape().trim().notEmpty().isLength({ max: 300 }).withMessage("Le titre est obligatoire"),
        check("genres").escape().trim().exists().isArray().withMessage("Le titre est obligatoire"),
        check("description").escape().trim().notEmpty().isLength({ max: 2000 }),
    ],
    async (req, res) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            console.log(validationErrors);

            return res.status(400).json({ msg: "Données invalides", validationErrors });
        }
        // const body = req.body;
        const { body } = req;

        //On récupère la date de la requête
        let dateModif = dayjs();
        //On enregistre au format universel et on l'ajoute au corps de la requête
        body.dateModif = dateModif.utc().format();
        // console.log(dateModif);
        await db.collection("films").add(body);

        return res.status(201).json({ msg: "Le film a été ajouté" });
    }
);

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
