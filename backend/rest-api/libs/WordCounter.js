const WordCounter = (inputString) => {
    try {
        const words = inputString.split(/\s+/);
        const nonEmptyWords = words.filter(word => word.trim() !== '');
        return nonEmptyWords.length;
    } catch (error) {
        console.log(error)
        return 0
    }
}

module.exports.WordCounter = WordCounter;