# Git Compare (Github Social Graph)
Social Graph Project for **TCD CS Module: Software Engineering**

## Assignment Specifications
Interrogate the GitHub API to build visualisation of data available tht elucidates some aspect of the softare engineering process, such as a social graph of developers and projects, or a visualisation of indiviudal or team performance. Provide a visualisation of this using the d3js library.

## Project Description
Got Compare displays a user's number of commits against their followers' through a graph with nodes as users and links as the connections. Selecting each node displays a user's list of repositories and clicking on a repository name will display the number of commits the user have contributed to that repository in the past year.

![Enter username](/screenshots/2.png)
Enter username.

![Click on any user node](/screenshots/3.png)
Click on any user node.

![Click on any repo name.](/screenshots/4.png)
Click on any repo name.

![Graph is displayed on the top.](/screenshots/5.png)
Graph is displayed on the top.

![Displays a text when no commits have been made.](/screenshots/6.png)
Displays a text when no commits have been made the past year.
## Usage
- Go to http://swe.sullamontes.com for a live version, or
```
$ git clone https://github.com/sullaVM/swe-social-graph.git
```
Download all dependencies using npm and test.
```
$ npm install
```
Change the access token in server.js directly onto the file.
```
var client = github.client(<access_token>);
```
Or create a .env file and add:
```
ACCESS_TOKEN=<your_access_token>
```
Then test.
```
$ npm test
```

## Branches
### master
- status: experimental
- A webpage hosted through a Golang web-server.

### browser
- status: **final**
- A Node.js server that executes authenticated request to Github (to allow more than 60 requests per hour), and an HTML that requests data from the Node.js server instead of directly to Github.

### node
- status: experimental
- A Node.js hosting a webpage and uses Webpack library to allow generate an HTML page from the JavaScript source. This hides the Github access token and bundles the entire webapp.
- https://webpack.js.org/

### webapp
- status: experimental
- Another Node.js server that uses the Parcel.js as a bundler just like Webpack. 
- https://parceljs.org/

## Why I switched to Node.js from Go?
- I've implemented the past assignments using Golang including the Github Access one. The master should reflect this. I switched to Node.js because I simply wanted to learn it.

## Owner
Sulla Montes  
15324631


