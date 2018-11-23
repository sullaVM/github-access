require('dotenv').config()
var express = require('express');
var app = express();
var github = require('octonode');

var client = github.client(process.env.ACCESS_TOKEN);

app.use(express.static("client"));

function getUserInfo() {
  return new Promise((resolve, reject) => {
    client.get('/users/sullavm', {}, function (err, status, body, headers) {
      if (err) reject(err);
      else resolve(body)
    });
  });
};

function getUserFollowers() {
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
      if (err) reject(err);
      return resolve(body);
    });
  }
  )
}

async function getUsersPoints(users) {
  var promises = [];
  // Get the user info for the current user.
  promises.push(getUserInfo()
    .catch(error => console.log(error)));

  // Get the user infos for the followers of the current user.
  users.forEach(element => {
    promises.push(getUserRepos(`/users/${element.login}`)
      .catch(error => console.log(error)));
  });
  const resolvedfinalArray = await Promise.all(promises)
    .catch(error => console.log(error));
  console.log(resolvedfinalArray);
  return resolvedfinalArray;

}

app.get('/user', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  getUserFollowers()
    .then(data => getUsersPoints(data)
    .then(users => res.json(users)))
    .catch(error => console.log(error));
})

app.listen(8080, function () {
  console.log('Web server listening on port 8080')
})