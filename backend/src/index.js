require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// SQL Database and Seed Initialization
const initSchema = require('./config/schema');
const { seedCurriculum } = require('./data/seedCurriculum');
const { seedStudents } = require('./data/seedStudents');
const apiRoutes = require('./routes/apiRoutes');

// Initialize database schema and data
try {
  initSchema();
  seedCurriculum();
  seedStudents().catch((err) => console.error('Student seed error:', err.message));
} catch (error) {
  console.error('[Database Init Error]:', error);
}

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: 'sqlite-connected',
    message: 'JavaPuff Java Learning API is alive and watching your progress! ☕',
    timestamp: new Date().toISOString()
  });
});

// Mount All API Routes
app.use('/api', apiRoutes);

// Static frontend serving if dist exists
const distPath = path.join(__dirname, '../../frontend/dist');
const publicPath = path.join(__dirname, '../../frontend/public');

if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // In Express 5, fallback catch-all uses standard middleware instead of app.get('*')
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // 404 Handler for API
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found. Koffi says: Are you lost?'
    });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`☕ JavaPuff Server running with SQLite on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = app;
