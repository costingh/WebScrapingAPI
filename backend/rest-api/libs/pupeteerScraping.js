const puppeteer = require('puppeteer');
const parser = require('./ParserHTML');

const scrapePage = async (urlToScrape, options, callback) => {
    let scrapedPages = new Set();

    scrapeRecursive(urlToScrape, options, scrapedPages, callback);
}

const scrapeRecursive = async (startUrl, options, visitedUrls = new Set(), callback) => {
    const browser = await puppeteer.launch({ headless: false }); 
    const page = await browser.newPage();
    const result = [];

    await visitPage(startUrl, page, result, options, visitedUrls); 
    await browser.close();
    callback(null, result);
};

const visitPage = async (url, page, result, options, visitedUrls) => {
    if (!visitedUrls.has(url)) {
        visitedUrls.add(url);
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            const htmlContent = await page.content();

            const parsedData = parser.parseHTML(url, htmlContent, options);

            if (parsedData) result.push({ url, data: parsedData });

            const links = await page.$$eval('a', (links) => links.map((link) => link.href));
            
            for (const link of links) {
                await visitPage(link, page, result, options, visitedUrls); 
            }
        } catch (error) {
            console.error(`Error scraping ${url}: ${error.message}`);
        }
    }
};

module.exports = {
    scrapePage: scrapePage
}