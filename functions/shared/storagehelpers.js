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
                        PartitionKey: id,
                        RowKey: id,
                        Message: body.message,
                        Title: body.title,
                        Priority: body.priority || 100
                    };

                    if (body.from && body.to) {
                        messageData.From = new Date(body.from);
                        messageData.To = new Date(body.to);
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
                        .where('From lt ?', now)
                        .and('To gt ?', now);
                    tableSvc.queryEntities(tableName, query, null, function (error, result, response) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.entries.map(entry => {
                                return {
                                    Message: entry.Message._,
                                    Title: entry.Title._,
                                    Priority: entry.Priority._
                                };
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