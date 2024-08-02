// Initialiser la connexion Socket.io
const socket = io();

// Sélectionner les éléments du DOM
const messagesContainer = document.getElementById('chatboxMessages');
const inputField = document.getElementById('chatboxInput');
const sendButton = document.getElementById('chatboxSend');

// Fonction pour ajouter un message au DOM
function addMessage(message, isUserMessage = true) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Si le message est un message utilisateur, applique un style différent
    if (isUserMessage) {
        messageElement.classList.add('user-message');
    } else {
        messageElement.classList.add('system-message');
    }

    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Faire défiler vers le bas
}

// Fonction pour envoyer un message
function sendMessage() {
    const message = inputField.value.trim();

    if (message) {
        addMessage(message); // Ajouter le message utilisateur
        socket.emit('chat message', message); // Envoyer le message au serveur
        inputField.value = ''; // Réinitialiser le champ de saisie
    }
}

// Écouter les événements du bouton d'envoi
sendButton.addEventListener('click', () => {
    sendMessage();
});

// Écouter les événements de la touche 'Enter'
inputField.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Recevoir les messages du serveur
socket.on('chat message', (msg) => {
    addMessage(msg, false); // Ajouter le message du serveur comme message système
});

// Ajouter une notification lorsque le champ de saisie est vide
inputField.addEventListener('input', () => {
    if (inputField.value.trim()) {
        sendButton.disabled = false;
    } else {
        sendButton.disabled = true;
    }
});

// Fonction pour afficher les notifications à l'utilisateur
function showNotification(title, message) {
    if (Notification.permission === 'granted') {
        new Notification(title, { body: message });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                new Notification(title, { body: message });
            }
        });
    }
}

// Ajouter un message de bienvenue
function showWelcomeMessage() {
    addMessage('Bienvenue dans GECAI ! Comment puis-je vous aider aujourd\'hui ?', false);
}

// Initialiser la chatbox
function initializeChatbox() {
    showWelcomeMessage(); // Afficher le message de bienvenue
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    }
}

// Appeler la fonction d'initialisation
initializeChatbox();
