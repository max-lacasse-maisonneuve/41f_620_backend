// Importations des librairies
const { serveur } = require("./serveur");

serveur.listen(process.env.PORT || 5000, () => {
    console.log(`le serveur est démarré sur le port ${process.env.PORT}`);
});
