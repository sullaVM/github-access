require('dotenv').config()
var express = require('express');
var app = express();
var github = require('octonode');

var client = github.client(process.env.ACCESS_TOKEN);

app.use(express.static("client"));

function getUser() {
  return new Promise((resolve, reject) => {
    client.get('/users/sullavm/followers', {}, function (err, status, body, headers) {
      if (err) reject(err);
      else resolve(body)
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

async function getUsersPoints(users) {
  var promises = [];
  users.forEach(element => {
    console.log(`/users/${element.login}`);
    promises.push(getUserRepos(`/users/${element.login}`)
      .catch(error => console.log(error)));
  });
  const resolvedfinalArray = await Promise.all(promises)
    // .then(console.log(promises))
    .catch(error => console.log(error));
  return resolvedfinalArray;

}

app.get('/user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  var users = [];
  getUser()
  .then(data => getUsersPoints(data).then(users => res.json(users)))
  .catch(error => console.log(error));
})

app.listen(8080, function () {
  console.log('Web server listening on port 8080')
})