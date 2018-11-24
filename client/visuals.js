$('input[type=text]').on('keydown', function (e) {
  if (e.which == 13) {
    e.preventDefault();
    $('input[type=text]').fadeOut("slow");
    getUserData($("input").val());
    $('#username').remove();
  }
});

var w = window.innerWidth,
  h = window.innerHeight;

function getUserData(username) {
  $.get("/user/" + username, function (result) {
    console.log(result);
    var user = [];
    for (var i = 0; i < result.length; i++) {
      user[i] = {
        "name": result[i].login,
        "r": result[i].public_repos
      }
    }
    visualiseFollowers(user);
  });
};

function getUserCommitsPerRepo(username) {
  $("#loader").fadeIn("slow");

  var url = "/user/" + username + "/commits/all/"
  $.get(url, function (result) {
    var repos = [];
    for (var i = 0; i < result.length; i++) {
      var totalComs = 0;
      for (var j = 0; j < result[i].owner.length; j++) {
        totalComs += result[i].owner[j];
      }
      if (totalComs > h / 4) {
        totalComs = h / 4;
      }
      repos[i] = {
        "name": result[i].repo.name,
        "url": result[i].repo.url,
        "language": result[i].language,
        "value": totalComs
      }
    }

    $("#loader").fadeOut("fast");

    visualiseRepos(username, repos);
  });
}

var palette = {
  "text": "#823A32",
  "yellow": "#A57706",
  "orange": "#BD3613",
  "followers": "#ED6A5A",
  "blue": "#2176C7",
}

function visualiseFollowers(gitusers) {
  // D3.js canvasualisation.
  var nodes = gitusers;

  // Create a link for each node from the source user.
  var links = [];
  for (var i = 0; i < nodes.length; i++) {
    links.push({
      source: nodes[0],
      target: nodes[i]
    })
  }

  // Set canvas.
  var canvas = d3.select("#graph")
    .append("svg:svg")
    .attr("class", "stage")
    .attr("width", w)
    .attr("height", h);

  // Set force.
  var force = d3.layout.force()
    .nodes(nodes)
    .gravity(0.1)
    .charge(function (d) {
      return -500 - d.r;
    })
    .size([w, h]);

  // Set lines between nodes.
  var link = canvas.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke", "#CCC")
    .attr("fill", "none");

  // Set nodes.
  var node = canvas.selectAll("circle.node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")

    .on("mouseout", function (d, i) {
      d3.select(this).selectAll("circle")
        .transition()
        .duration(250)
        .attr("r", d.r)
        .attr("fill", palette.followers);

      d3.select(this).select("text")
        .transition()
        .duration(250)
    })

    .on("mouseover", function (d, i) {
      d3.select(this).selectAll("circle")
        .transition()
        .duration(250)
        .style("cursor", "none")
        .attr("r", d.r + 3)
        .attr("fill", palette.orange)
        .style("cursor", "pointer");

      d3.select(this).select("text")
        .transition()
        .style("cursor", "none")
        .duration(250)
        .style("cursor", "none")
    })


    .on("click", function (e) {
      $("#graph").fadeOut("slow").remove();
      getUserCommitsPerRepo(d3.select(this).select("text").text());
    })

    .call(force.drag);

  node.append("svg:circle")
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; })
    .attr("r", function (d) { return d.r; })
    .attr("fill", function (d, i) { if (i > 0) { return palette.followers; } else { return palette.text } })

  node.append("text")
    .text(function (d) { return d.name; })
    .attr("x", function (d) { return d.r + 5; })
    .attr("y", function (d) { { return (d.r / 2) - 15; } })
    .attr("fill", palette.text)
    .attr("font-size", "12px")
    .attr("text-anchor", "beginning")

  node.append("text")
    .text(function (d) { return d.r + " repos"; })
    .attr("x", function (d) { return d.r + 5; })
    .attr("y", function (d) { { return d.r / 2; } })
    .attr("fill", palette.text)
    .attr("font-weight", "700")
    .attr("font-size", "14px")
    .attr("text-anchor", "beginning")


  force.on("tick", function (e) {
    node.attr("transform", function (d, i) {
      return "translate(" + d.x + "," + d.y + ")";
    });

    link.attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; })
  });

  force.start();

};

function visualiseRepos(owner, repos) {

  var body = d3.select("body");

  var bigraph = body.append("div")
    .attr("id", "bargraph");

  var header = bigraph.append("div")
    .attr("class", "header");

  header.append("text")
    .text("Commits per repository in the past year");


  console.log(repos);
  var data = repos;

  var margin = {
    top: 0,
    right: w * 0.10,
    bottom: 0,
    left: w * 0.30
  };

  var width = (w * 0.80) - margin.left - margin.right,
    height = (h * 0.75);

  var svg = d3.select("#bargraph").append("svg")
    .attr("class", "stage")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scale.linear()
    .range([0, width])
    .domain([0, d3.max(data, function (d) {
      return d.value;
    })]);

  var y = d3.scale.ordinal()
    .rangeRoundBands([height, 0], .1)
    .domain(data.map(function (d) {
      return d.name;
    }));

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(0)
    .orient("left");

  var gy = svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)

  var bars = svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("g")

  bars.append("rect")
    .attr("class", "bar")
    .attr("y", function (d) {
      return y(d.name);
    })
    .attr("height", y.rangeBand())
    .attr("x", 0)
    .attr("width", function (d) {
      return x(d.value);
    });

  bars.append("text")
    .attr("class", "label")
    .attr("y", function (d) {
      return y(d.name) + y.rangeBand() / 2 + 4;
    })
    .attr("x", function (d) {
      return x(d.value) + 5;
    })
    .text(function (d) {
      return d.value + " commits";
    });
};