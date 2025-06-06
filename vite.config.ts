// Importe la fonction pour définir la configuration Vite
import { defineConfig, loadEnv } from "vite";

// Importe le plugin React optimisé par SWC pour de meilleures performances
import react from "@vitejs/plugin-react-swc";

// Importe le module 'path' pour la gestion des chemins dans le projet
import path from "path";

// Importe le plugin 'componentTagger' pour le développement (utile au debug)
import { componentTagger } from "lovable-tagger";

// Exportation de la configuration Vite selon l'environnement (mode)
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement depuis le fichier .env du projet
  const environment = loadEnv(mode, process.cwd(), '');

  return {
    // Configuration du serveur de développement
    server: {
      host: "::", // Permet au serveur de s'exécuter sur toutes les adresses IPv6
      port: 5001, // Définit le port local du serveur
      proxy: {
        // Intercepte les appels vers /api pour les rediriger
        '/api': {
          target: 'http://postgresql-gestionapp.alwaysdata.net', // Cible l'URL de l'API distante
          changeOrigin: true, // Modifie l'en-tête "origin" de la requête
          rewrite: (path) => path.replace(/^\/api/, ''), // Supprime /api du chemin pour matcher l'API
        }
      }
    },
    plugins: [
      react(), // Active le plugin React avec SWC
      mode === 'development' && componentTagger(), // N'ajoute 'componentTagger' que si en mode dev
    ].filter(Boolean), // Filtre les plugins non définis (false ou undefined)
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // Crée un alias '@' vers le dossier 'src' pour simplifier les imports
      },
    },
    define: {
      // Crée une constante __APP_ENV__ injectée à la compilation avec la valeur de APP_ENV du .env
      __APP_ENV__: JSON.stringify(environment.APP_ENV),
    },
  };
});
