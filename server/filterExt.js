const path = require('path');

/**
 * Creates a middleware that filters in certain extensions
 * @param {string[]} whiteListExt
 * @return {function} - the actual middleware
 */
function middlewareFactory(...whiteListExt) {
    const normalizedExts = whiteListExt
        .map((s) => (s.charAt(0) === '.' ? s : `.${s}`))
        .map((s) => s.toLowerCase());

    /**
     * The actual middleware that filters requests based on their extensions
     * @param {object} req
     * @param {object} res
     * @param {function} next
     * @return {void}
     */
    function middleware(req, res, next) {
        const ext = path.extname(req.url);
        if (typeof ext === 'string' && normalizedExts.indexOf(ext.toLowerCase()) !== -1) {
            next();
        } else {
            // bypass the remaining route callback(s) @see http://expressjs.com/en/4x/api.html#app.use
            next('route');
        }
    }

    return middleware;
}

module.exports = middlewareFactory;
