const cheerio = require('cheerio');
const processInputString = require('../libs/WordCounter');

let _DEFAULT_ELEMENTS_TO_SCRAPE = 'h3, p';

let scrapingPageDepth = 0;
let maxScrapingDepth = 20; // scrape 20 page using recursive algorithm - to be implemented

const parseHTML = (urlToScrape, htmlContent, options) => {
    const parsedData = [];
    let totalPostWordsInCaption = 0;

    try {
        const $ = cheerio.load(htmlContent);
        totalPostWordsInCaption = countPostCaptionWords($);

        let _ELEMENTS = options?.scrape_elements || _DEFAULT_ELEMENTS_TO_SCRAPE;
        if (options.scrapingDepth) maxScrapingDepth = options.scrapingDepth;

        $(_ELEMENTS).each((index, element) => {
            let postWordCount = 0;
            if ($(element).is('img'))
                processImageTag($, element, urlToScrape, postWordCount, parsedData)
            else if ($(element).is('a'))
                processLinkTag($, element, urlToScrape, parsedData)
            else
                processGenericTag($, element, parsedData)
        });
    } catch (error) {
        handleParseError(error)
    }

    return {
        parsedData,
        totalPostWordsInCaption
    };
}

const processLinkTag = ($, element, urlToScrape, result) => {
    const href = $(element).attr('href');
    const text = $(element).text();
    result.push({
        tag: 'a',
        baseUrl: urlToScrape,
        href: href,
        text: text,
        words: processInputString.WordCounter(text) || 0
    });
}

const processGenericTag = ($, element, result) => {
    const tag = $(element).prop('tagName').toLowerCase();
    const text = $(element).text();
    result.push({ tag, text, words: processInputString.WordCounter(text) || 0 });
}

const processImageTag = ($, element, urlToScrape, postWordCount, result) => {
    const src = $(element).attr('src');
    const alt = $(element).attr('alt');

    result.push({
        tag: 'img',
        baseUrl: urlToScrape,
        src: src,
        alt: alt,
        words: 0
    });
}

const countPostCaptionWords = ($) => {
    let postWordCount = 0;
    $('.group').each((index, groupElement) => {
        const groupText = $(groupElement).text();
        postWordCount += countWords(groupText);
    });
    return postWordCount;
}

function countWords(text) {
    const words = text.trim().split(/\s+/);
    return words.length;
}

const handleParseError = (error) => {
    console.error('Error parsing HTML:', error.message);
    return null;
}


module.exports = {
    parseHTML: parseHTML
}
