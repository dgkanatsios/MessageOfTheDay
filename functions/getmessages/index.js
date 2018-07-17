const storagehelpers = require('../shared/storagehelpers');
const utilities = require('../shared/utilities');

const useInMemoryCache = true;
const cacheDurationInMinutes = 10;

let cache;
let lastUpdated;

module.exports = function (context, req) {

    let p;
    if (useInMemoryCache) {
        const now = new Date();
        if (!lastUpdated) { //cache not loaded yet
            context.log("First time executing - loading data from storage");
            lastUpdated = new Date();
            p = storagehelpers.getMessages();
        }
        else {
            //add cache duration
            const expires = new Date(lastUpdated.getTime() + cacheDurationInMinutes * 60000);
            if (now.getTime() <= expires.getTime()) { //has not expired
                context.log("Using cache - no need to load data from storage");
                p = Promise.resolve(cache);
            }
            else {
                context.log("Cache expired - loading data from storage");
                lastUpdated = new Date();
                p = storagehelpers.getMessages();
            }
        }
    }
    else {
        context.log("Not using cache - loading data from storage");
        lastUpdated = new Date();
        p = storagehelpers.getMessages();
    }

    p.then((res) => {
        //save result to cache
        cache = res;
        //send the response to the client
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