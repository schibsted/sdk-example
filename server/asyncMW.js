/**
 * Checks if a given value is a promise
 * @param {Promise} val - a value that should be tested to be a promise
 * @return {boolean}
 */
function isPromiseLike(val) {
    if (val instanceof Promise) {
        return true;
    }
    return typeof val === 'object' && val !== null && typeof val.catch === 'function';
}

/**
 * A simple utility function that takes an async middleware and returns a middleware that
 * behaves the way that express expects
 * @param {function} middleware
 * @return {function}
 */
function asyncMW(middleware) {
    return (req, res, next) => {
        try {
            const result = middleware(req, res, next)
            if (isPromiseLike(result)) {
                result.catch((err = 'undefined error') => next(err));
            }
        } catch (err) {
            next(err || 'Unknown sync error from middleware');
        }
    };
}

module.exports = asyncMW;
