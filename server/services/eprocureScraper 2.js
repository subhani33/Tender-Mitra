const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const cache = require('../utils/cache');

class EprocureScraper {
    constructor() {
        this.baseUrl = 'https://eprocure.gov.in/eprocure/app';
        this.activeTendersUrl = `${this.baseUrl}?page=FrontEndLatestActiveTenders&service=page`;
        this.tendersByDateUrl = `${this.baseUrl}?page=FrontEndListTendersbyDate&service=page`;
        this.browserInstance = null;
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
        this.maxRetries = 3;
        this.retryDelay = 2000; // 2 seconds
    }

    async initialize() {
        try {
            this.browserInstance = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--window-size=1920x1080',
                ]
            });
            logger.info('Browser instance initialized for eprocure.gov.in scraping');
            return true;
        } catch (error) {
            logger.error(`Failed to initialize browser: ${error.message}`);
            return false;
        }
    }

    async close() {
        if (this.browserInstance) {
            await this.browserInstance.close();
            this.browserInstance = null;
            logger.info('Browser instance closed');
        }
    }

    async getActiveTenders() {
        const cacheKey = 'active_tenders';
        const cachedData = await cache.get(cacheKey);

        if (cachedData) {
            logger.info('Returning active tenders from cache');
            return JSON.parse(cachedData);
        }

        let page;
        try {
            if (!this.browserInstance) {
                await this.initialize();
            }

            page = await this.browserInstance.newPage();
            await page.setUserAgent(this.userAgent);
            await page.setViewport({ width: 1920, height: 1080 });

            // Navigate to the active tenders page
            logger.info(`Navigating to ${this.activeTendersUrl}`);
            await page.goto(this.activeTendersUrl, { waitUntil: 'networkidle2', timeout: 60000 });

            // Solve CAPTCHA if necessary (this is a placeholder - CAPTCHA solving would require additional services)
            const hasCaptcha = await page.evaluate(() => {
                return document.querySelector('img[src*="captcha"]') !== null;
            });

            if (hasCaptcha) {
                logger.warn('CAPTCHA detected, attempting to bypass...');
                // Implementation of CAPTCHA solving would go here
                // This might involve using a service like 2Captcha or Anti-Captcha
            }

            // Wait for tender table to load
            await page.waitForSelector('table', { timeout: 10000 }).catch(() => {
                logger.warn('Table selector not found, may be using a different structure');
            });

            const html = await page.content();
            const tenders = await this.parseTendersFromHTML(html);

            // Cache the results for 15 minutes
            await cache.set(cacheKey, JSON.stringify(tenders), 60 * 15);

            return tenders;
        } catch (error) {
            logger.error(`Failed to fetch active tenders: ${error.message}`);
            throw error;
        } finally {
            if (page) {
                await page.close();
            }
        }
    }

    async getTenderDetails(tenderId) {
        const cacheKey = `tender_details_${tenderId}`;
        const cachedData = await cache.get(cacheKey);

        if (cachedData) {
            logger.info(`Returning tender details for ${tenderId} from cache`);
            return JSON.parse(cachedData);
        }

        let page;
        try {
            if (!this.browserInstance) {
                await this.initialize();
            }

            page = await this.browserInstance.newPage();
            await page.setUserAgent(this.userAgent);

            // Construct the URL for the specific tender
            const detailUrl = `${this.baseUrl}?page=PBPublishedTenderLists&service=page&tenderId=${tenderId}`;

            logger.info(`Navigating to tender details page: ${detailUrl}`);
            await page.goto(detailUrl, { waitUntil: 'networkidle2', timeout: 60000 });

            const html = await page.content();
            const details = await this.parseTenderDetailsFromHTML(html, tenderId);

            // Cache the results for 1 hour
            await cache.set(cacheKey, JSON.stringify(details), 60 * 60);

            return details;
        } catch (error) {
            logger.error(`Failed to fetch tender details for ${tenderId}: ${error.message}`);
            throw error;
        } finally {
            if (page) {
                await page.close();
            }
        }
    }

    async parseTendersFromHTML(html) {
        try {
            const $ = cheerio.load(html);
            const tenders = [];

            // Find the table with tender listings
            const tenderTable = $('table').filter((i, table) => {
                return $(table).find('tr').first().text().includes('Title') ||
                    $(table).find('tr').first().text().includes('Tender ID');
            });

            if (tenderTable.length === 0) {
                logger.warn('No tender table found in HTML');
                return [];
            }

            // Parse each row in the table (skip header row)
            $(tenderTable).find('tr').slice(1).each((i, row) => {
                const columns = $(row).find('td');

                // Skip rows with insufficient columns
                if (columns.length < 5) return;

                // Extract tender information from columns
                // Note: Column indices may need adjustment based on the actual structure
                const tenderId = $(columns[1]).text().trim().split('/').pop() || uuidv4();
                const title = $(columns[3]).text().trim();
                const organization = $(columns[4]).text().trim();
                const publishedDate = $(columns[0]).text().trim();
                const closingDate = $(columns[1]).text().trim();
                const openingDate = $(columns[2]).text().trim();

                // Determine status based on dates
                const now = new Date();
                const closeDate = new Date(closingDate);
                let status = 'Open';

                if (closeDate < now) {
                    status = 'Closed';
                } else if (closeDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
                    status = 'Closing Soon';
                }

                // Create tender object
                const tender = {
                    referenceNumber: tenderId,
                    title: title,
                    department: organization,
                    deadline: closingDate,
                    status: status,
                    value: 0, // Value might not be available in the listing
                    description: '', // Will be fetched in detail view
                    location: '', // Will be fetched in detail view
                    category: '', // Will be fetched in detail view
                    publishedDate: publishedDate,
                    openingDate: openingDate,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                tenders.push(tender);
            });

            logger.info(`Parsed ${tenders.length} tenders from HTML`);
            return tenders;
        } catch (error) {
            logger.error(`Failed to parse tenders from HTML: ${error.message}`);
            return [];
        }
    }

    async parseTenderDetailsFromHTML(html, tenderId) {
        try {
            const $ = cheerio.load(html);

            // Extract detailed information
            const title = $('td:contains("Tender Title")').next().text().trim();
            const organization = $('td:contains("Organisation Chain")').next().text().trim();
            const referenceNumber = tenderId;
            const value = $('td:contains("Tender Value")').next().text().trim();
            const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
            const category = $('td:contains("Tender Category")').next().text().trim();
            const location = $('td:contains("Tender Location")').next().text().trim();
            const description = $('td:contains("Work Description")').next().text().trim();
            const deadlineStr = $('td:contains("Bid Submission End Date")').next().text().trim();
            const deadline = new Date(deadlineStr);
            const documents = [];

            // Try to find document links
            $('a[href*="download"]').each((i, element) => {
                const name = $(element).text().trim();
                const url = $(element).attr('href');

                if (name && url) {
                    documents.push({
                        name: name,
                        url: url,
                        type: 'application/pdf', // Assuming PDF, but could be different
                        size: 0
                    });
                }
            });

            // Determine status based on deadline
            const now = new Date();
            let status = 'Open';

            if (deadline < now) {
                status = 'Closed';
            } else if (deadline.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
                status = 'Closing Soon';
            }

            return {
                referenceNumber,
                title,
                department: organization,
                value: numericValue,
                deadline: deadline.toISOString(),
                status,
                description,
                location,
                category,
                documents,
                updatedAt: new Date()
            };
        } catch (error) {
            logger.error(`Failed to parse tender details from HTML: ${error.message}`);
            throw error;
        }
    }

    // Fallback method if Puppeteer fails - uses Axios with Cheerio
    async fetchWithAxios(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': 'text/html,application/xhtml+xml,application/xml',
                    'Accept-Language': 'en-US,en;q=0.9',
                },
                timeout: 30000
            });

            return response.data;
        } catch (error) {
            logger.error(`Axios request failed: ${error.message}`);
            throw error;
        }
    }

    // Mock data generation for testing and fallback
    generateMockTenders(count = 50) {
        const departments = [
            'Ministry of Defence',
            'Ministry of Railways',
            'Ministry of Road Transport',
            'Ministry of Health',
            'Ministry of Education'
        ];

        const categories = [
            'Works',
            'Goods',
            'Services',
            'Mixed'
        ];

        const locations = [
            'New Delhi',
            'Mumbai',
            'Chennai',
            'Kolkata',
            'Bangalore',
            'Hyderabad'
        ];

        const tenders = [];

        for (let i = 0; i < count; i++) {
            const publishDate = new Date();
            publishDate.setDate(publishDate.getDate() - Math.floor(Math.random() * 30));

            const deadline = new Date();
            deadline.setDate(deadline.getDate() + Math.floor(Math.random() * 30));

            const openingDate = new Date(deadline);
            openingDate.setDate(openingDate.getDate() + 1);

            const tender = {
                referenceNumber: `EPROCURE-${Date.now()}-${i}`,
                title: `Tender for ${categories[Math.floor(Math.random() * categories.length)]} - Project ${i + 1}`,
                department: departments[Math.floor(Math.random() * departments.length)],
                value: Math.floor(Math.random() * 100000000) + 100000,
                deadline: deadline.toISOString(),
                status: deadline > new Date() ? 'Open' : 'Closed',
                description: `Detailed description for Project ${i + 1}. This tender involves various aspects of the project including planning, execution, and maintenance.`,
                location: locations[Math.floor(Math.random() * locations.length)],
                category: categories[Math.floor(Math.random() * categories.length)],
                publishedDate: publishDate.toISOString(),
                openingDate: openingDate.toISOString(),
                documents: [{
                    name: 'Tender Document.pdf',
                    url: 'https://example.com/tender-doc.pdf',
                    type: 'application/pdf',
                    size: 1024 * 1024
                }],
                createdAt: new Date(),
                updatedAt: new Date()
            };

            tenders.push(tender);
        }

        return tenders;
    }
}

module.exports = new EprocureScraper();