const request = require("supertest");
const { serveur, db } = require("../serveur");

describe("Tests API Films avec Firestore Emulator", () => {
    beforeEach(async () => {
        const filmsCollection = db.collection("films");
        await Promise.all([
            filmsCollection.doc("1").set({
                titre: "Pour l'amour d'Hollywood",
                genres: ["Comédie", "Drame", "Musical"],
                description: "Un musicien et une actrice en herbe tombent amoureux à Los Angeles.",
                annee: "2016",
                realisation: "Damien Chazelle",
                titreVignette: "pourlamourdhollywood.jpg",
            }),
            filmsCollection.doc("2").set({
                titre: "L'hôtel Grand Budapest",
                genres: ["Aventure", "Comédie", "Drame"],
                description: "Les aventures d'un concierge d'hôtel légendaire et de son protégé.",
                annee: "2014",
                realisation: "Wes Anderson",
                titreVignette: "lhotelgrandbudapest.jpg",
            }),
        ]);
    });

    afterEach(async () => {
        const filmsCollection = await db.collection("films").get();
        const deletions = filmsCollection.docs.map((doc) => doc.ref.delete());
        await Promise.all(deletions);
    });

    it("devrait récupérer tous les films", async () => {
        const res = await request(serveur).get("/films");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
    });

    it("devrait récupérer un film", async () => {
        const res = await request(serveur).get("/films/1");
        expect(res.status).toBe(200);
        expect(res.body.titre).toBe("Pour l'amour d'Hollywood");
    });

    it("devrait ajouter un film", async () => {
        const body = {
            titre: "Avatar",
            genres: ["Action", "Aventure", "Fantaisie"],
            description: "Un marine paraplégique est envoyé sur la lune Pandora où il tombe amoureux d'une habitante.",
            annee: "2009",
            realisation: "James Cameron",
            titreVignette: "avatar.jpg",
        };

        const res = await request(serveur)
            .post("/films")
            .send(body)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        expect(res.ok).toBeTruthy();

        const res2 = await request(serveur).get(`/films/${res.body.id}`);
        expect(res2.status).toBe(200);
        expect(res2.body.titre).toBe("Avatar");
    });

    it("devrait modifier un film", async () => {
        const body = {
            titre: "PATATE",
            genres: ["Action", "Aventure", "Fantaisie"],
            description: "Un marine paraplégique est envoyé sur la lune Pandora où il tombe amoureux d'une habitante.",
            annee: "2009",
            realisation: "James Cameron",
            titreVignette: "avatar.jpg",
        };

        const res = await request(serveur)
            .put("/films/1")
            .send(body)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        const res2 = await request(serveur).get(`/films/1`);
        expect(res2.status).toBe(200);
        expect(res2.body.titre).toBe("PATATE");
    });

    it("devrait supprimer un film", async () => {
        const res = await request(serveur).delete("/films/1");
        expect(res.status).toBe(204);
        const res2 = await request(serveur).get(`/films/1`);
        expect(res2.status).toBe(404);
    });
});
