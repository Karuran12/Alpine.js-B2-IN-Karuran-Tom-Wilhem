const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware pour CORS
app.use(cors());

// Middleware pour lire le corps des requêtes JSON
app.use(bodyParser.json());

// Chemin vers le fichier users.json
const usersFile = path.join(__dirname, "./data/users.json");

// Routes d'inscription et de connexion
app.post("/signup", async (req, res) => {
    console.log("Début de la route /signup");
    const { nom, email, password } = req.body;

    if (!nom || !email || !password) {
        console.log("Champs manquants.");
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const data = fs.existsSync(usersFile) ? fs.readFileSync(usersFile, "utf8") : "[]";
        const users = data ? JSON.parse(data) : [];

        if (users.find((user) => user.email === email)) {
            console.log("Email déjà utilisé.");
            return res.status(400).json({ error: "Un compte avec cet email existe déjà." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ nom, email, password: hashedPassword });

        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), "utf8");
        console.log("Utilisateur enregistré avec succès.");
        return res.status(201).json({ 
            message: "Compte créé avec succès !", 
            redirectUrl: "./page_users/users.html" 
        });
    } catch (err) {
        console.error("Erreur serveur :", err);
        return res.status(500).json({ error: "Erreur lors de l'enregistrement." });
    }
});


// Route pour la connexion
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const data = fs.existsSync(usersFile) ? fs.readFileSync(usersFile, "utf8") : "[]";
        const users = JSON.parse(data);

        const user = users.find((user) => user.email === email);

        if (!user) {
            return res.status(400).json({ error: "Utilisateur non trouvé." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Mot de passe incorrect." });
        }
        if (email.endsWith("@admin.com")) {
            // Rediriger vers la page d'administration
            return res.status(200).json({ 
                message: "Connexion réussie !", 
                redirectUrl: "./admin/admin.html" // Redirection vers admin.html
            });
        }
        // Ajoutez une URL de redirection à la réponse
        console.log("connexion")
        return res.status(200).json({ 
            message: "Connexion réussie !", 
            redirectUrl: "./page_users/users.html"  
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la connexion." });
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${3000}`);
});
