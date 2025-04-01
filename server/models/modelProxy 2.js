/**
 * Model Proxy - Manages switching between Mongoose and MockDB models
 * This module automatically routes data operations to either MongoDB (via Mongoose)
 * or to our MockDB implementation, based on the connection status.
 */

const mongoose = require('mongoose');
const MockDataService = require('../services/MockDataService');
const logger = require('../utils/logger');

/**
 * Create a proxy that will route operations to either Mongoose model or MockDB
 * @param {Object} mongooseModel - The Mongoose model
 * @param {String} modelName - The name of the model (for MockDB)
 * @returns {Proxy} - A proxy object that routes to appropriate implementation
 */
const createModelProxy = (mongooseModel, modelName) => {
    // Create mock service instance
    const mockService = new MockDataService(modelName || mongooseModel.modelName);

    // Function to determine if we should use mock data
    const shouldUseMock = () => {
        return global.USING_MOCK_DATA === true ||
            mongoose.connection.readyState !== 1; // Not connected
    };

    // Create a proxy to intercept all method calls
    return new Proxy(mongooseModel, {
        get(target, prop, receiver) {
            // Check if we should use mock implementation
            if (shouldUseMock()) {
                if (prop in mockService) {
                    // Log the first time we switch to mock mode for this model
                    if (!target._hasLoggedMockSwitch) {
                        logger.warn(`Using mock implementation for ${modelName || target.modelName} (${prop})`);
                        target._hasLoggedMockSwitch = true;
                    }
                    return mockService[prop].bind(mockService);
                }

                // Special handling for static methods not implemented in mockService
                if (prop === 'countDocuments' && typeof mockService.countDocuments === 'function') {
                    return mockService.countDocuments.bind(mockService);
                }

                // Handle case when method not implemented in mock
                logger.warn(`Method ${prop} not implemented in mock service for ${modelName || target.modelName}`);
            }

            // Use the real mongoose model
            return Reflect.get(target, prop, receiver);
        },

        // Handle constructor calls
        construct(target, args) {
            if (shouldUseMock()) {
                // For document creation, use the mock service
                logger.debug(`Creating ${modelName || target.modelName} document with mock implementation`);
                // We can't actually construct a mock document, 
                // but we can create an object with the data
                return {...args[0], _isMockDocument: true };
            }

            // Use the real mongoose model constructor
            return Reflect.construct(target, args);
        }
    });
};

module.exports = createModelProxy;