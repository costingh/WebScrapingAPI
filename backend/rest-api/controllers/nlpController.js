const sentimentLib = require('../libs/ExtractSentiment');

const analyzeSentiment = (req, res) => {
    const { text } = req.body;
    const {result, error} = sentimentLib.analyzeSentimentForCaptions(text)
    res.status(200).json({ result, error });
};

module.exports = {
    analyzeSentiment: analyzeSentiment
}
