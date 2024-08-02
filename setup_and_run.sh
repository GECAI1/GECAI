#!/bin/bash

# Créer un nouveau répertoire et se déplacer dedans
mkdir gecaichat
cd gecaichat

# Initialiser un nouveau projet Node.js
npm init -y

# Installer les dépendances nécessaires
npm install express socket.io

# Créer le fichier server.js
cat <<EOF > server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});
EOF

# Créer le répertoire public
mkdir public

# Créer un fichier HTML vide
touch public/index.html

# Créer un fichier CSS vide
touch public/styles.css

# Créer un fichier JavaScript vide
touch public/script.js

# Démarrer le serveur
node server.js
