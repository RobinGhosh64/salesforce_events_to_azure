# salesforce_events_to_azure
Capture Events from Salesforce and write into Azure Log Analytics 

Salesforce provides a way to generate events from objects, sobjects, platform and messaging channels.
Details are here:
https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/platform_events_intro.htm

This program reads Platform events from Salesforce, collects the data in Azure Log Analytics realtime and creates a streaming dashboard. Also, we can detect anamolies and alert on them.

I use the Saleforce workbench for testing and pushing events out by forcing some API calls using the query method.
Link to the workbench
https://workbench.developerforce.com/restExplorer.php


You need a .env file with 5 key values.
SF_USERNAME=<Sales Force User ID>
SF_PASSWORD=<Sales Force password>
SF_CHANNEL=<Sales Force Channel path>  /event/ApiEventStream
LAW_ID=<Log Analytics workspace id>
LAW_KEY=<Log Analytics primary or secondary key>
LAW_NAME=<Name of Log Analytics Log Type>


To test locally:
    
    npm install
    npm start or node server.js

To deploy to Azure, create a App Service Plan, crank up a blank Web App using nodejs. Make sure it works.
Go to the App Settings  and add these 5 variables and then deploy the code using push from IDE or pull using Deployment Center
