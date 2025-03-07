class CustomApiError extends Error {
    constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    }
}

const createCustomApiError = (message, statusCode) => {
    return new CustomApiError(message, statusCode);
}

module.exports = {createCustomApiError, CustomApiError};