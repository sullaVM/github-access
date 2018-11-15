var http = require('http');
var fs = require('fs');
var github = require('octonode');

var client = github.client();

client.get('/users/sullavm', {}, function (err, status, body, headers) {
  console.log(body); //json object
});

http.createServer(function(req, res) {
  fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);