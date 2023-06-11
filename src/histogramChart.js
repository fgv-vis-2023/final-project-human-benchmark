export function histogramChart(id, data, threshold, options) {
	var cfg = {
	 w: 400,				//Width of the circle
	 h: 500,				//Height of the circle
	 margin: {top: 10, right: 30, bottom: 30, left: 40}, //The margins around the circle
	 color: ['#94003a', '#ae3e52', '#c9676c', '#e28d87', '#fbb4a2'],	//Color function
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

	
	d3.select(id).select("svg").remove();
	
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

	var histogram = d3.histogram()
		.value(function(d) { return d[cfg.game]; })   // I need to give the vector of value
		.domain(x.domain())  // then the domain of the graphic
		.thresholds(x.ticks(10)); // then the numbers of bins

	var bins = histogram(data);

	// Y axis
	var y = d3.scaleLinear()
      .range([graphH, 0]);

    y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously

	svg.append("g")
		.call(d3.axisLeft(y));
		// .selectAll("text")
		// 	.style("font-size", "14px");

	svg.selectAll("rect")
	.data(bins)
	.enter()
	.append("rect")
		.attr("x", 1)
		.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
		.attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
		.attr("height", function(d) { return graphH - y(d.length); })
		.style("fill", function(d){ if(d.x0<threshold){return "orange"} else {return "#69b3a2"}})
  
	// Append a vertical line to highlight the separation
	svg
		.append("line")
		.attr("x1", x(threshold) )
		.attr("x2", x(threshold) )
		.attr("y1", y(0))
		.attr("y2", y(d3.max(bins, function(d) { return d.length; })))
		.attr("stroke", "black")
		.attr("stroke-dasharray", "4")
	svg
		.append("text")
		.attr("x", x(190))
		.attr("y", y(d3.max(bins, function(d) { return d.length; }) - 200))
		.text("Your score")
		.style("font-size", "15px")}