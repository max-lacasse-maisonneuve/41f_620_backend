// Importations des librairies
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const db = require("./config/db");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const auth = require("./middlewares/auth");
const nodemailer = require("nodemailer");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets/img");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({
    storage: storage,
});

//Importation de la librairie de date
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
//On charge le module pour la langue
require("dayjs/locale/fr");
dayjs.locale("fr"); //On change la langue
//On importe le module pour la date universelle
dayjs.extend(utc);

const serveur = express();
dotenv.config();

serveur.use(cors());
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

        if (docRef.exists) {
            return res.json(film);
        } else {
            return res.status(404).json({ msg: "Le film n'existe pas" });
        }
    }
);
serveur.get("/films/genres/:genre", async (req, res) => {
    try {
        const { ordre = "annee", direction = "asc" } = req.query;
        let { genre } = req.params;
        genre = genre.split("-");

        genre.forEach((mot, index, genre) => {
            genre[index] = mot[0].toUpperCase() + mot.slice(1);
        });

        genre = genre.join(" ");

        const films = [];

        const donnees = await db.collection("films").where("genres", "array-contains", genre).get();

        donnees.forEach((donnee) => {
            const film = { id: donnee.id, ...donnee.data() };
            films.push(film);
        });

        films.sort((a, b) => {
            //Si la donnée doit être un nombre
            let estUnNombre = Number(a[ordre]);
            if (estUnNombre) {
                if (direction == "asc") {
                    return a[ordre] - b[ordre];
                } else {
                    return b[ordre] - a[ordre];
                }
            } else {
                if (direction == "asc") {
                    return a[ordre].localeCompare(b[ordre]);
                } else {
                    return b[ordre].localeCompare(a[ordre]);
                }
            }
        });

        if (films.length == 0) {
            return res.status(404).json({ msg: "Aucun livre trouvé pour cette catégorie." });
        }

        return res.status(200).json(films);
    } catch (erreur) {
        return res.status(500).json({
            message: "Une erreur est survenue. Réessayer dans quelques instants.",
            erreur,
        });
    }
});

serveur.post(
    "/films",
    auth,
    [
        check("titre").escape().trim().notEmpty().isLength({ max: 300 }).withMessage("Le titre est obligatoire"),
        check("genres").escape().trim().exists().isArray().withMessage("Le titre est obligatoire"),
        check("description").escape().trim().notEmpty().isLength({ max: 2000 }),
    ],
    async (req, res) => {
        try {
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
            const docref = await db.collection("films").add(body);

            return res.status(201).json({ msg: "Le film a été ajouté", id: docref.id });
        } catch (erreur) {
            return res.status(500).json({ msg: "Une erreur est survenue" });
        }
    }
);

serveur.post("/films/image", auth, upload.single("image"), (req, res) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(400).json({ message: "Aucun fichier trouvé" });
        }
        //On renomme le fichier

        return res.status(201).json({ msg: "Le fichier a été téléchargé", nom: file.filename });
    } catch (erreur) {
        console.log(erreur);
        return res.status(500).json({ msg: "Une erreur est survenue" });
    }
});

serveur.post("/films/initialiser", auth, (req, res) => {
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

/**
 *
 */
serveur.delete("/films/:id", async (req, res) => {
    const { id } = req.params;

    await db.collection("films").doc(id).delete();
    return res.status(204).json({ msg: "Le film a été supprimé" });
});

serveur.post(
    "/utilisateurs/inscription",
    [
        check("courriel").escape().trim().notEmpty().isEmail().normalizeEmail(),
        check("mdp")
            .escape()
            .trim()
            .notEmpty()
            .isStrongPassword({ minLength: 8, minNumbers: 1, minLowercase: 1, minUppercase: 1, minSymbols: 1 }),
    ],
    async (req, res) => {
        //Ajouter try/catch pour capter les autres erreurs possibles

        // Valider les infos
        const erreursValidation = validationResult(req);

        if (!erreursValidation.isEmpty()) {
            return res.status(400).json({ msg: "Données invalides" });
        }

        // récupérer les infos du body avec identifiant unique, mot de passe
        const { courriel, mdp } = req.body;

        // Vérifier si l'utilisateur existe
        const userRefs = await db.collection("utilisateurs").where("courriel", "==", courriel).get();

        if (userRefs.docs.length > 0) {
            return res.status(400).json({ msg: "Utilisateur existant" });
        }

        // //Encrypter le mot de passe
        const hash = await bcrypt.hash(mdp, 10);
        const utilisateur = { ...req.body, mdp: hash };

        // Ajouter l'utilisateur à la db
        await db.collection("utilisateurs").add(utilisateur);

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PWD,
            },
            requireTLS: true,
        });

        const mailOptions = {
            from: "noreply@maximelacassegermain.info",
            to: "max.lacasse.g@gmail.com",
            subject: "Hello SMTP Server",
            text: "Ceci est un test d'email via un serveur SMTP en Node.js",
        };

        transporter.sendMail(mailOptions, (err, info) => {
            console.log("test");

            if (err) {
                console.log(err);
                return res.status(400).json({ msg: "Une erreur est survenue" });
            }
            console.log("Info: ", info);
            return res.status(201).json({ msg: "L'utilisateur à été créé." });
        });
    }
);

serveur.post("/utilisateurs/connexion", async (req, res) => {
    // Valider les données

    // Récupérer les infos du body avec identifiant unique, mot de passe
    const { courriel, mdp } = req.body;

    // On vérifie si le user existe
    // Vérifier si l'utilisateur existe
    const userRefs = await db.collection("utilisateurs").where("courriel", "==", courriel).get();

    if (userRefs.docs.length == 0) {
        return res.status(400).json({ msg: "Mauvais courriel" });
    }
    // On vérifie le mot de passe
    const utilisateur = userRefs.docs[0].data();

    const motsPassesPareils = await bcrypt.compare(mdp, utilisateur.mdp);

    if (motsPassesPareils) {
        // On retourne une authentification
        delete utilisateur.mdp;
        const options = {
            expiresIn: "1d",
        };

        const jeton = jwt.sign(utilisateur, process.env.JWT_SECRET, options);

        return res.status(200).json({ msg: "Utilisateur connecté", jeton });
    } else {
        return res.status(400).json({ msg: "Mot de passe invalide" });
    }
});

//Ressources 404
serveur.use((req, res) => {
    res.statusCode = 404;
    return res.status(404).json({ msg: "Ressource non trouvée" });
});

process.on("SIGTERM", () => {
    console.log("Fermeture du serveur...");
    serveur.close(() => {
      console.log("Serveur arrêté proprement");
      process.exit(0);
    });
  });
module.exports = { serveur, db };
