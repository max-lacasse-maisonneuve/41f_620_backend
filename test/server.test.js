const request = require("supertest");
const serveur = require("../serveur"); // Importe le serveur Express
// const { initializeAdminApp, clearFirestoreData, apps } = require("@firebase/rules-unit-testing");
// 🔥 Initialisation de Firestore en mode test
// const { setDb, getDb } = require("./db");

describe("Tests API Films avec Firestore en mode test", () => {
    it("devrait récupérer tous les films", async () => {
        // Ajouter des films dans la base Firestore de test

        const res = await request(serveur).get("/films");
        console.log(res.body); // Vérifie ce qui est retourné

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }, 10000);
});
