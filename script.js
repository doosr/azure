// Importer les modules nécessaires
const express = require('express');
const sql = require('mssql');

// Configuration de l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Configuration de la connexion à la base de données
const dbConfig = {
  user: process.env.DB_USER || 'societe',
  password: process.env.DB_PASSWORD || 'Dawser1234',
  server: process.env.DB_SERVER || 'serveur-societe.database.windows.net',
  database: process.env.DB_NAME || 'societe',
  options: {
    encrypt: true, // Nécessaire pour Azure
    trustServerCertificate: false, // Mettre à "true" si un certificat non approuvé est utilisé
  },
};

// Route de test
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’application gestion-clients !');
});

// Route pour obtenir les régions
app.get('/regions', async (req, res) => {
  try {
    // Connexion à la base de données
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM region');
    res.json(result.recordset);
  } catch (error) {
    console.error('Erreur lors de la récupération des régions :', error);
    res.status(500).send('Erreur serveur');
  }
});

// Route pour obtenir les clients
app.get('/clients', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM client');
    res.json(result.recordset);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients :', error);
    res.status(500).send('Erreur serveur');
  }
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
