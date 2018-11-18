require('dotenv').config()
var express = require('express');
var app = express();
var github = require('octonode');
var cors = require('cors');

var client = github.client(process.env.ACCESS_TOKEN);

function getUser() {
  return new Promise((resolve, reject)=>{
    client.get('/user', {}, function (err, status, body, headers) {
      console.log(body);
      if (err) reject(error);
      else resolve(body)
    });
  });
};

app.use(cors())

app.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var data = getUser()
    .then(data => res.json(data))
    .catch(error => console.log(error));
})

app.listen(8080, function () {
  console.log('CORS-enabled web server listening on port 80')
})