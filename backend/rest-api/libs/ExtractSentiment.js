const { positiveWords, negativeWords } = require('../nlp/dictionary')

function sentimentAnalysis(text) {
    const words = text.toLowerCase().split(/\s+/); // Tokenize the input

    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach((word) => {
        if (positiveWords.includes(word)) {
            positiveCount++;
        } else if (negativeWords.includes(word)) {
            negativeCount++;
        }
    });

    // Calculate sentiment score as a ratio between positive and negative counts
    const totalWords = words.length;
    const sentimentScore = (positiveCount - negativeCount) / totalWords;

    // Scale the sentiment score to the range [-1, 1]
    const minScore = -1.0; 
    const maxScore = 1.0;  
    const scaledScore = minScore + sentimentScore * (maxScore - minScore);

    return scaledScore;
}


const analyzeSentimentForCaptions = (captions) => {
    const sentiments = [];

    try {

        // Analyze sentiment for each caption
        captions.forEach((caption) => {
            if (caption) {
                const sentiment = sentimentAnalysis(caption); 
                sentiments.push(sentiment);
            }
        });

        // Calculate the average sentiment score
        const totalSentiment = sentiments.reduce((acc, val) => acc + val, 0);
        const averageSentiment = sentiments.length > 0 ? totalSentiment / sentiments.length : 0;

        return { sentimentScore: averageSentiment, error: null };
    } catch (error) {
        console.log(error);
        return { sentimentScore: null, error: error };
    }
};

module.exports = {
    analyzeSentimentForCaptions: analyzeSentimentForCaptions,
};
