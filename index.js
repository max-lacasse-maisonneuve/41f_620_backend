// index.js
const serveur = require("./serveur");

const PORT = process.env.PORT || 3000;

serveur.listen(PORT, () => {
    console.log(`Le serveur est démarré sur le port ${PORT}`);
});
