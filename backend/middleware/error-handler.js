const {CustomApiError} = require('../errors/custom-error');
const errorHandlerMiddleware = (err, req, res, next) => {
    console.error('Error:', err);  // Log full error details
    if (err instanceof CustomApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Something went wrong, please try again later' });
};


module.exports = errorHandlerMiddleware;