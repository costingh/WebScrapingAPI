const mongoose = require("mongoose");

const ScrapedPageSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    page_url: {
        type: String,
        required: true,
    },
    content: {
        type: Array,
    },
    date: { type: Date, default: Date.now },
});

module.exports.ScrapedPageModel = mongoose.model("ScrapedPage", ScrapedPageSchema);
