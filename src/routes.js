import express from 'express';
import pool from '../DB/db.js';

const router = express.Router();

// 1. Récupérer tous les utilisateurs
router.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne du serveur');
  }
});

// 2. Récupérer un utilisateur par ID
router.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne du serveur');
  }
});

// 3. Créer un nouvel utilisateur
router.post('/api/users', async (req, res) => {
  const user = req.body; // Extract user data from request body

  // Validate required fields
  if (!user.name || !user.profession || !user.photo) {
    return res.status(400).json({ error: 'Name, profession, and photo are required' });
  }

  const query = `
    INSERT INTO users (
      name, profession, company, address, email, phone, website, photo, bio,
      skills, years_of_experience, specializations, languages, certifications,
      awards, personal_projects, previous_positions, education, projects,
      linkedin, github, twitter, instagram, cv_url, created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    ) RETURNING id
  `;

  const values = [
    user.name,
    user.profession,
    user.company || null,
    user.address || null,
    user.email || null,
    user.phone || null,
    user.website || null,
    user.photo,
    user.bio || null,
    user.skills || [],
    user.years_of_experience || null,
    user.specializations || [],
    user.languages || [],
    user.certifications || [],
    user.awards || [],
    user.personal_projects || [],
    user.previous_positions || [],
    user.education || [],
    user.projects || [],
    user.linkedin || null,
    user.github || null,
    user.twitter || null,
    user.instagram || null,
    user.cv_url || null,
  ];

  try {
    const result = await pool.query(query, values);
    res.status(201).json({ id: result.rows[0].id, message: 'User created successfully' });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ error: 'Failed to insert user' });
  }
});

// 4. Mettre à jour un utilisateur par ID
router.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name, profession, company, address, email, phone, website, photo, bio, skills,
    years_of_experience, specializations, languages, certifications, awards,
    personal_projects, previous_positions, education, projects, linkedin, github,
    instagram, twitter, cv_url
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET 
        name = $1, profession = $2, company = $3, address = $4, email = $5, 
        phone = $6, website = $7, photo = $8, bio = $9, skills = $10, 
        years_of_experience = $11, specializations = $12, languages = $13, 
        certifications = $14, awards = $15, personal_projects = $16, 
        previous_positions = $17, education = $18, projects = $19, linkedin = $20, 
        github = $21, instagram = $22, twitter = $23, cv_url = $24, updated_at = NOW() 
        WHERE id = $25 RETURNING *`,
      [
        name, profession, company, address, email, phone, website, photo, bio, skills,
        years_of_experience, specializations, languages, certifications, awards,
        personal_projects, previous_positions, education, projects, linkedin, github,
        instagram, twitter, cv_url, id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne du serveur');
  }
});

// 5. Supprimer un utilisateur par ID
router.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne du serveur');
  }
});

// Routes pour les Cartes de Visite

// 1. Récupérer toutes les cartes
router.get('/api/cards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cards');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne du serveur');
  }
});

// 2. Récupérer une carte par ID
router.get('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM cards WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Carte non trouvée');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne du serveur');
  }
});

// 3. Créer une nouvelle carte
router.post('/api/cards', async (req, res) => {
  const { user_id, nfc_id, is_active } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO cards (user_id, nfc_id, is_active) VALUES ($1, $2, $3) RETURNING *',
      [user_id, nfc_id, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne du serveur');
  }
});

// 4. Mettre à jour une carte par ID
router.put('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  const { user_id, nfc_id, is_active } = req.body;
  try {
    const result = await pool.query(
      'UPDATE cards SET user_id = $1, nfc_id = $2, is_active = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [user_id, nfc_id, is_active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Carte non trouvée');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne du serveur');
  }
});

// 5. Supprimer une carte par ID
router.delete('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM cards WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Carte non trouvée');
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur interne du serveur');
  }
});

export default router;