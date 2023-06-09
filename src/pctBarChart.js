/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////
	
export function PctBarChart(id, data, options) {
	var cfg = {
	 w: 400,				//Width of the circle
	 h: 500,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 100, left: 100}, //The margins around the circle
	 color: ['#94003a', '#ae3e52', '#c9676c', '#e28d87', '#fbb4a2'],	//Color function
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
		.domain([0, 100])
		.range([ 0, graphW]);
	
	svg.append("g")
		.attr("transform", "translate(0," + graphH + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

	// Y axis
	var y = d3.scaleBand()
		.range([ 0, graphH ])
		.domain(data.map(function(d) { return d.Game; }))
		.padding(.1);

	svg.append("g")
		.call(d3.axisLeft(y))
		.selectAll("text")
			.style("font-size", "14px");

	//Bars
	svg.selectAll("myRect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", x(0) )
		.attr("y", function(d) { return y(d.Game); })
		.attr("width", x(100))
		.attr("height", y.bandwidth() )
		.attr("fill", cfg.color[3])
		.attr("stroke", "black")

	svg.selectAll("myRect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", x(0) )
		.attr("y", function(d) { return y(d.Game); })
		.attr("width", function(d) { return x(d.Score); })
		.attr("height", y.bandwidth() )
		.attr("fill", cfg.color[0])

	svg.append('g')
		.attr("class", "value-label")
		.selectAll('text')
		.data(data)
		.enter()
		.append('text')
		  .attr('x', d => {
			if (x(d.Score) < 90) {
				return x(d.Score) + 85
			} return x(d.Score) - 5})
		  .attr('y', (d, i) => y(d.Game)+y.bandwidth()/2+14)
		  .text(d => d.Score + '%')
		  .attr('fill', 'white')
		  .attr('font-size', '42px')
		  .attr('font-weight', 'bold')
		  .attr('font-family', 'sans-serif')
		  .attr('text-anchor', 'end')
}//RadarChart