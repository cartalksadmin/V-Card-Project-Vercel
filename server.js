import { Pool } from 'pg';
import cors from 'cors';
import express from 'express';
import mes_routes from './src/routes.js';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const app = express();

app.use(cors());
app.use(express.json());

// Ajoute un gestionnaire pour la route /
app.use(express.static(path.join(__dirname, '/')));

// Rediriger la route racine vers index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.use(mes_routes);

const PORT = process.env.PORT || 5000;

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
  });
}
