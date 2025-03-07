const donneesTest = [
    {
        titre: "Alien - Le 8ème passager",
        genres: ["Horreur", "Science-fiction"],
        description:
            "Un vaisseau spatial perçoit une transmission non-identifiée comme un signal de détresse. Lors de son atterrissage, l'un des membres de l'équipage est attaqué par une mystérieuse forme de vie, ils réalisent rapidement que son cycle de vie vient seulement de commencer.",
        annee: "1979",
        realisation: "Ridley Scott",
        titreVignette: "alienle8emepassager.jpg",
    },
    {
        titre: "Origine",
        genres: ["Action", "Aventure", "Science-fiction"],
        description:
            "Un voleur qui s'approprie des secrets d'entreprise à l'aide d'une technique de partage de rêves se voit contraint d'effectuer la tâche inverse : implanter une idée dans l'esprit d'un PDG, pour revoir ses enfants.",
        realisation: "Christopher Nolan",
        annee: "2010",
        titreVignette: "origine.jpg",
    },
    {
        titre: "Memento",
        genres: ["Mystère", "Thriller"],
        description:
            "Un homme souffrant de perte de la mémoire à court terme tente de retrouver l'assassin de sa femme.",
        realisation: "    Christopher Nolan",
        annee: "2000",
        titreVignette: "memento.jpg",
    },
    {
        titre: "Parasite",
        description:
            "Toute la famille de Ki-taek est au chômage, et s'intéresse fortement au train de vie de la richissime famille Park, jusqu'à ce qu'ils soient impliqués dans un incident inattendu.",
        annee: "2019",
        genres: ["Drame", "Thriller"],
        realisation: "Bong Joon Ho",
        titreVignette: "parasite.jpg",
    },
    {
        titre: "Princesse Mononoké",
        genres: ["Animation", "Aventure", "Animation"],
        description:
            "En quête d'un remède contre la malédiction d'un Tatarigami, Ashitaka se retrouve plongé au coeur d'une guerre entre les dieux de la forêt et Tatara, une colonie minière. Dans cette quête, il fait la rencontre de San, la princesse Mononoke.",
        annee: "1997",
        realisation: "Hayao Miyazaki",
        titreVignette: "princessemononoke.jpg",
    },
    {
        titre: "Requiem for a Dream",
        genres: ["Drame"],
        description:
            "Les utopies par stupéfiants de quatre habitants de Coney Island sont brisées lorsque leurs addictions s'aggravent.",
        annee: "2000",
        realisation: "Darren Aronofsky",
        titreVignette: "requiemforadream.jpg",
    },
    {
        titre: "La matrice",
        genres: ["Action", "Science-fiction"],
        description:
            "Un pirate informatique apprend d'un mystérieux rebelle l'existence de la Matrice, un monde virtuel créé par l'humanité pour asservir les esprits et les corps de ses habitants.",
        annee: "1999",
        realisation: "Lana Wachowski",
        titreVignette: "lamatrice.jpg",
    },
    {
        titre: "À l'ombre de Shawshank",
        genres: ["Drame"],
        description:
            "Deux hommes emprisonnés pendant des décennies se lient d'amitié et trouvent la rédemption alors qu'ils partagent leurs expériences.",
        annee: "1994",
        realisation: "Frank Darabont",
        titreVignette: "alombredeshawshank.jpg",
    },
    {
        titre: "Le silence des agneaux",
        genres: ["Crime", "Drame", "Thriller"],
        description:
            "Une jeune recrue du FBI interroge un psychopathe cannibale afin de l'aider à traquer un autre tueur en série.",
        annee: "1991",
        realisation: "Jonathan Demme",
        titreVignette: "lesilencedesagneaux.jpg",
    },
    {
        titre: "Casablanca",
        genres: ["Drame", "Romance"],
        description: "Un homme doit choisir entre son amour pour une femme et aider son mari à échapper aux nazis.",
        annee: "1942",
        realisation: "Michael Curtiz",
        titreVignette: "casablanca.jpg",
    },
    {
        titre: "Psychose",
        genres: ["Horreur", "Mystère", "Thriller"],
        description: "Un secrétaire en fuite se retrouve dans un motel étrange tenu par un homme obsédé par sa mère.",
        annee: "1960",
        realisation: "Alfred Hitchcock",
        titreVignette: "psychose.jpg",
    },
    {
        titre: "Star Wars: Épisode IV - Un nouvel espoir",
        genres: [],
        description: "Luke Skywalker se joint à la Rébellion pour sauver la princesse Leia des griffes de Dark Vador.",
        annee: "1977",
        realisation: "George Lucas",
        titreVignette: "starwarsepisodeiv.jpg",
    },
    {
        titre: "E.T. l'extra-terrestre",
        genres: ["Famille", "Science-fiction"],
        description:
            "Un garçon fait ami-ami avec un extraterrestre échoué sur Terre et tente de l'aider à rentrer chez lui.",
        annee: "1982",
        realisation: "Steven Spielberg",
        titreVignette: "etlextraterrestre.jpg",
    },
    {
        titre: "Retour vers le futur",
        genres: ["Aventure", "Comédie", "Science-fiction"],
        description: "Un adolescent voyage dans le temps jusqu'aux années 1950 où ses parents se sont rencontrés.",
        annee: "1985",
        realisation: "Robert Zemeckis",
        titreVignette: "retourverslefutur.jpg",
    },
    {
        titre: "Le parc jurassique",
        genres: ["Aventure", "Science-fiction", "Thriller"],
        description: "Un parc à thème peuplé de dinosaures clonés tourne mal après une panne de courant.",
        annee: "1993",
        realisation: "Steven Spielberg",
        titreVignette: "leparcjurassique.jpg",
    },
    {
        titre: "Le show Truman",
        genres: ["Comédie", "Drame", "Science-fiction"],
        description: "Un homme découvre que sa vie est en réalité une émission de télévision.",
        annee: "1998",
        realisation: "Peter Weir",
        titreVignette: "leshowtruman.jpg",
    },
    {
        titre: "Avatar",
        genres: ["Action", "Aventure", "Fantaisie"],
        description: "Un marine paraplégique est envoyé sur la lune Pandora où il tombe amoureux d'une habitante.",
        annee: "2009",
        realisation: "James Cameron",
        titreVignette: "avatar.jpg",
    },
    {
        titre: "L'hôtel Grand Budapest",
        genres: ["Aventure", "Comédie", "Drame"],
        description: "Les aventures d'un concierge d'hôtel légendaire et de son protégé.",
        annee: "2014",
        realisation: "Wes Anderson",
        titreVignette: "lhotelgrandbudapest.jpg",
    },
    {
        titre: "Pour l'amour d'Hollywood",
        genres: ["Comédie", "Drame", "Musical"],
        description: "Un musicien et une actrice en herbe tombent amoureux à Los Angeles.",
        annee: "2016",
        realisation: "Damien Chazelle",
        titreVignette: "pourlamourdhollywood.jpg",
    },
];

module.exports = donneesTest;
