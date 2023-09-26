const axios = require('axios')
const pupeteerScraping = require('../libs/pupeteerScraping')

const scrapePage = (req, res) => {
	const { url, options } = req.body;
	if (!url) {
		return res.status(400).json({ error: 'Title is required' });
	}
	
	pupeteerScraping.scrapePage(url, options, (scraping_error, scraping_result) => {
		console.log(scraping_error)
		console.log(scraping_result)

		res.status(201).json({
			error: scraping_error,
			result: scraping_result
		});

	});
};

const getScrapingResultById = (req, res) => {
	return res.status(404).json({ error: 'Page scraping results were not found in DB' });
};

module.exports = {
	scrapePage: scrapePage,
	getScrapingResultById: getScrapingResultById
}
