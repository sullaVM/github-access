$.get("/user", function (result) {
  console.log(result);
  var user = [];
  for (var i = 0; i < result.length; i++) {
    user[i] = {
      "name": result[i].login,
      "r": result[i].public_repos
    }
  }
  visualise(user);
});

function visualise(gitusers) {
  // D3.js canvasualisation
  var w = window.innerWidth,
    h = window.innerHeight;

  var palette = {
    "text": "#823A32",
    "yellow": "#A57706",
    "orange": "#BD3613",
    "followers": "#ED6A5A",
    "blue": "#2176C7",
  }

  var nodes = gitusers;

  // Create a link for each node from the source user.
  var links = [];
  for (var i = 0; i < nodes.length; i++) {
    links.push({
      source: nodes[0],
      target: nodes[i]
    })
  }

  var canvas = d3.select("body")
    .append("svg:svg")
    .attr("class", "stage")
    .attr("width", w)
    .attr("height", h);


  var force = d3.layout.force()
    .nodes(nodes)
    .links([])
    .gravity(0.1)
    .charge(-500)
    .size([w, h]);

  var link = canvas.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke", "#CCC")
    .attr("fill", "none");

  var node = canvas.selectAll("circle.node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")

    .on("mouseout", function (d, i) {
      if (i > 0) {
        d3.select(this).selectAll("circle")
          .transition()
          .duration(250)
          .attr("r", d.r)
          .attr("fill", palette.followers);

        d3.select(this).select("text")
          .transition()
          .duration(250)
      }
    })

    .on("mouseover", function (d, i) {
      if (i > 0) {
        d3.select(this).selectAll("circle")
          .transition()
          .duration(250)
          .style("cursor", "none")
          .attr("r", d.r + 3)
          .attr("fill", palette.orange);

        d3.select(this).select("text")
          .transition()
          .style("cursor", "none")
          .duration(250)
          .style("cursor", "none")
      } else {
        d3.select(this).selectAll("circle")
          .style("cursor", "none")

        d3.select(this).select("text")
          .style("cursor", "none")
      }
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
    .attr("y", function (d) { { return (d.r / 2) - 15;}})
    .attr("fill", palette.text)
    .attr("font-size", "12px")
    .attr("text-anchor", "beginning")

  node.append("text")
    .text(function (d) { return d.r + " repos"; })
    .attr("x", function (d) { return d.r + 5; })
    .attr("y", function (d) { { return d.r / 2;} })
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