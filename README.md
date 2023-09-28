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

```json
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

```json
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

```json
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

```json
{
  text: string, // represents the text to be scanned for sentiment analysis
}
```

```bash
Response Data Fromat
```

```json
{
  "result": null | "number", // "represents a number between -1 and 1"
  "error": null | "string"

}
```
