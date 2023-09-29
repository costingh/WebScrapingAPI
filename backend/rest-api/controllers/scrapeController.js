const pupeteerScraping = require('../libs/pupeteerScraping')
const { ScrapedPageModel } = require('../models/scrapedPage')
const hashingLib = require('../libs/hashUrl');
const sentimentLib = require('../libs/ExtractSentiment');
const mocks = require('../mockups/mockData')
const {transporter} = require('../emailService/transporter')

const scrapePage = (req, res) => {
	const { url, options } = req.body;

	if (!url) {
		return res.status(400).json({ error: 'Url is required' });
	}

	// hash url and use it as record id in database to fasten searching process of a record by id, and not by the url field
	const hashedId = hashingLib.hashUrl(url);

	if (!options.test_mode) {
		pupeteerScraping.scrapePage(url, options, (scraping_error, result) => {
			let scrapingResult = result?.scrapingResult;
			if (scrapingResult) {
				try {
					
					let sentiment = null;

					if (options?.extract_sentiment) {
						console.log('Extracting sentiment from the scraped data...')

						let captions = [];
						scrapingResult.map(element => {
							element.data.map(data => {
								if (data.text) captions.push(data.text)
							})
						})
						const { sentimentScore, error } = sentimentLib.analyzeSentimentForCaptions(captions)
						if(error) {
							console.log('Error extracting sentiment')
							console.log(JSON.stringify(error, null, 2))
						}

						sentiment = sentimentScore;
					} 

					// console.log('sentiment ' + sentiment)

					let dataToSave = {
						page_url: url,
						totalWordsInPostsCaptions: result?.totalWordsInPostsCaptions,
						totalWordCount: result?.totalWordCount,
						content: scrapingResult,
					};

					if(sentiment != null) dataToSave.sentiment = sentiment;

					// console.log(dataToSave)

					const scrapedData = new ScrapedPageModel(dataToSave);

					saveScrapingData(hashedId, scrapedData, (error, response) => {
						res.status(error ? 500 : 201).json({ error: error, result: response });
					})
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

			let captions = [];

			mocks.mockData?.result?.content.map(element => {
				element.data.map(data => {
					if (data.text) captions.push(data.text)
				})
			})
			const { sentimentScore, error } = sentimentLib.analyzeSentimentForCaptions(captions)

			res.status(201).json({ error: error, result: mocks.mockData?.result });
		} else res.status(201).json({ error: null, result: mocks.mockData?.result });
	}


	if(options?.email_notify && options?.email_notify.notify_user && options?.email_notify.user_email) {
		console.log('Should send email to user ' + options?.email_notify.user_email)

		const urlToViewScrapedData = `http://localhost:5173/scraped-data/${hashedId}`
		const mailOptions = {
			from: 'gheorghecostin221@gmail.com',
			to: options?.email_notify.user_email,
			subject: 'Scraped data from ' + url + ' website',
			text: 'Please check the following link to see the scraped data: ' + urlToViewScrapedData
		};
		
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log('Email could not be sent :(')
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		}); 
	}
};

const getScrapingResultById = async (req, res) => {

	try {
		const { scrapeId } = req.params;
		const result = await ScrapedPageModel.findOne({ _id: scrapeId });
		if (!result) {
		  return res.status(404).json({ error: 'Page scraping results were not found in DB' });
		}
		return res.status(200).json(result);
	  } catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	  }
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
