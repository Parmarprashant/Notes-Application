const express = require('express');
const app = express();
const noteRoutes = require('./routes/note.routes');

app.use(express.json());

// Routes
app.use('/api/notes', noteRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
  });
});

module.exports = app;
