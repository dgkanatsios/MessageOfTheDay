[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![unofficial Google Analytics for GitHub](https://gaforgithub.azurewebsites.net/api?repo=MessageOfTheDay)](https://github.com/dgkanatsios/gaforgithub)
# Message Of The Day

A simple Message Of The Day implementation for gaming clients, using [Azure Functions](https://functions.azure.com)

## Architecture - Technical Details

The message of the day API is served by [Azure Functions](https://functions.azure.com) whereas the storage is implemented using [Azure Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/), thus making this solution pretty inexpensive. Function App contains 3 Functions:

- *sampleadd*: you can call this Function to add 3 sample messages for your game
- *getmessages*: this Function will return the list of messages in JSON format
```json
[{"Message":"message2","Title":"title2","Priority":1,"AlwaysShow":true},{"Message":"message3","Title":"title3","Priority":2,"AlwaysShow":true},{"Message":"message1","Title":"title1","Priority":100,"From":"2018-07-17T00:00:00Z","To":"2018-07-19T00:00:00Z","AlwaysShow":false}]
```
- *add*: this Function allows you to add a custom message in JSON format. `title` and `message` properties are required, you can also set `from` and `to` if you want your message to appear in a specific day (this is the message of the day after all). You can optionally set a `priority` (lower comes first)

## One-click deployment

Click the following button to deploy the project to your Azure subscription:

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fdgkanatsios%2FMessageOfTheDay%2Fmaster%2Fdeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

This operation will trigger a template deployment of the [deploy.json](deploy.json) ARM template file to your Azure subscription, which will create the necessary Azure resources as well as pull the source code from this repository. 

To add/edit/delete messages you can see the free and cross-platform utility [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/).

## Resources

- [Azure Table Storage design guide](https://docs.microsoft.com/en-us/azure/cosmos-db/table-storage-design-guide)
- [Azure Functions documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Functions Consumption Plan](https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale#consumption-plan)