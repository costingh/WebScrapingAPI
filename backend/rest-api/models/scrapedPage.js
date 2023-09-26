const mongoose = require("mongoose");

const ScrapedPageSchema = new mongoose.Schema({
    page_url: {
        type: String,
        required: true,
    },
    content: {
        type: Object,
    },
    date: { type: Date, default: Date.now },
});

module.exports.ScrapedPageModel = mongoose.model("ScrapedPage", ScrapedPageSchema);
