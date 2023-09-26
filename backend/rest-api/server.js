const db = require("./config/db.js");
const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connectDB(); 

const scrapingRoutes = require('./routes/scrapeRoutes');
app.use('/api/scrape', scrapingRoutes);

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
