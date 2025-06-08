import { Pool } from 'pg';
import cors from 'cors'; // Importe le middleware cors
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mes_routes from './src/routes.js';

// Configurer __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const app = express();

// Configurer CORS dynamiquement selon l'environnement
const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = 'https://v-card-project-vercel.vercel.app';
} else {
  corsOptions.origin = 'http://localhost:5173'; // Port par défaut de Vite en dev
}

app.use(cors(corsOptions));

app.use(express.json());

// Servir les fichiers statiques du dossier dist
app.use(express.static(path.join(__dirname, 'dist')));

// Rediriger la route racine vers index.html dans dist
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(mes_routes);

const PORT = process.env.PORT || 5000;

export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
  });
}
