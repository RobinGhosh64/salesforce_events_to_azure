var express = require('express');
var broker = require('./server/brokers/salesforcebroker');
var randomstring = require("randomstring");

var app = express();

app.get('/', function (req, res) {
   res.send('Salesforce Event Listener running!');
})

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port

   console.log('Setting up listener now on port ', port);
   
   console.log("Example app listening at http://%s:%s", host, port)
   broker.startReading();
})





  

 






 