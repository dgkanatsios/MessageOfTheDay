[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![unofficial Google Analytics for GitHub](https://gaforgithub.azurewebsites.net/api?repo=MessageOfTheDay)](https://github.com/dgkanatsios/gaforgithub)
# Message Of The Day

A simple "Message Of The Day" implementation for gaming clients, using [Azure Functions](https://functions.azure.com) and [Azure Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/) for the backend. Functions implemented in Node.js.

## One-click deployment

Click the following button to deploy the project to your Azure subscription:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdgkanatsios%2FMessageOfTheDay%2Fmaster%2Fdeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

This operation will trigger a template deployment of the [deploy.json](deploy.json) ARM template file to your Azure subscription, which will create the necessary Azure resources as well as pull the source code from this repository (or your fork). 

## Architecture - Technical Details

The message of the day API is served by [Azure Functions](https://functions.azure.com) whereas the storage is implemented using [Azure Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/), thus making this solution pretty inexpensive. The name of the Table Storage table is a random string plus 'messages' (e.g. 'aj7pc3e5tixr4messages') whereas the Function App contains 3 Functions, all of which are [HTTP triggered](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook#trigger---javascript-example):

- *sampleadd*: you can call this Function to add 3 sample messages for your game
- *getmessages*: this Function will return the list of messages in JSON format
```json
[
    {
        "message":"message2",
        "title":"title2",
        "priority":1,
        "alwaysShow":true
    },
    {
        "message":"message3",
        "title":"title3",
        "priority":2,
        "alwaysShow":true
    },
    {
        "message":"message1",
        "title":"title1",
        "priority":100,
        "from":"2018-07-17T00:00:00Z",
        "to":"2018-07-19T00:00:00Z",
        "alwaysShow":false
    }
]
```
The *getmessages* Function has a 10-minute cache enabled by default, to modify it change the code in `functions/getmessages/index.js` file. Take into consideration that the cache will be reloaded each time the Function scales (possibly due to many requests) or taken down by the runtime due to inactivity.
- *add*: this Function allows you to add a custom message in JSON format. `title` and `message` properties are required, you can also set `from` and `to` if you want your message to appear in a specific day (this is the message of the day after all). You can optionally set a `priority` (lower comes first)
```json
{
    "title":"title1",
    "message":"message1",
    "from":"2018-07-20T00:00:00.000Z",
    "to":"2018-07-21T00:00:00.000Z",
    "priority":"1"
}

```
A JSON object like this should be passed in the POST data. `From`,`To` and `Priority` are optional. If you omit `Priority`, it will be automatically setup to a default of 100 (pretty low). If you omit `From` and `To`, your message will always be sent to the clients, unless you manually set an `AlwaysShow` property to 'false'. All dates/times are in UTC, the details regarding date/time format for the `From` and `To` variables are the following:

This is a sample entry for July 17th, 2018, at 00:00 UTC
```
2018-07-17T00:00:00.000Z
```

This is a sample entry for July 20th, 2018, at 13:25 UTC
```
2018-07-20T13:25:00.000Z
```

This is a sample entry for July 21st, 2019, at 05:17 UTC
```
2019-07-21T05:17:00.000Z
```

As you can see, the format for UTC date-time objects is:

`YEAR`-`MONTH`-`DAY_OF_MONTH`T`HOUR`:`MINUTE`:`SECONDS`.`MILISECONDS`Z

Last but not least, a Unity game engine SDK and sample scene (compatible with Unity 5.6 and higher) is provided in the `client-unity` folder.

## Adding/editing/deleting messages

In order to add new messages, you can use the *add* Function, as previously described. Moreover, to add/edit/delete messages you can use the free and cross-platform utility called [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/). There, you can also set the `AlwaysShow` boolean variable to true/false, depending on whether you want your message to be visible to the clients.

## Resources

- [Azure Table Storage design guide](https://docs.microsoft.com/en-us/azure/cosmos-db/table-storage-design-guide)
- [Azure Functions documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Functions Consumption Plan](https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale#consumption-plan)