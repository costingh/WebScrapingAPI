const express = require('express');
require('dotenv').config();
var logger = require('morgan');

// database config
const db = require("./config/db.js");

// routes
const scrapingRoutes = require('./routes/scrapeRoutes');
const nlpRoutes = require('./routes/nlpRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

db.connectDB(); 

app.use('/api/scrape', scrapingRoutes);
app.use('/api/nlp', nlpRoutes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
