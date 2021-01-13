const setupDistanceChart = () => {
	const WIDTH        = 364;
	const HEIGHT       = 350;
	const MARGIN       = { top: 10, right: 10, bottom: 20, left: 30 };
	const INNER_WIDTH  = WIDTH - MARGIN.left - MARGIN.right;
	const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;
	const svg = d3.select('#distanceGraph').append('svg')
	  .attr('width', WIDTH)
	  .attr('height', HEIGHT)
	  .append('g')
	    .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');

	const x         = d3.scaleLinear().domain([0, 5]).range([0, INNER_WIDTH]);
	const y         = d3.scaleLinear().domain([-4.5, 28]).range([INNER_HEIGHT, 0]);
	const xAxis     = d3.axisBottom(x).ticks(10);
	const yAxis     = d3.axisLeft(y).ticks(10);
	const xAxisGrid = d3.axisBottom(x).tickSize(-INNER_HEIGHT).tickFormat('').ticks(10);
	const yAxisGrid = d3.axisLeft(y).tickSize(-INNER_WIDTH).tickFormat('').ticks(10);

	svg.append('g')
	  .attr('class', 'x axis-grid')
	  .attr('transform', 'translate(0,' + INNER_HEIGHT + ')')
	  .call(xAxisGrid);
	svg.append('g')
	  .attr('class', 'y axis-grid')
	  .call(yAxisGrid);
	// Create axes.
	svg.append('g')
	  .attr('class', 'x axis')
	  .attr('transform', 'translate(0,' + INNER_HEIGHT + ')')
	  .call(xAxis);
	svg.append('g')
	  .attr('class', 'y axis')
	  .call(yAxis);
}

setupDistanceChart();