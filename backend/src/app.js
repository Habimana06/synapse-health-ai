const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();

app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: config.nodeEnv === 'production' ? 'Internal server error' : err.message,
  });
});

module.exports = app;
