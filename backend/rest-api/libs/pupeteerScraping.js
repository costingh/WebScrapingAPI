const puppeteer = require('puppeteer');
const parser = require('./ParserHTML');

let baseUrl = '';

const scrapePage = async (urlToScrape, options, callback) => {
    let scrapedPages = new Set();
    baseUrl = urlToScrape;

    const { error, result } = await scrapeRecursive(urlToScrape, options, scrapedPages);
    callback(error, result)
}

const scrapeRecursive = async (startUrl, options, visitedUrls = new Set()) => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const scrapingResult = [];
        const totalWordsInPostsCaptions = { value: 0 };
        let totalWordCount = 0;

        await visitPage(startUrl, page, scrapingResult, options, visitedUrls, totalWordsInPostsCaptions);

        totalWordCount = scrapingResult.reduce((total, pageData) => {
            if (pageData.url !== startUrl) {
                return total + pageData.data.reduce((pageTotal, element) => pageTotal + element.words, 0);
            }
            return total;
        }, 0),
        totalWordCount += totalWordsInPostsCaptions.value;

        await browser.close();

        const result = {
            totalWordCount,
            totalWordsInPostsCaptions: totalWordsInPostsCaptions.value,
            scrapingResult,
        }

        return { error: null, result }
    } catch(error) {
        return {error, result: null}
    }
};

const visitPage = async (url, page, result, options, visitedUrls, totalWordsInPostsCaptions) => {
    if (!visitedUrls.has(url)) {
        visitedUrls.add(url);
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            const htmlContent = await page.content();

            const { parsedData, totalPostWordsInCaption } = parser.parseHTML(url, htmlContent, options);

            if (url == baseUrl) {
                console.log('Got ' + totalPostWordsInCaption + ' total words in all posts caption')
                totalWordsInPostsCaptions.value += totalPostWordsInCaption;
            }

            if (parsedData) result.push({ url, data: parsedData });

            const links = await page.$$eval('a', (links) => links.map((link) => link.href));

            for (const link of links) {
                await visitPage(link, page, result, options, visitedUrls, totalWordsInPostsCaptions);
            }
        } catch (error) {
            console.error(`Error scraping ${url}: ${error.message}`);
        }
    }
};

module.exports = {
    scrapePage: scrapePage
}