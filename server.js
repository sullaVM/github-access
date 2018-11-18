require('dotenv').config()
var express = require('express');
var app = express();
var github = require('octonode');

var client = github.client(process.env.ACCESS_TOKEN);

function getUser() {
  return new Promise((resolve, reject) => {
    client.get('/users/sullavm/followers', {}, function (err, status, body, headers) {
      if (err) reject(error);
      else {
        var points = [];
        body.forEach(element => {
          console.log(`/users/${element.login}/repos`);
          var data = getUserRepos(`/users/${element.login}/repos`)
            .then(data => console.log(element.login + " " + data.length))
            .catch(error => console.log(error));
          points.push({
            "login": element.login
          });
        });

        resolve(points)
      }
    });
  });
};

function getUserRepos(url) {
  return new Promise((resolve, reject) => {
    client.get(url, {}, function (err, status, body, headers) {
      if (err) reject(error);
      return resolve(body);
    });
  }
  )
}

app.use(express.static("client"));

app.get('/user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  getUser().then(data => res.json(data)).catch(error => console.log(error));
})

app.listen(8080, function () {
  console.log('Web server listening on port 8080')
})