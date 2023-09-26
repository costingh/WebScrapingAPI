const cheerio = require('cheerio');

const parseHTML = (htmlContent) => {
    const result = [];

    try {
        const $ = cheerio.load(htmlContent);

        $('h1, h2, h3, h4, h5, p, a, span, div, sup').each((index, element) => {
            const tag = $(element).prop('tagName').toLowerCase();
            const text = $(element).text();
            result.push({ tag, text });
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
