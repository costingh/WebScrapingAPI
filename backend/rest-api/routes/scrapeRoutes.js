// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const scrapeController = require('../controllers/scrapeController');

router.post('/page', scrapeController.scrapePage);
router.get('/get-data/:scrapeId', scrapeController.getScrapingResultById);

module.exports = router;
