const storagehelpers = require('../shared/storagehelpers');
const utilities = require('../shared/utilities');

module.exports = function (context, req) {
    if (utilities.validateMessageData(context.body)) {
        storagehelpers.insertIntoTable(context.body).catch(error => {
            utilities.setErrorAndCloseContext(context, error, 500);
        }).then((res) => {
            context.res = {
                body: res
            };
            context.done();
        });
    } else {
        utilities.setErrorAndCloseContext(context, "Need POST Data with 'title' and 'message'", 400);
    }

};