const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const serveur = http.createServer((req, res) => {
    if (req.method == "GET" && req.url == "/") {
        res.end("Accueil");
    } else {
        res.end("Patate 2");
    }
});

serveur.listen(process.env.PORT, () => {
    console.log(`le serveur est démarré sur le port ${process.env.PORT}`);
});
