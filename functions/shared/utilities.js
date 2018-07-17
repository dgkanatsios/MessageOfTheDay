const constants = require('./constants');

module.exports = {
    validateMessageData: function (body) {
        if (body && body.title && body.message)
            return true;
        else
            return false;
    },
    setErrorAndCloseContext(context, errorMessage, statusCode) {
        context.log(`ERROR: ${errorMessage}`);
        context.res = {
            status: statusCode,
            body: errorMessage,
        };
        context.done();
    }
}