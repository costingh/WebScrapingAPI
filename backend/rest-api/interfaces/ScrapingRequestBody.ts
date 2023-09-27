export interface ScrapingOptions {
    test: boolean;
    scrape_elements: string;
}

export interface ScrapingRequestBody {
    url: string;
    options: ScrapingOptions;
}