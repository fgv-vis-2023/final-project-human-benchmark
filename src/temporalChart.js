export function temporalChart(id, data, fulldata, options) {
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
	var x = d3.scaleTime()
		.domain(d3.extent(data, function(d) { return d.dia; }))
		.range([ 0, graphW]);
	
	var xAxis = svg.append("g")
		.attr("transform", "translate(0," + graphH + ")")
		.call(d3.axisBottom(x))

	// Y axis
	var y = d3.scaleLinear()
		.domain([0, d3.max(fulldata, function(d) { return +d[cfg.game]; })])
		.range([graphH, 0]);

	var yAxis = svg.append("g")
		.call(d3.axisLeft(y))

	var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", graphW )
        .attr("height", graphH )
        .attr("x", 0)
        .attr("y", 0);

	var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [graphW,graphH] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)

	var line = svg.append('g')
		.attr("clip-path", "url(#clip)")

	line.append("path")
		.datum(data)
		.attr("class", "line")  // I add the class line to be able to modify this line later on.
		.attr("fill", "none")
		.attr("stroke", cfg.color[1])
		.attr("stroke-width", 1.5)
		.attr("d", d3.line()
		  .x(function(d) { return x(d.dia) })
		  .y(function(d) { return y(d[cfg.game]) })
		  )

	line
		.append("g")
		.attr("class", "brush")
		.call(brush);
	
	function showMean() {
		line.append("line")
			.attr("class", "mean-line")
			.attr("x1", 0)
			.attr("y1", y(d3.mean(fulldata, function(d) { return +d[cfg.game]; })))
			.attr("x2", graphW)
			.attr("y2", y(d3.mean(fulldata, function(d) { return +d[cfg.game]; })))
			.attr("stroke", "black")
			.attr("stroke-dasharray", "4")
			.attr("stroke-width", 1.5);

		line.append("text")
			.attr("class", "mean-text")
			.attr("x", 10)
			.attr("y", y(d3.mean(fulldata, function(d) { return +d[cfg.game]; }))-4)
			.attr("fill", "black")
			.text("Average: " + Math.round(d3.mean(fulldata, function(d) { return +d[cfg.game]; })*100)/100)
			.attr("font-size", "16px")
			.attr("text-anchor", "start")
			.attr("font-weight", "bold");
	}

	function updateMean() {
		if (d3.select("#ShowMean").property("checked")) {
			showMean();
		} else {
			d3.selectAll(".mean-line").remove();
			d3.selectAll(".mean-text").remove();
		}
	}

	d3.select("#ShowMean").on("change", updateMean);
	updateMean();

	function showMedian() {
		line.append("line")
			.attr("class", "median-line")
			.attr("x1", 0)
			.attr("y1", y(d3.median(fulldata, function(d) { return +d[cfg.game]; })))
			.attr("x2", graphW)
			.attr("y2", y(d3.median(fulldata, function(d) { return +d[cfg.game]; })))
			.attr("stroke", "black")
			.attr("stroke-dasharray", "6")
			.attr("stroke-width", 1.5);

		line.append("text")
			.attr("class", "median-text")
			.attr("x", 10)
			.attr("y", y(d3.median(fulldata, function(d) { return +d[cfg.game]; }))+14)
			.attr("fill", "black")
			.text("Median: " + Math.round(d3.median(fulldata, function(d) { return +d[cfg.game]; })*100)/100)
			.attr("font-size", "16px")
			.attr("text-anchor", "start")
			.attr("font-weight", "bold");
	}

	function updateMedian() {
		if (d3.select("#ShowMedian").property("checked")) {
			showMedian();
		} else {
			d3.selectAll(".median-line").remove();
			d3.selectAll(".median-text").remove();
		}
	}

	d3.select("#ShowMedian").on("change", updateMedian);
	updateMedian();



	var idleTimeout 
	function idled() { idleTimeout = null; }
	
	// var threshold_group = svg.append("g")
// A function that update the chart for given boundaries
	function updateChart() {
		// What are the selected boundaries?
		const extent = d3.event.selection

		// If no selection, back to initial coordinate. Otherwise, update X axis domain
		if(!extent){
		if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
		x.domain([ 4,8])
		}else{
		x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
		line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
		}

		// Update axis and line position
		xAxis.transition().duration(1000).call(d3.axisBottom(x))
		line
			.select('.line')
			.transition()
			.duration(1000)
			.attr("d", d3.line()
			.x(function(d) { return x(d.dia) })
			.y(function(d) { return y(d[cfg.game]) })
			)
	}

  // If user double click, reinitialize the chart
	svg.on("dblclick",function(){
		x.domain(d3.extent(data, function(d) { return d.dia; }))
		xAxis.transition().call(d3.axisBottom(x))
		line
			.select('.line')
			.transition()
			.attr("d", d3.line()
				.x(function(d) { return x(d.dia) })
				.y(function(d) { return y(d[cfg.game]) })
				)
	});
}