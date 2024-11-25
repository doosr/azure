const express = require('express');
const sql = require('mssql');
const app = express();

// Middleware pour traiter les requêtes JSON
app.use(express.json());

// Chaîne de connexion à la base de données Azure SQL
const dbConfig = {
    user: 'societe', // Nom d'utilisateur
    password: 'Dawser1234', // Mot de passe
    server: 'serveur-societe.database.windows.net', // Serveur SQL Azure
    database: 'societe', // Nom de la base de données
    options: {
        encrypt: true, // Utilisation du cryptage
        trustServerCertificate: false, // Pour la production, vous devriez utiliser un certificat valide
        enableArithAbort: true
    }
};

// Route pour obtenir tous les clients
app.get('/clients', async (req, res) => {
    try {
        // Connexion à la base de données
        await sql.connect(dbConfig);
        
        // Requête SQL pour obtenir les clients
        const result = await sql.query('SELECT * FROM client');
        
        // Retour des résultats
        res.json(result.recordset);
    } catch (err) {
        console.error('Erreur lors de la récupération des clients :', err);
        res.status(500).send('Erreur serveur');
    }
});

// Route pour ajouter un nouveau client
app.post('/clients', async (req, res) => {
    const { nom, prenom, age, ID_region } = req.body;

    try {
        // Connexion à la base de données
        await sql.connect(dbConfig);

        // Requête SQL pour ajouter un client
        const result = await sql.query(`
            INSERT INTO client (nom, prenom, age, ID_region)
            VALUES ('${nom}', '${prenom}', ${age}, ${ID_region})
        `);

        // Répondre avec le message de succès
        res.status(201).send('Client ajouté avec succès');
    } catch (err) {
        console.error('Erreur lors de l\'ajout du client :', err);
        res.status(500).send('Erreur serveur');
    }
});

// Démarrer le serveur sur le port configuré ou 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
