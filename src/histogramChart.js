export function histogramChart(id, data, threshold, options) {
	var cfg = {
	 w: 600,				//Width of the circle
	 h: 500,				//Height of the circle
	 margin: {top: 10, right: 30, bottom: 30, left: 40}, //The margins around the circle
	 color: ['#e28d87', '#ae3e52'],	//Color function
	 game: "atencao",
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if

	const graphW = cfg.w - cfg.margin.left - cfg.margin.right;
	const graphH = cfg.h - cfg.margin.top - cfg.margin.bottom;

	
	// d3.select(id).select("svg").remove();
	
	// append the svg object to the body of the page
	var svg = d3.select(id)
		.append("svg")
		.attr("width", cfg.w)
		.attr("height", cfg.h)
		.append("g")
		.attr("transform",
			  "translate(" + cfg.margin.left + "," + cfg.margin.top + ")");


	// Add X axis
	var x = d3.scaleLinear()
		.domain([0, d3.max(data, function(d) { return d[cfg.game] })])
		.range([ 0, graphW]);
	
	svg.append("g")
		.attr("transform", "translate(0," + graphH + ")")
		.call(d3.axisBottom(x))

	// Y axis
	var y = d3.scaleLinear()
		.range([graphH, 0]);

	var yAxis = svg.append("g")

	
	
	// var threshold_group = svg.append("g")
	function update(nBin, threshold_type) {
		var histogram = d3.histogram()
			.value(function(d) { return d[cfg.game]; })   // I need to give the vector of value
			.domain(x.domain())  // then the domain of the graphic
			.thresholds(x.ticks(nBin)); // then the numbers of bins

			
		var bins = histogram(data);
		console.log(bins);

	
		y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
		yAxis
			.transition()
			.duration(1000)
			.call(d3.axisLeft(y));
		
		var u = svg.selectAll("rect")
			.data(bins)
		console.log(cfg.color)
		u
			.enter()
			.append("rect")
			.merge(u)
			.transition()
			.duration(1000)
				.attr("x", 1)
				.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
				.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
				.attr("height", function(d) { return graphH - y(d.length); })
				.style("fill", function(d){ if(d.x0<threshold[threshold_type]) {return cfg.color[0]} else {return cfg.color[1]}})
	
		svg.append("line").attr("id", "threshold-line")
		svg.append("text").attr("id", "threshold-text")

		var line = svg.select("#threshold-line")
		var text = svg.select("#threshold-text")
		
		line
			.enter()
			.merge(line)
			.transition()
			.duration(1000)
				.attr("x1", x(threshold[threshold_type]) )
				.attr("x2", x(threshold[threshold_type]) )
				.attr("y1", y(0))
				.attr("y2", y(d3.max(bins, function(d) { return d.length; })))
				.attr("stroke", "black")
				.attr("stroke-dasharray", "4")
				.attr("class", "threshold-line-old")

		let inserttext = ""
		if (threshold_type === "best") {
			inserttext = "Best score: "
		} else if (threshold_type === "avg") {
			inserttext = "Average score: "
		} else if (threshold_type === "recent") {
			inserttext = "Most recent score: "
		}


		var placement = threshold[threshold_type] < 11 ? "start" : "end"
		var offset = threshold[threshold_type] < 11 ? 5 : -5

		text
			.enter()
			.merge(text)
			.transition()
			.duration(1000)
				.attr("x", x(threshold[threshold_type]) + offset)
				.attr("y", y(d3.max(bins, function(d) { return d.length; }))+50)
				.text(inserttext + threshold[threshold_type].toString() )
				.style("font-size", "15px")
				.style("fill", "black")
				.style("font-weight", "bold")
				.attr("text-anchor", placement)
				.attr("class", "threshold-text-old")

		// If less bar in the new histogram, I delete the ones not in use anymore
		u.exit().remove()
		line.exit().remove()
		text.exit().remove()
    }

	let default_nBin = 10
	let default_threshold = document.getElementById('score-select').value
	update(default_nBin, default_threshold)

	// Listen to the button -> update if user change it
	d3.select("#nBin").on("input", function() {
		svg.selectAll("#threshold-text").remove()
		svg.selectAll("#threshold-line").remove()
		default_nBin = +this.value
		update(default_nBin, default_threshold);
	  });
	d3.select("#score-select").on("change", function() {
		default_threshold = this.value
		update(default_nBin, default_threshold);
	});
}