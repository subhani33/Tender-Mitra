const Redis = require('ioredis');
const logger = require('./logger');

class Cache {
    constructor() {
        this.client = null;
        this.isRedisAvailable = false;
        this.localCache = new Map();
        this.localCacheExpiry = new Map();

        this.initialize();
    }

    initialize() {
        try {
            // Try to connect to Redis
            const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
            this.client = new Redis(redisUrl, {
                retryStrategy: (times) => {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                maxRetriesPerRequest: 3,
                enableOfflineQueue: false
            });

            this.client.on('connect', () => {
                this.isRedisAvailable = true;
                logger.info('Redis cache connected');
            });

            this.client.on('error', (err) => {
                this.isRedisAvailable = false;
                logger.error(`Redis connection error: ${err.message}. Using local cache instead.`);
            });

            // Graceful shutdown
            process.on('SIGINT', () => {
                if (this.client) {
                    this.client.quit();
                }
            });
        } catch (error) {
            this.isRedisAvailable = false;
            logger.error(`Failed to initialize Redis: ${error.message}. Using local cache instead.`);
        }

        // Start cleaning expired items from local cache every minute
        setInterval(() => this.cleanExpiredLocalCache(), 60000);
    }

    async get(key) {
        try {
            if (this.isRedisAvailable) {
                const value = await this.client.get(key);
                return value;
            } else {
                // Use local cache as fallback
                if (this.localCache.has(key)) {
                    const expiryTime = this.localCacheExpiry.get(key);
                    if (expiryTime && expiryTime > Date.now()) {
                        return this.localCache.get(key);
                    } else {
                        // Remove expired item
                        this.localCache.delete(key);
                        this.localCacheExpiry.delete(key);
                        return null;
                    }
                }
                return null;
            }
        } catch (error) {
            logger.error(`Cache get error: ${error.message}`);
            return null;
        }
    }

    async set(key, value, ttlInSeconds = 3600) {
        try {
            if (this.isRedisAvailable) {
                await this.client.set(key, value, 'EX', ttlInSeconds);
                return true;
            } else {
                // Use local cache as fallback
                this.localCache.set(key, value);
                this.localCacheExpiry.set(key, Date.now() + (ttlInSeconds * 1000));
                return true;
            }
        } catch (error) {
            logger.error(`Cache set error: ${error.message}`);
            return false;
        }
    }

    async del(key) {
        try {
            if (this.isRedisAvailable) {
                await this.client.del(key);
            }
            // Always clean from local cache too
            this.localCache.delete(key);
            this.localCacheExpiry.delete(key);
            return true;
        } catch (error) {
            logger.error(`Cache del error: ${error.message}`);
            return false;
        }
    }

    async flushAll() {
        try {
            if (this.isRedisAvailable) {
                await this.client.flushall();
            }
            // Clear local cache
            this.localCache.clear();
            this.localCacheExpiry.clear();
            return true;
        } catch (error) {
            logger.error(`Cache flushAll error: ${error.message}`);
            return false;
        }
    }

    cleanExpiredLocalCache() {
        const now = Date.now();
        for (const [key, expiry] of this.localCacheExpiry.entries()) {
            if (expiry < now) {
                this.localCache.delete(key);
                this.localCacheExpiry.delete(key);
            }
        }
    }
}

module.exports = new Cache();