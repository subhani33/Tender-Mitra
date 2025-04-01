/**
 * Utility to filter only allowed fields from an object
 * Used to prevent mass assignment vulnerabilities
 * 
 * @param {Object} obj - The object to filter
 * @param {...String} allowedFields - The allowed field names
 * @returns {Object} - The filtered object with only allowed fields
 */
module.exports = (obj, ...allowedFields) => {
    const newObj = {};

    Object.keys(obj).forEach((key) => {
        if (allowedFields.includes(key)) {
            newObj[key] = obj[key];
        }
    });

    return newObj;
};