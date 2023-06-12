export function barChart(id, data, options) {
	var cfg = {
	 w: 600,				//Width of the circle
	 h: 500,				//Height of the circle
	 margin: {top: 10, right: 30, bottom: 30, left: 40}, //The margins around the circle
	 color: ['#e28d87', '#ae3e52'],	//Color function
	 game: "atencao",
	 category: "sentimento"

	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if

	const graphW = cfg.w - cfg.margin.left - cfg.margin.right;
	const graphH = cfg.h - cfg.margin.top - cfg.margin.bottom;

	const translatedMood = {
		"feliz": "Happy",
		"irritado": "Angry",
		"triste": "Sad",
		"neutro": "Neutral",
		"êxtase": "Excited" 
	}

	const sortedMood = ["Angry", "Sad", "Neutral", "Happy", "Excited"]
	const sortedWorkout = ["0x", "1x", "2x", "3x", "≥4x"]
	const sortedSleep = ["≤6", "7", "8", "9", "≥10"]

	const sortedCategory = {
		"sentimento": sortedMood,
		"exercicio": sortedWorkout,
		"sono": sortedSleep
	}

	if (cfg.category === "sentimento") {
		data.forEach((d) => {
			if (d[cfg.category].toLowerCase() in translatedMood) {
				d[cfg.category] = translatedMood[d[cfg.category].toLowerCase()]
			}
		})
	}

	data.sort((a, b) => {
		return sortedCategory[cfg.category].indexOf(a[cfg.category]) - sortedCategory[cfg.category].indexOf(b[cfg.category])
	})

	// if (cfg.category === "")


	var groupedData = d3.groups(data, d => d[cfg.category])
	// get average score of each group
	groupedData = groupedData.map((d) => {
		let sum = 0
		d[1].forEach((e) => {
			sum += e[cfg.game]
		})
		return {"category": d[0], "game": sum/d[1].length}
	})
	console.log(groupedData)

	if (cfg.category === "exercicio") {
		groupedData.push(groupedData.shift())
	}


	
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
	var x = d3.scaleBand()
		.range([ 0, graphW])
		.paddingInner(0.05);
	
	var xAxis = svg.append("g")
		.attr("transform", "translate(0," + graphH + ")")

	// Y axis
	var y = d3.scaleLinear()
		.range([graphH, 0]);

	var yAxis = svg.append("g")
		.attr("class", "BarYAxis")

	function updateBar(groupedData) {

		// Update the X axis
		x.domain(groupedData.map(function(d) {return d.category; }))
		xAxis.call(d3.axisBottom(x))
		
		// Update the Y axis
		y.domain([0, d3.max(groupedData, function(d) { return d.game }) ]);
		yAxis.transition().duration(1000).call(d3.axisLeft(y));
		
		// Create the u variable
		var u = svg.selectAll("rect")
			.data(groupedData)
		
		u
			.enter()
			.append("rect") // Add a new rect for each new elements
			.merge(u) // get the already existing elements as well
			.transition() // and apply changes to all of them
			.duration(1000)
			.attr("x", function(d) { return x(d.category); })
			.attr("y", function(d) { return y(d.game); })
			.attr("width", x.bandwidth())
			.attr("height", function(d) { return graphH - y(d.game); })
			.attr("fill", cfg.color[0])
		
		// If less group in the new dataset, I delete the ones not in use anymore
		u
			.exit()
			.remove()
		}

	updateBar(groupedData)
}