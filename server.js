const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create database pool
const pool = mysql.createPool(dbConfig);

// Initialize database
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MariaDB successfully');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS pastes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pasteId VARCHAR(12) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        language VARCHAR(50) DEFAULT 'plaintext',
        views INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_pasteId (pasteId),
        INDEX idx_createdAt (createdAt)
      )
    `);
    
    connection.release();
    console.log('Database initialized successfully');

    // Set up periodic cleanup without using events
    setInterval(async () => {
      try {
        const [result] = await pool.execute(
          'DELETE FROM pastes WHERE createdAt < DATE_SUB(NOW(), INTERVAL 30 DAY)'
        );
        if (result.affectedRows > 0) {
          console.log(`Cleaned up ${result.affectedRows} old pastes`);
        }
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }, 24 * 60 * 60 * 1000); // Run every 24 hours
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Enhanced Security Headers
app.use(helmet({
  contentSecurityPolicy: false
}));

// Compression for better performance
app.use(compression());

// Logging
app.use(morgan('combined'));

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'public', 'dist')));

// API Routes
app.post('/api/paste', async (req, res) => {
  try {
    const { content, language = 'plaintext' } = req.body;
    
    if (!content || content.length > 1000000) {
      return res.status(400).json({ error: 'Invalid content length' });
    }

    const pasteId = crypto.randomBytes(6).toString('hex');
    
    const [result] = await pool.execute(
      'INSERT INTO pastes (pasteId, content, language) VALUES (?, ?, ?)',
      [pasteId, content, language]
    );
    
    res.json({ pasteId });
  } catch (error) {
    console.error('Create paste error:', error);
    res.status(500).json({ error: 'Failed to create paste' });
  }
});

app.get('/api/paste/:pasteId', async (req, res) => {
  try {
    // First get the paste
    const [rows] = await pool.execute(
      'SELECT * FROM pastes WHERE pasteId = ?',
      [req.params.pasteId]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Paste not found' });
    }

    // Then update the views count
    await pool.execute(
      'UPDATE pastes SET views = views + 1 WHERE pasteId = ?',
      [req.params.pasteId]
    );
    
    const paste = rows[0];
    res.json({ 
      content: paste.content,
      language: paste.language,
      views: paste.views + 1,
      createdAt: paste.createdAt
    });
  } catch (error) {
    console.error('Retrieve paste error:', error);
    res.status(500).json({ error: 'Failed to retrieve paste' });
  }
});

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Server startup error:', err);
    process.exit(1);
  });

module.exports = app;