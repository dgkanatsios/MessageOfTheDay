const storagehelpers = require('../shared/storagehelpers');
const utilities = require('../shared/utilities');

module.exports = function (context, req) {

    const now = new Date();
    let promises = [];

    promises.push(storagehelpers.insertIntoTable({
        title: "title1",
        message: "message1",
        from: now,
        to: new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours() + 2, now.getUTCMinutes(), now.getUTCSeconds())
    }));

    promises.push(storagehelpers.insertIntoTable({
        title: "title2",
        message: "message2"
    }));


    Promise.all(promises).catch(error => {
        utilities.setErrorAndCloseContext(context, error, 500);
    }).then((res) => {
        context.res = {
            body: res
        };
        context.done();
    });


};