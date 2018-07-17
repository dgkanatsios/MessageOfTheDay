const storagehelpers = require('../shared/storagehelpers');
const utilities = require('../shared/utilities');

module.exports = function (context, req) {
    storagehelpers.getMessages().then((res)=>{
        context.res = {
            status: 200,
            body: res,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        context.done();
    }).catch(error => {
        context.log(error);
        utilities.setErrorAndCloseContext(context, error, 500);
    });
};