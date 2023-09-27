const pupeteerScraping = require('../libs/pupeteerScraping')
const { ScrapedPageModel } = require('../models/scrapedPage')
const hashingLib = require('../libs/hashUrl')

const scrapePage = (req, res) => {
	const { url, options } = req.body;
	if (!url) {
		return res.status(400).json({ error: 'Title is required' });
	}

	pupeteerScraping.scrapePage(url, options, (scraping_error, scraping_result) => {
		if (scraping_result) {
			try {
				// hash url and use it as record id in database to fasten searching process of a record by id, and not by the url field
				const hashedId = hashingLib.hashUrl(url);
				const scrapedData = new ScrapedPageModel({
					page_url: url,
					content: scraping_result
				});

				// update or insert the document
				ScrapedPageModel.findOneAndUpdate(
					{ _id: hashedId },
					scrapedData,
					{ upsert: true, new: true }
				)
					.then((result) => {
						res.status(201).json({ error: null, result: result });
					})
					.catch((error) => {
						res.status(500).json({ error: error.message || 'Error saving scraped data to DB', result: null });
					});
			} catch (error) {
				res.status(500).json({ error: error?.message || 'Error saving scraped data to DB', result: null });
			}
		} else {
			res.status(500).json({ error: scraping_error, result: null });
		}
	});
};

const getScrapingResultById = (req, res) => {
	return res.status(404).json({ error: 'Page scraping results were not found in DB' });
};

module.exports = {
	scrapePage: scrapePage,
	getScrapingResultById: getScrapingResultById
}
