const cheerio = require('cheerio');

let _DEFAULT_ELEMENTS_TO_SCRAPE = 'h3, p';

let scrapingPageDepth = 0;
let maxScrapingDepth = 20; // scrape 20 page using recursive algorithm

const parseHTML = (urlToScrape, htmlContent, options) => {
    const result = [];

    try {
        const $ = cheerio.load(htmlContent);
        let _ELEMENTS = options?.scrape_elements || _DEFAULT_ELEMENTS_TO_SCRAPE;
        if(options.scrapingDepth) maxScrapingDepth = options.scrapingDepth;

        $(_ELEMENTS).each((index, element) => {
            if ($(element).is('img')) {
                const src = $(element).attr('src');
                const alt = $(element).attr('alt');

                result.push({
                    tag: 'img',
                    baseUrl: urlToScrape,
                    src: src,
                    alt: alt
                });
            } else  if ($(element).is('a')) {
                const href = $(element).attr('href');
                const text = $(element).text();

                result.push({
                    tag: 'a',
                    baseUrl: urlToScrape,
                    href: href,
                    text: text
                });
            } else {
                const tag = $(element).prop('tagName').toLowerCase();
                const text = $(element).text();
                result.push({ tag, text });
            }
        });
    } catch (error) {
        console.error('Error parsing HTML:', error.message);
        return null;
    }

    return result;
}

module.exports = {
    parseHTML: parseHTML
}
