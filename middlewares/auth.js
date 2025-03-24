const jwt = require("jsonwebtoken");

async function auth(req, res, next) {
    // "Bearer djfsldfjs;djflskjdflkjsdfl"
    
    const jeton = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

    if (!jeton) {
        return res.status(401).json({ msg: "Accès refusé, jeton manquant" });
    }

    const decode = await jwt.decode(jeton, process.env.JWT_SECRET);

    if (!decode || decode.role > 0) {
        return res.status(401).json({ msg: "Accès refusé" });
    }

    req.utilisateur = decode;
    next();
}

module.exports = auth;
