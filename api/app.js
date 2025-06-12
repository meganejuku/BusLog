const express = require('express');
const cors = require('cors');
const { initialize } = require('../db');

const app = express();

initialize();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const buslogRoutes = require('./routes/buslog');
app.use('/api/buslog', buslogRoutes);

module.exports = app;
