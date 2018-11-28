require('dotenv').config()
var express = require('express');
var app = express();
var github = require('octonode');

var client = github.client(process.env.ACCESS_TOKEN);

app.use(express.static("client"));

app.get('/user/:login', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  console.log(req.params.login);
  getUserFollowers(req.params.login)
    .then(data => getUsersPoints(req.params.login, data))
    .then(users => res.json(users))
    .catch(error => console.log(error));
});

app.get('/user/:login/repos', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  console.log(req.params.login);
  getUserRepos(req.params.login)
    .then(data => {
      res.json(data)
    })
    .catch(error => console.log(error));
});

app.get('/user/:login/commits/all', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  console.log(req.params.login);
  getUserRepos(req.params.login)
    .then(data => getAllRepoCommits(data))
    .then(data => res.json(data))
    .catch(error => console.log(error));
});

function getUserInfo(login) {
  return new Promise((resolve, reject) => {
    client.get(`/users/${login}`, {}, function (err, status, body, headers) {
      if (err) reject(err);
      else resolve(body)
    });
  });
}

function getUserFollowers(login) {
  return new Promise((resolve, reject) => {
    client.get(`/users/${login}/followers`, {}, function (err, status, body, headers) {
      if (err) reject(err);
      else resolve(body)
    });
  });
}

function getUserRepos(user) {
  return new Promise((resolve, reject) => {
    client.get(`/users/${user}/repos`, {}, function (err, status, body, headers) {
      if (err) reject(err);
      return resolve(body);
    });
  });
}

async function getUsersPoints(login, users) {
  var promises = [];
  // Get the user info for the current user.
  promises.push(getUserInfo(login)
    .catch(error => console.log(error)));

  // Get the user infos for the followers of the current user.
  users.forEach(element => {
    promises.push(getUserInfo(element.login)
      .catch(error => console.log(error)));
  });
  const resolvedfinalArray = await Promise.all(promises)
    .catch(error => console.log(error));

  return resolvedfinalArray;
}

function getRepoCommits(repo) {
  return new Promise((resolve, reject) => {
    client.get(`/repos/${repo.full_name}/stats/participation`, {}, function (err, status, body, headers) {
      if (err) reject(err);
      body['repo'] = repo;
      return resolve(body);
    })
  });
}

async function getAllRepoCommits(repos) {
  console.log(repos);
  var promises = [];

  repos.forEach(element => {
    promises.push(getRepoCommits(element)
      .catch(error => console.log(error)));
  });
  const resolvedfinalArray = await Promise.all(promises)
    .catch(error => console.log(error));

  return resolvedfinalArray;
}

app.listen(8080, function () {
  console.log('Web server listening on port 8080')
});