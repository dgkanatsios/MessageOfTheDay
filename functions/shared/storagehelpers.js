const azurestorage = require('azure-storage');
const uuidv4 = require('uuid/v4');
const constants = require('./constants');
const tableName = constants.tableName;

function insertIntoTable(body) {
    return new Promise(function (resolve, reject) {
        const tableSvc = azurestorage.createTableService();
        tableSvc.createTableIfNotExists(tableName,
            function (error, result, response) {
                if (error) {
                    reject(error);
                } else {
                    const id = uuidv4();

                    const messageData = {
                        PartitionKey: constants.partitionKey,
                        RowKey: id,
                        Message: body.message,
                        Title: body.title,
                        Priority: body.priority || 100
                    };

                    if (body.from && body.to) {
                        messageData.From = new Date(body.from);
                        messageData.To = new Date(body.to);
                    }
                    else {
                        messageData.IsActive = true;
                    }


                    tableSvc.insertEntity(tableName, messageData, function (error, result, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(`Inserted Message Of The Day with ID ${messageData.RowKey} and Title ${messageData.Title} and Message ${messageData.Message}`);
                        }
                    });
                }
            });
    });
}

function getMessages() {
    return new Promise(function (resolve, reject) {
        const tableSvc = azurestorage.createTableService();
        tableSvc.createTableIfNotExists(tableName,
            function (error, result, response) {
                if (error) {
                    reject(error);
                } else {
                    const now = new Date();
                    const query = new azurestorage.TableQuery()
                        .where('From lt ? and To gt ?', now, now)
                        .or('IsActive eq ?', true);
                    tableSvc.queryEntities(tableName, query, null, function (error, result, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.entries.map(entry => {
                                const data = {
                                    message: entry.Message._,
                                    title: entry.Title._,
                                    priority: entry.Priority._
                                };

                                //if entry.From is missing, then we are not sending back values for From and To
                                if (entry.From && entry.To) {
                                    data.from = entry.From._;
                                    data.to = entry.To._;
                                }
                               
                                if (entry.IsActive) {
                                    data.isActive = entry.IsActive._;
                                }
                                else {
                                    data.isActive = false;
                                }

                                return data;
                            }).sort((a, b) => {
                                if (a.Priority > b.Priority) {
                                    return 1;
                                }
                                else if (a.Priority < b.Priority) {
                                    return -1
                                }
                                else return 0;
                            }));
                        }
                    });

                }
            });
    });
}


module.exports = {
    insertIntoTable,
    getMessages
};

getMessages();