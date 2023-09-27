const puppeteer = require('puppeteer');
const parser = require('./ParserHTML');

const scrapePage = async (urlToScrape, options, callback) => {
    let scrapedPages = new Set();
    let pagesThatCouldntBeScraped = new Set();

    scrapeRecursive(urlToScrape, options, scrapedPages, pagesThatCouldntBeScraped, (err, result) => {
        result = {
            ...result,
            pagesThatCouldntBeScraped 
        }
        callback(err, result)
    });
}

const scrapeRecursive = async (startUrl, options, visitedUrls = new Set(), urlsNotScrapedDueToErrors = new Set(), callback) => {
    const browser = await puppeteer.launch({ headless: false }); 
    const page = await browser.newPage();
    const result = [];

    const visitPage = async (url) => {
        if (!visitedUrls.has(url)) {
            visitedUrls.add(url);
            try {
                await page.goto(url, { waitUntil: 'networkidle2' });
                const htmlContent = await page.content();
                const parsedData = parser.parseHTML(url, htmlContent, options);
                if (parsedData) {
                    result.push({ url, data: parsedData });
                }

                const links = await page.$$eval('a', (links) => links.map((link) => link.href));
                for (const link of links) {
                    await visitPage(link);
                }
            } catch (error) {
                console.error(`Error scraping ${url}: ${error.message}`);
                urlsNotScrapedDueToErrors.add(url);
            }
        }
    };

    await visitPage(startUrl);
    await browser.close();
    callback(null, result);
};

module.exports = {
    scrapePage: scrapePage
}