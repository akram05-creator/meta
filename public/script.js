// script.js
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Ici, tu peux ajouter la logique pour obtenir la région
    const region = 'inconnue'; // Remplace cela par la logique pour récupérer la région

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, region }), // Envoi du nom d'utilisateur, mot de passe et région
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Affiche le message de réponse
    })
    .catch((error) => {
        console.error('Erreur:', error);
    });
});
