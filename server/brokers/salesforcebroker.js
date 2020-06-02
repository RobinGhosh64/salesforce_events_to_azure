'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var jsforce = require('jsforce');
var loganalytics = require("azure-loganalytics");

const rq = require('request')
const crypto = require('crypto')
const util = require('util')

var conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl : 'https://login.salesforce.com'
});



module.exports={
 
  
  /*
  *  Listen for Platform Events or channel
  */

   startReading: function () {
            

      conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD, function(err, userInfo) {

          if (err) { return console.error(err); }

          // Now you can get the access token and instance URL information.
          // Save them to establish connection next time.
          console.log(conn.accessToken);              // Salesforce returns a token key
          console.log(conn.instanceUrl);
          // logged in user property
          console.log("User ID: " + userInfo.id);
          console.log("Org ID: " + userInfo.organizationId);

          conn.streaming.topic("/event/ApiEventStream").subscribe(function(content) {

            console.dir(content);
            var workspace_id= process.env.LAW_ID;    //read our Log Analytics Workspace id
            var key=process.env.LAW_KEY;             //read our Log Analytics Workspace key
            var LogType=process.env.LAW_NAME;        //read our Log Analytics Log Type Name where logs will be collected

            
            var rfc1123date=new Date().toUTCString();
            try {
              //Checking if the data can be parsed as JSON
              if ( JSON.parse(JSON.stringify(content)) ) {
                  var length = Buffer.byteLength(JSON.stringify(content.payload),'utf8')
                  var binaryKey = Buffer.from(key,'base64')
                  var stringToSign = 'POST\n' + length + '\napplication/json\nx-ms-date:' + rfc1123date + '\n/api/logs';
   
                  var hash = crypto.createHmac('sha256',binaryKey).update(stringToSign,'utf8').digest('base64')
                  var authorization = "SharedKey "+ workspace_id+":"+hash
                  
                  var headers={
                      "content-type": "application/json", 
                      "authorization":authorization,
                      "Log-Type":LogType,
                      "x-ms-date":rfc1123date,
                      "time-generated-field":"DateValue"
                      }

                  var uri = "https://"+ workspace_id + ".ods.opinsights.azure.com/api/logs?api-version=2016-04-01"
   
                  console.log('body',JSON.stringify(content.payload));
                  /*
                  *  write to log analytics data store
                  */
                  rq.post({url: uri, headers: headers, body: JSON.stringify(content.payload) }, function (error, response, body) {
        
                    console.log('error:', error); 
                    console.log('statusCode:', response && response.statusCode); 
                    console.log('body:', body)
                  });
   
              }
            //Catch error if data cant be parsed as JSON
            } catch (err) {
              console.log("No data sent to LA: " + err);
            }
        })
      }); 
   },

};




