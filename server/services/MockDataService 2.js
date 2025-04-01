/**
 * MockDataService - Provides MongoDB-like service interface when using MockDB
 * Acts as an adapter between Mongoose-style queries and our in-memory MockDB
 */

const mockDB = require('../models/MockDB');
const logger = require('../utils/logger');

class MockDataService {
    constructor(modelName) {
        this.collectionName = modelName.toLowerCase();
        this.mockDB = mockDB;

        // Initialize the collection
        this.mockDB.createCollection(this.collectionName);

        logger.debug(`MockDataService initialized for collection: ${this.collectionName}`);
    }

    /**
     * Find documents matching a query
     * @param {Object} query - Query object
     * @param {Object} projection - Fields to include/exclude (not fully implemented)
     * @returns {Array} - Matching documents
     */
    async find(query = {}, projection = {}) {
        logger.debug(`Mock find operation on ${this.collectionName}`);
        return this.mockDB.find(this.collectionName, query);
    }

    /**
     * Find a single document matching a query
     * @param {Object} query - Query object
     * @returns {Object|null} - Matching document or null
     */
    async findOne(query = {}) {
        logger.debug(`Mock findOne operation on ${this.collectionName}`);
        return this.mockDB.findOne(this.collectionName, query);
    }

    /**
     * Find document by ID
     * @param {string} id - Document ID
     * @returns {Object|null} - Matching document or null
     */
    async findById(id) {
        logger.debug(`Mock findById operation on ${this.collectionName} for ID: ${id}`);
        return this.mockDB.findById(this.collectionName, id);
    }

    /**
     * Create a new document
     * @param {Object} data - Document data
     * @returns {Object} - Created document
     */
    async create(data) {
        logger.debug(`Mock create operation on ${this.collectionName}`);
        return this.mockDB.insertOne(this.collectionName, data);
    }

    /**
     * Update a document
     * @param {Object} query - Query to find document
     * @param {Object} update - Update data
     * @param {Object} options - Update options
     * @returns {Object} - Update result
     */
    async updateOne(query, update, options = {}) {
        logger.debug(`Mock updateOne operation on ${this.collectionName}`);
        return this.mockDB.updateOne(this.collectionName, query, update);
    }

    /**
     * Update document by ID
     * @param {string} id - Document ID
     * @param {Object} update - Update data
     * @returns {Object} - Updated document
     */
    async findByIdAndUpdate(id, update) {
        logger.debug(`Mock findByIdAndUpdate operation on ${this.collectionName} for ID: ${id}`);
        const query = { _id: id };

        // Transform update data if needed
        let updateObj = update;
        if (!update.$set && typeof update === 'object') {
            updateObj = { $set: update };
        }

        await this.mockDB.updateOne(this.collectionName, query, updateObj);
        return this.mockDB.findById(this.collectionName, id);
    }

    /**
     * Delete a document
     * @param {Object} query - Query to find document
     * @returns {Object} - Delete result
     */
    async deleteOne(query) {
        logger.debug(`Mock deleteOne operation on ${this.collectionName}`);
        return this.mockDB.deleteOne(this.collectionName, query);
    }

    /**
     * Delete document by ID
     * @param {string} id - Document ID
     * @returns {Object} - Delete result
     */
    async findByIdAndDelete(id) {
        logger.debug(`Mock findByIdAndDelete operation on ${this.collectionName} for ID: ${id}`);
        const doc = await this.mockDB.findById(this.collectionName, id);
        const result = await this.mockDB.deleteOne(this.collectionName, { _id: id });
        return result.deletedCount > 0 ? doc : null;
    }

    /**
     * Count documents matching a query
     * @param {Object} query - Query object
     * @returns {number} - Count of matching documents
     */
    async countDocuments(query = {}) {
        logger.debug(`Mock countDocuments operation on ${this.collectionName}`);
        const docs = await this.mockDB.find(this.collectionName, query);
        return docs.length;
    }

    /**
     * Check if any documents match a query
     * @param {Object} query - Query object
     * @returns {boolean} - Whether any documents match
     */
    async exists(query) {
        logger.debug(`Mock exists operation on ${this.collectionName}`);
        const doc = await this.mockDB.findOne(this.collectionName, query);
        return doc !== null;
    }
}

module.exports = MockDataService;