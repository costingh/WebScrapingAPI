# WebScrapingAPI

## Overview

WebScrapingAPI is a versatile web scraping and sentiment analysis tool designed for extracting structured data from webpages and performing sentiment analysis on text.

## Installation

Clone the repository: git@github.com:costingh/WebScrapingAPI.git

## Implementation

### Technologies & Integrations

For the backend development of this project, Node.js was used to provide a flexible foundation for seamless customization and integration with various technologies such as Puppeteer for web scraping, Cheerio for data extraction, Nodemailer for email communication, and more. The backend contains a REST API designed to scrape specific data, store it in a MongoDB database utilizing the Mongoose library to streamline interactions between the Node.js application and MongoDB. This data can be retrieved, and an automated email is sent to the user who initiated the scraping process. Additionally, the backend features routes for natural language processing (NLP) operations on the scraped data, currently supporting sentiment analysis.

On the frontend, Vue.js was used to create a user-friendly interface. Despite being a technology initially unfamiliar to me, i have crafted a simple application, with routing and other components to display data. Throughout the frontend development, I have gained valuable skills, including communication between child and parent components, the implementation of custom events on HTML elements, and the execution of methods triggered by these events.

Node.js was chosen over Python, despite Python's multi-threading capabilities, due to my familiarity with Node.js and the ease it offers for rapid development.


## Extracting posts caption

I've divided the process of calculating word counts in captions into two distinct tasks.

Firstly, I extract each post caption from the main page (which is essentially a list of posts), count the words in each caption, and then sum up the word counts.

Secondly, I perform a separate task where I count the words in the captions of individual post pages and then add this count to the sum obtained in the first task.

In the first task, I've identified that the caption is contained within an element with the ".group" class, which is a static class name. I've selected the relevant text from these elements for word counting.

For the second task, I've counted the words in all the text found on each post's page, treating each text as a post caption (excluding any words in image alt attributes).

## Sentiment analysis algorithm

To perform sentiment analysis on the scraped content, I have implemented the following algorithm:
    
* First, I tokenize the text, extracting each word (improvement: converting it to lowercase)
* I constructed a dictionary with two lists of words: one for positive words and another for negative words.
* Next, I iterate over the words in the text and count the number of positive and negative words.
* Then, i calculate the sentimentScore as ```js const sentimentScore = (positiveCount - negativeCount) / totalWords;```
* Finally, I normalize the sentiment score to fit within the range of [-1, 1], where -1 represents a negative sentiment, 0 denotes neutrality, and 1 signifies a positive sentiment.
 
## Adding a Unique Feature

As a distinctive addition to this API, I've implemented an email integration feature using Nodemailer. This feature enables automated email notifications to be sent to users once the scraping process is completed. Given that web scraping can be a time-consuming task, especially considering the complexity and depth of certain websites, users now have the option to receive notifications once the application has successfully gathered their requested data.

At the moment, this feature is not implemented in Frontend.
The user receives an email like this one:

```js
Please check the following link to see the scraped data: http://localhost:5173/scraped-data/d9b739d2ecb97f8532e1c3dacd4bb26c
```

To open the link in the Vuejs interface, it is enough to seng a ```GET``` request to the ``` /api/scrape/get-data/:scrapeId``` API route, like this: ```GET /api/scrape/get-data/d9b739d2ecb97f8532e1c3dacd4bb26c```

## Features that could set this API apart / Improvements

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
* Change Monitoring: Email notifier/ User notifier when scraped data (scraped at regular time intervals) matches a specific expression
* Data export format as CSV, XLS: Exporting extracted data in user desired format
* Scraping Scheduling: Allow users to schedule automatic scraping at specified intervals, making it easy to keep data up to date without manual intervention.
* Browser Extension: Developing a browser extension that integrates with this API, allowing users to scrape content from webpages directly through their web browser.
  
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
    "url":  string,                // required
     "options": {                  // optional (each property is optional)
         "test_mode": boolean,
         "scrape_elements": string, // html elements separated by ", ": "h1, h2, h4, h5, a, span, div, sup, img"
         "extract_sentiment": boolean,
         "email_notify": {          
             "notify_user": boolean,
             "user_email": string // email of the receiver of the message
         }
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
        "totalWordsInPostsCaptions": "number", // total words from each post caption (visible on the blog's first page)
        "totalWordCount": "number", // total number of words (including first page's post caption and post description after navigating on the post link)
        "sentiment": "number", // a floating point number in the interval [-1, 1], where -1 is negative sentiment and 1 positive (extracted just from posts captions)
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
        "totalWordsInPostsCaptions": "number", // total words from each post caption (visible on the blog's first page)
        "totalWordCount": "number", // total number of words (including first page's post caption and post description after navigating on the post link)
        "sentiment": "number", // a floating point number in the interval [-1, 1], where -1 is negative sentiment and 1 positive (extracted just from posts captions)
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
