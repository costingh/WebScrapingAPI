# WebScrapingAPI

## Overview

WebScrapingAPI is a versatile web scraping and sentiment analysis tool designed for extracting structured data from webpages and performing sentiment analysis on text.

## Installation

Clone the repository: git@github.com:costingh/WebScrapingAPI.git

## Folder structure
```shell
/WebScrapingAPI/backend-rest-api
/WebScrapingAPI/frontend
```

```sh
$ git clone git@github.com:costingh/WebScrapingAPI.git

// NodeJS backend
$ cd WebScrapingAPI
$ cd backend/rest-api
$ npm install
$ npm run dev (or nodemon server.js)

// VueJS frontend
$ cd WebScrapingAPI
$ cd frontend
$ npm install
$ npm run dev
```

### Environment variables

Environment variables that should be used for configuration

- `Backend WebScrapingAPI/backend/rest-api`

    | NAME          | TYPE                                     | Example                                    |
    | ----------- | ---------------------------------------- | ------------------------------------------ |
    | DATABASE_URI | `string` | mongodb+srv://username:password@cluster0.2ailkhj.mongodb.net/?retryWrites=true&w=majority                |
    | PORT       | `number`      | `3000` |
    


## API ROUTES


| Type                  | Url                                         | Description                     |
| --------------------- | --------------------------------------------| -------------------------- |
| POST                  | /api/scrape/page                            | Scrape a page at a given url. This request accepts options.       |
| GET                   | /api/scrape/get-data/:scrapeId              | Get the scraped content of a webpage (retrieve it from database)            |
| POST                  | /api/nlp/sentiment-analyzer                 | Analyze sentiment of a given input text as a score number in [-1, 1] interval             |


### POST /api/scrape/page

```bash
Request Data Fromat
```

```js
{
    "url":  string,
     "options": {
         "test_mode": boolean,
         "scrape_elements": string, // html elements separated by ", ": "h1, h2, h4, h5, a, span, div, sup, img"
         "extract_sentiment": boolean
    }
}
```

```bash
Response Data Fromat
```

```js
{
    "error": null | "string",
    "result": {
        "date": "DateTime",
        "page_url": "string",
        "totalWordsInPostsCaptions": "number",
        "totalWordCount": "number",
        "sentiment": "number", // a floating point number in the interval [-1, 1], where -1 is negative sentiment and 1 positive
        "content": [
          {
            "url": "string",
            "data": [
              "tag": "string", // div, img, h2, span, etc.
              "text": "string",
              "src": "string", // only for img tags,
              "alt": "string" // only for img tags,
              "href": "string", // only for anchor tags
               "baseUrl": "string" // only for img tags and a, represents the base url of the scanned page as the src or href are relative and not absolute paths
              "words": "number", // integer number that represents the word count of the text field if it exists
              
            ]
          }
        ]
    }
}
```


### GET /api/scrape/get-data/:scrapeId 
###### Returns a record saved in the db, which represents the scraped content of a webpage. The record is saved with an id that is the hashed version of the url page.


```bash
Response Data Fromat
```

```js
{
    "error": "null" | "string",
    "result": {
        "date": "DateTime",
        "page_url": "string",
        "totalWordsInPostsCaptions": "number",
        "totalWordCount": "number",
        "sentiment": "number", // a floating point number in the interval [-1, 1], where -1 is negative sentiment and 1 positive
        "content": [
          {
            "url": "string",
            "data": [
              "tag": "string", // div, img, h2, span, etc.
              "text": "string",
              "src": "string", // only for img tags,
              "alt": "string" // only for img tags,
              "href": "string", // only for anchor tags
               "baseUrl": "string" // only for img tags and a, represents the base url of the scanned page as the src or href are relative and not absolute paths
              "words": "number", // integer number that represents the word count of the text field if it exists
              
            ]
          }
        ]
    }
}
```


### POST /api/nlp/sentiment-analyzer

```bash
Request Data Fromat
```

```js
{
  text: string, // represents the text to be scanned for sentiment analysis
}
```

```bash
Response Data Fromat
```

```js
{
  "result": null | "number", // "represents a number between -1 and 1"
  "error": null | "string"

}
```

## Improvements

### Pagination

* Limiting Result Size: Instead of returning the entire dataset in a single response, we should limit the number of records returned by default. For example, setting up a default limit of 10 records per page.

* Allowing Custom Page Size: Allowing users to specify the number of records they want per page. We should include a query parameter in the API request, such as ?page_size=20, to let users customize the result set size.

* Including Page Number: Return the current page number along with the results. This helps users keep track of where they are in the dataset.

* Provide Navigation Links: Include links or URLs for navigating to the next and previous pages. For example:

* Rate Limiting: Implementing rate limiting to prevent abuse and ensure fair usage.

* Default Depth: Setting up a reasonable default value for maxScrapingPageDepth. This default value should strike a balance between providing useful data and preventing excessive scraping.

* User Configured Depth: Allowing users to customize the maxScrapingPageDepth by including it as an option in the API request. For example, users can set ?max_depth=5 to limit scraping to a depth of 5 levels.

* Extract topic or top keywords from scraped data - using an auxiliar queue to schedule scraped data for topic extraction and update the database record with the topics

* Analyze images to extract objects from them using AI or Machine learning -could not be done on the fly (queuing each image on a queue, where a consumer comes in to analyze it and extract the objects from it,then save it to database).
* Rotating Proxies: To avoid getting banned or throttled by websites, implementing proxy rotation would be a great idea. This means switching between different proxy IPs for each request.
* Change Monitoring: Email notifier/ User notifier when scraped data (that scrapes at regular time intervals) matches a specific expression
* Data export format as CSV, XLS: Exporting extracted data in user desired format
* Scraping Scheduling: Allow users to schedule automatic scraping at specified intervals, making it easy to keep data up to date without manual intervention.
* Browser Extension: Developing a browser extension that integrates with this API, allowing users to scrape content from webpages directly through their web browser.
