# Social Graph
Social Graph Project for **TCD CS Module: Software Engineering**

## Live
http://swe.sullamontes.com

## Assignment Description
Interrogate the GitHub API to build visualisation of data available tht elucidates some aspect of the softare engineering process, such as a social graph of developers and projects, or a visualisation of indiviudal or team performance. Provide a visualisation of this using the d3js library.

## Usage

## Design Decisions


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

## Why Node.js?
- I've implemented the past assignments using Golang and so I decided to learn something new.
