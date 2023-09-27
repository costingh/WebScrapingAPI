export interface ScrapingOptions {
    test_mode: boolean;
    scrape_elements: string;
}

export interface ScrapingRequestBody {
    url: string;
    options: ScrapingOptions;
}