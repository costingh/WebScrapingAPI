const analyzeSentimentForCaptions = (captions) => {
    const sentiments = [];
    try {

        // captions.forEach((caption) => {
        //     if (caption) {
        //     }
        // });


        // const averageSentiment = sentiments.reduce((acc, val) => acc + val, 0) / sentiments.length;
        const averageSentiment = 0.2;
        return { result: averageSentiment, error: null };
    } catch (error) {
        console.log(error)
        return { result: null, error: error };
    }
};

module.exports = {
    analyzeSentimentForCaptions: analyzeSentimentForCaptions,
};
