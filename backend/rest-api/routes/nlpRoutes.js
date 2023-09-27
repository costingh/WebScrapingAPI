const express = require('express');
const router = express.Router();
const nlpController = require('../controllers/nlpController');

router.post('/sentiment-analyzer', nlpController.analyzeSentiment);

module.exports = router;
