const puppeteer = require('puppeteer');
const parser = require('./ParserHTML')

// used for testing
const mock = require('../mockups/mockData')

const scrapePage = async (urlToScrape, options, callback) => {

    let _TEST_MODE = false;
    if(options?.test) _TEST_MODE = true;

    if(!_TEST_MODE) {
        try {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(urlToScrape, { waitUntil: 'networkidle2' });
            const htmlContent = await page.content();
            await browser.close();
            const parsedData = parser.parseHTML(htmlContent);
            parsedData ? callback(null, parsedData) : callback('Parsing failed. Check the HTML content.', null)
        } catch (scraping_error) {
            callback(scraping_error, null)
        }
    } else {
        const htmlContent = mock.mockData;
        const parsedData = parser.parseHTML(htmlContent);
        parsedData ? callback(null, parsedData) : callback('Parsing failed. Check the HTML content.', null)
    }
}

module.exports = {
    scrapePage: scrapePage
}