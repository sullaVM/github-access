var http = require('http');
var fs = require('fs');
var cors = require('cors');
var express = require('express');
var app = express();

app.use(cors());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  });

app.listen(8081, function () {
  console.log('CORS-enabled web server listening on port 8081')
})