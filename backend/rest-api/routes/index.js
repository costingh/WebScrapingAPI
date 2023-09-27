const express = require('express');
const app = express.Router();

const scrapeRoutes = require('./scrapeRoutes');
const nlpRoutes = require('./nlpRoutes');

app.use('/scrape', scrapeRoutes);
app.use('/nlp', nlpRoutes);

module.exports = app;
