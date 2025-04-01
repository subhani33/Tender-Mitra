/**
 * MockDB - Provides in-memory database functionality when MongoDB is unavailable
 * This serves as a fallback to allow development and testing to continue
 * when the MongoDB connection fails.
 */

const logger = require('../utils/logger');

class MockDB {
    constructor() {
        this.collections = {};
        this.initialized = false;
        this.logger = logger;

        // Auto-incrementing ID counter for each collection
        this.counters = {};

        this.logger.info('MockDB initialized - using in-memory data store');
    }

    /**
     * Initialize the mock database with default collections
     */
    init() {
        if (this.initialized) return;

        // Create default collections
        this.createCollection('users');
        this.createCollection('todos');
        this.createCollection('projects');
        this.createCollection('settings');

        // Add some seed data
        this.collections.users.push({
            _id: '1',
            username: 'admin',
            email: 'admin@example.com',
            password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LG1dXgFOLPaQQwEYj4kQ097uG3292JO', // hashed 'password123'
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        this.collections.settings.push({
            _id: '1',
            appName: 'EdTodo',
            theme: 'light',
            features: {
                enableNotifications: true,
                enableTwoFactor: false
            }
        });

        this.initialized = true;
        this.logger.info('MockDB seeded with initial data');
    }

    /**
     * Create a new collection
     * @param {string} name - Collection name
     */
    createCollection(name) {
        if (!this.collections[name]) {
            this.collections[name] = [];
            this.counters[name] = 1;
            this.logger.debug(`Created mock collection: ${name}`);
        }
        return this.collections[name];
    }

    /**
     * Get a collection by name
     * @param {string} name - Collection name
     * @returns {Array} - The collection or empty array if not found
     */
    collection(name) {
        if (!this.initialized) this.init();

        if (!this.collections[name]) {
            this.createCollection(name);
        }
        return this.collections[name];
    }

    /**
     * Generate a new ID for an item in a collection
     * @param {string} collectionName - Collection name
     * @returns {string} - New ID
     */
    generateId(collectionName) {
        if (!this.counters[collectionName]) {
            this.counters[collectionName] = 1;
        }
        return (this.counters[collectionName]++).toString();
    }

    /**
     * Find documents in a collection
     * @param {string} collectionName - Collection name
     * @param {Object} query - Query object for filtering
     * @returns {Array} - Matching documents
     */
    find(collectionName, query = {}) {
        const collection = this.collection(collectionName);

        if (Object.keys(query).length === 0) {
            return [...collection]; // Return a copy to prevent direct modification
        }

        return collection.filter(item => this._matchesQuery(item, query));
    }

    /**
     * Find one document in a collection
     * @param {string} collectionName - Collection name
     * @param {Object} query - Query object for filtering
     * @returns {Object|null} - Matching document or null
     */
    findOne(collectionName, query = {}) {
        const results = this.find(collectionName, query);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Find document by ID
     * @param {string} collectionName - Collection name
     * @param {string} id - Document ID
     * @returns {Object|null} - Matching document or null
     */
    findById(collectionName, id) {
        return this.findOne(collectionName, { _id: id });
    }

    /**
     * Insert a document into a collection
     * @param {string} collectionName - Collection name
     * @param {Object} document - Document to insert
     * @returns {Object} - Inserted document with _id
     */
    insertOne(collectionName, document) {
        const collection = this.collection(collectionName);
        const newDoc = {...document };

        if (!newDoc._id) {
            newDoc._id = this.generateId(collectionName);
        }

        if (!newDoc.createdAt) {
            newDoc.createdAt = new Date();
        }

        if (!newDoc.updatedAt) {
            newDoc.updatedAt = new Date();
        }

        collection.push(newDoc);
        return newDoc;
    }

    /**
     * Update a document in a collection
     * @param {string} collectionName - Collection name
     * @param {Object} query - Query to match documents
     * @param {Object} update - Update data
     * @returns {Object} - Result with matchedCount and modifiedCount
     */
    updateOne(collectionName, query, update) {
        const collection = this.collection(collectionName);
        let matchedCount = 0;
        let modifiedCount = 0;

        for (let i = 0; i < collection.length; i++) {
            if (this._matchesQuery(collection[i], query)) {
                matchedCount++;

                // Apply updates
                if (update.$set) {
                    Object.keys(update.$set).forEach(key => {
                        collection[i][key] = update.$set[key];
                    });
                    collection[i].updatedAt = new Date();
                    modifiedCount++;
                }

                // Handle other update operators like $push, $pull, etc.
                if (update.$push) {
                    Object.keys(update.$push).forEach(key => {
                        if (!Array.isArray(collection[i][key])) {
                            collection[i][key] = [];
                        }
                        collection[i][key].push(update.$push[key]);
                    });
                    collection[i].updatedAt = new Date();
                    modifiedCount++;
                }

                // Only update first match if this is updateOne
                break;
            }
        }

        return { matchedCount, modifiedCount };
    }

    /**
     * Delete a document from a collection
     * @param {string} collectionName - Collection name
     * @param {Object} query - Query to match documents
     * @returns {Object} - Result with deletedCount
     */
    deleteOne(collectionName, query) {
        const collection = this.collection(collectionName);
        let deletedCount = 0;

        for (let i = 0; i < collection.length; i++) {
            if (this._matchesQuery(collection[i], query)) {
                collection.splice(i, 1);
                deletedCount = 1;
                break;
            }
        }

        return { deletedCount };
    }

    /**
     * Check if an item matches a query
     * @param {Object} item - Document to check
     * @param {Object} query - Query object
     * @returns {boolean} - Whether the item matches
     * @private
     */
    _matchesQuery(item, query) {
        for (const key in query) {
            // Handle special MongoDB operators
            if (key === '$or') {
                if (!Array.isArray(query.$or) || !query.$or.some(condition => this._matchesQuery(item, condition))) {
                    return false;
                }
            } else if (key === '$and') {
                if (!Array.isArray(query.$and) || !query.$and.every(condition => this._matchesQuery(item, condition))) {
                    return false;
                }
            } else if (typeof query[key] === 'object' && query[key] !== null) {
                // Handle nested operators like $gt, $lt, etc.
                if (query[key].$eq !== undefined && item[key] !== query[key].$eq) {
                    return false;
                }
                if (query[key].$gt !== undefined && !(item[key] > query[key].$gt)) {
                    return false;
                }
                if (query[key].$gte !== undefined && !(item[key] >= query[key].$gte)) {
                    return false;
                }
                if (query[key].$lt !== undefined && !(item[key] < query[key].$lt)) {
                    return false;
                }
                if (query[key].$lte !== undefined && !(item[key] <= query[key].$lte)) {
                    return false;
                }
                if (query[key].$ne !== undefined && item[key] === query[key].$ne) {
                    return false;
                }
                // Handle $in operator
                if (query[key].$in !== undefined) {
                    if (!Array.isArray(query[key].$in) || !query[key].$in.includes(item[key])) {
                        return false;
                    }
                }
            } else if (item[key] !== query[key]) {
                // Simple equality check
                return false;
            }
        }
        return true;
    }

    /**
     * Clear all data from the mock database
     */
    clear() {
        Object.keys(this.collections).forEach(key => {
            this.collections[key] = [];
        });
        this.logger.info('MockDB cleared - all data reset');
    }
}

// Create a singleton instance
const mockDB = new MockDB();

module.exports = mockDB;