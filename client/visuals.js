// Take input username.
$('input[type=text]').on('keydown', function (e) {
	if (e.which == 13) {
		e.preventDefault();
		$('input[type=text]').fadeOut('slow');
		getUserData($('input').val());
		$('#username').remove();
	}
});

// Set graph height and width.
var w = window.innerWidth,
	h = window.innerHeight;

// Get user data given a username.
function getUserData(username) {
	$.get(`/user/${username}`, function (result) {
		console.log(result);
		var user = [];
		for (var i = 0; i < result.length; i++) {
			user[i] = {
				'name': result[i].login,
				'r': result[i].public_repos
			}
		}
		visualiseFollowers(user);
	});
};

// Get user repositories data.
function getUserRepos(username) {
	$('#loader').fadeIn('slow');

	var url = `/user/${username}/repos`;
	$.get(url, function (result) {
		console.log(result);
		$('#loader').fadeOut('fast');
		userSummary(username, result);
	});
}

// Get commits for each repo.
function getRepoCommits(username, reponame) {
	$('#loader').fadeIn('slow');

	var url = `/user/${username}/${reponame}/contribution`;
	$.get(url, function (result) {
		console.log(result);
		$('#loader').fadeOut('fast');
		repoData(result);
	})

}

var palette = {
	'text': '#823A32',
	'yellow': '#A57706',
	'orange': '#BD3613',
	'followers': '#ED6A5A',
	'blue': '#2176C7',
}

// User Followers Graph
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
	var canvas = d3.select('#graph')
		.append('svg:svg')
		.attr('class', 'stage')
		.attr('width', w)
		.attr('height', h);

	// Set force.
	var force = d3.layout.force()
		.nodes(nodes)
		.gravity(0.1)
		.charge(function (d) {
			return -500 - d.r;
		})
		.size([w, h]);

	// Set lines between nodes.
	var link = canvas.selectAll('.link')
		.data(links)
		.enter().append('line')
		.attr('class', 'link')
		.attr('stroke', '#CCC')
		.attr('fill', 'none');

	// Set nodes.
	var node = canvas.selectAll('circle.node')
		.data(nodes)
		.enter().append('g')
		.attr('class', 'node')

		.on('mouseout', function (d, i) {
			d3.select(this).selectAll('circle')
				.transition()
				.duration(250)
				.attr('r', function (d) {
					if ((d.r * 2) > (h / 4)) {
						return (h / 4);
					} else {
						return d.r;
					}
				})
				.attr('fill', palette.followers);

			d3.select(this).select('text')
				.transition()
				.duration(250)
		})
		// Mouseover events.
		.on('mouseover', function (d, i) {
			d3.select(this).selectAll('circle')
				.transition()
				.duration(250)
				.style('cursor', 'none')
				.attr('r', function (d) {
					if ((d.r * 2) > (h / 4)) {
						return (h / 4);
					} else {
						return d.r;
					}
				})
				.attr('fill', palette.orange)
				.style('cursor', 'pointer');

			d3.select(this).select('text')
				.transition()
				.style('cursor', 'none')
				.duration(250)
				.style('cursor', 'none')
		})
		// Onclick function that opens up commits per repo.
		.on('click', function (e) {
			$('#graph').fadeOut('slow').remove();
			getUserRepos(d3.select(this).select('text').text());
		})

		.call(force.drag);

	// Append the circles.
	node.append('svg:circle')
		.attr('cx', function (d) { return d.x; })
		.attr('cy', function (d) { return d.y; })
		.attr('r', function (d) {
			// Do not scale to screen if node is bigger than screen.
			// Give a fixed length for these nodes.
			if ((d.r * 2) > (h / 4)) {
				return h / 4;
			} else {
				return d.r;
			}
		})
		.attr('fill', function (d, i) { if (i > 0) { return palette.followers; } else { return palette.text } });

	// Append the username text.
	node.append('text')
		.text(function (d) { return d.name; })
		.attr('x', function (d) { return d.r + 5; })
		.attr('y', function (d) { { return (d.r / 2) - 15; } })
		.attr('fill', palette.text)
		.attr('font-size', '12px')
		.attr('text-anchor', 'beginning');

	// Append the repo count text.
	node.append('text')
		.text(function (d) { return d.r + ' repos'; })
		.attr('x', function (d) { return d.r + 5; })
		.attr('y', function (d) { { return d.r / 2; } })
		.attr('fill', palette.text)
		.attr('font-weight', '700')
		.attr('font-size', '14px')
		.attr('text-anchor', 'beginning');

	force.on('tick', function (e) {
		node.attr('transform', function (d, i) {
			return 'translate(' + d.x + ',' + d.y + ')';
		});
		link.attr('x1', function (d) { return d.source.x; })
			.attr('y1', function (d) { return d.source.y; })
			.attr('x2', function (d) { return d.target.x; })
			.attr('y2', function (d) { return d.target.y; })
	});

	force.start();
};

// List of Repositories 
function userSummary(owner, repos) {
	// Append a div for summary contents.
	var sumWrap = d3.select('body')
		.append('div')
		.attr('id', 'userSummary');

	sumWrap.append('text')
		.text(owner)
		.attr('class', 'header');

	// Append div for the graphs.
	sumWrap.append('div')
		.attr('id', 'graphHolder');

	// Build the repo link.
	var list = sumWrap.append('div')
		.attr('class', 'repolist');
	list.selectAll('li')
		.data(repos)
		.enter()
		.append('li')
		.text(function (d) { return d.name })
		.style('cursor', 'pointer')
		.on('click', function (d) {
			d3.select('#graphHolder').select('svg').remove();
			$('p').remove();
			getRepoCommits(owner, d.name);
		});

}

function findMaxRepo(weeks) {
	var max = weeks[0].c;
	for (var i = 0; i < weeks.length; i++) {
		if (weeks[i].c > max) {
			max = weeks[i].c;
		}
	}
	return max;
}

function repoData(repo) {
	// Check if repo has not had any commits the past year.
	if (repo.length < 0 || jQuery.isEmptyObject(repo)) {
		$('#graphHolder').append('<p>Repository has no commits the past year.</p>')

	} else {
		var m = [80, 80, 80, 80];
		var w = $('#userSummary').width() - m[1] - m[3];
		var h = 300 - m[0] - m[2];

		var data = repo.weeks;

		var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
		var y = d3.scale.linear().domain([0, findMaxRepo(repo.weeks)]).range([h, 0]);

		var line = d3.svg.line()
			.x(function (d, i) {
				return x(i);
			})
			.y(function (d) {
				return y(d.c);
			})

		var graph = d3.select('#graphHolder').append("svg:svg")
			.attr("width", w + m[1] + m[3])
			.attr("height", h + m[0] + m[2])
			.append("svg:g")
			.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

		graph.append('text')
			.text('Number of commits over time for the past year in weeks')
			.attr('margin', 10);

		var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
		graph.append("svg:g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + h + ")")
			.call(xAxis);


		var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
		graph.append("svg:g")
			.attr("class", "y axis")
			.attr("transform", "translate(-25,0)")
			.call(yAxisLeft);

		graph.append("svg:path").attr("d", line(data));

	}
}