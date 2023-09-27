const pupeteerScraping = require('../libs/pupeteerScraping')
const { ScrapedPageModel } = require('../models/scrapedPage')
const hashingLib = require('../libs/hashUrl');
const sentimentLib = require('../libs/ExtractSentiment');
const mocks = require('../mockups/mockData')

const scrapePage = (req, res) => {
	const { url, options } = req.body;

	if (!url) {
		return res.status(400).json({ error: 'Title is required' });
	}

	if (!options.test_mode) {
		pupeteerScraping.scrapePage(url, options, (scraping_error, scrapingResult) => {
			if (scrapingResult) {
				try {
					// hash url and use it as record id in database to fasten searching process of a record by id, and not by the url field
					const hashedId = hashingLib.hashUrl(url);
					const scrapedData = new ScrapedPageModel({
						page_url: url,
						content: scrapingResult
					});

					if (options?.extract_sentiment) {
						console.log('Extracting sentiment from the scraped data...')

						let captions = [];

						scrapingResult?.result?.content.map(element => {
							element.data.map(data => {
								if (data.text) captions.push(data.text)
							})
						})
						const { result, error } = sentimentLib.analyzeSentimentForCaptions(captions)

						saveScrapingData(hashedId, scrapedData, (error, response) => {
							res.status(error ? 500 : 201).json({ error: error, result: response });
						})
					} else {
						saveScrapingData(hashedId, scrapedData, (error, response) => {
							res.status(error ? 500 : 201).json({ error: error, result: response });
						})
					}
				} catch (error) {
					res.status(500).json({ error: error?.message || 'Error saving scraped data to DB', result: null });
				}
			} else {
				res.status(500).json({ error: scraping_error, result: null });
			}
		});
	} else {
		if (options?.extract_sentiment) {
			console.log('Extracting sentiment from the scraped data...')

			console.log(mocks.mockData?.result)
			let captions = [];

			mocks.mockData?.result?.content.map(element => {
				element.data.map(data => {
					if (data.text) captions.push(data.text)
				})
			})
			const { result, error } = sentimentLib.analyzeSentimentForCaptions(captions)

			res.status(201).json({ error: error, result: result });
		} else res.status(201).json({ error: null, result: result });
	}
};

const getScrapingResultById = (req, res) => {
	return res.status(404).json({ error: 'Page scraping results were not found in DB' });
};

const saveScrapingData = (_id, body, callback) => {
	// update or insert the document
	ScrapedPageModel.findOneAndUpdate(
		{ _id: _id },
		body,
		{ upsert: true, new: true }
	)
		.then((result) => {
			callback(null, result)
		})
		.catch((error) => {
			callback(error, null)
		});
}

module.exports = {
	scrapePage: scrapePage,
	getScrapingResultById: getScrapingResultById
}
