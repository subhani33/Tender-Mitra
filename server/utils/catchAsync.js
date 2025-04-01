/**
 * Wrapper function to catch async errors in route handlers
 * Eliminates the need for try/catch blocks in controllers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};