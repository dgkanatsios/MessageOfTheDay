const storagehelpers = require('../shared/storagehelpers');
const utilities = require('../shared/utilities');

module.exports = function (context, req) {

    const now = new Date();
    let promises = [];

    //this message is only visible today
    promises.push(storagehelpers.insertIntoTable({
        title: "title1",
        message: "message1",
        from: new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0),
        to: new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0)
    }));

    //this message will always be visible
    promises.push(storagehelpers.insertIntoTable({
        title: "title2",
        message: "message2",
        priority: 1
    }));

     //this message will always be visible, has a lower priority than the previous one
     promises.push(storagehelpers.insertIntoTable({
        title: "title3",
        message: "message3",
        priority: 2
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