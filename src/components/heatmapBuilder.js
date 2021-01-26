import * as d3 from 'd3';
/** 
 * Base code retrieved from https://www.d3-graph-gallery.com/graph/heatmap_style.html 
*/

const formatData = (data0) => {
  //Read the data
  const data = [];
  const columns = Object.keys(data0[0]);

  // Main matrix
  for (let i = 0; i < data0.length; i++) {
    for (let j = 1; j < columns.length; j++) {
      data.push({
        group: data0[i]['User'],
        variable: columns[j],
        value: data0[i][columns[j]]
      });
    }
  }
  return data;
}

const heatmapBuilder = (data0, containerEl, setFilteredData) => {
  // set the dimensions and margins of the graph

  const margin = { top: 80, right: 25, bottom: 100, left: 110 },
    width = (window.screen.width * 0.8) - margin.left - margin.right,
    height = width/2 - margin.top - margin.bottom;

  const selected = [];
  const data = formatData(data0);

  // append the svg object to the body of the page
  const svg = d3.select(containerEl)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const myGroups = d3.map(data, function (d) { return d.group; }).keys()
  const myVars = d3.map(data, function (d) { return d.variable; }).keys()

  const rep = d => d.replaceAll(' ', '_');

  // Build X scales and axis:
  const x = d3.scaleBand()
    .range([0, width])
    .domain(myGroups);

  // Append axis legend
  svg.append("g")
    .style("font-size", 12)
    .attr("transform", "translate(0," + height + ")")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  //Rotate axis values
  svg.selectAll('text').attr('transform', 'rotate(-45)')
    .attr("text-anchor", 'end')

  // Build Y scales and axis:
  const y = d3.scaleBand()
    .range([height, 0])
    .domain(myVars);

  // Append axis legend
  svg.append("g")
    .style("font-size", 12)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  const myColor = (value) => {
    let colorValues = [
      '#0A2F51',
      '#0E4D64',
      '#137177',
      '#188977',
      '#1D9A6C',
      '#39A96B',
      '#56B870',
      '#74C67A',
      '#99D492',
      '#BFE1B0',
      '#DEEDCF'
    ];

    return colorValues[colorValues.length - 1 - value];
  }

  // Mouse interactions
  const mouseover = function (d) {
    svg.selectAll('rect').style('opacity', 0.3);
    svg.selectAll(`.${rep(d.variable)}`).selectAll('rect').style('opacity', 0.55);
    svg.selectAll(`.${rep(d.group)}`).selectAll('rect').style('opacity', 0.8);
    svg.selectAll(`.${rep(d.group)}`).selectAll('text').style('opacity', 0.8);
    d3.select(this).style('opacity', 1);
  }

  const mouseleave = function (d) {
    svg.selectAll('rect').style('opacity', 0.8);
    svg.selectAll(`.${rep(d.group)}`).selectAll('text').style('opacity', 0);
    d3.select(this).style("opacity", 0.8);
  }

  const click = function (d) {
    const idx = selected.indexOf(d);
    const isSelected = idx > -1;
    isSelected ? selected.splice(idx) : selected.push(d);
    d3.selectAll(`.${rep(d.variable)}`).filter(`.${rep(d.group)}`).select('rect')
      .style("stroke", isSelected ? "none" : "black");
    const data = selected.map(x => data0.find(data => data.User === x.group));
    setFilteredData(data.length > 0 ? data : data0);
  }

  // Add the squares
  const cells = svg.selectAll()
    .data(data, function (d) { return d.group + ':' + d.variable; })
    .enter()
    .append("g")
    .attr('class', (d) => `${rep(d.variable)} ${rep(d.group)}`)
    .on("click", click)
    .on("mouseover", mouseover)
    .on("mouseleave", mouseleave);

  // Append the square
  cells.append("rect")
    .attr("x", function (d) { return x(d.group) })
    .attr("y", function (d) { return y(d.variable) })
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) { return myColor(d.value) })
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8);

  // Append the legend
  cells.append("text")
    .attr("x", function (d) { return x(d.group) + x.bandwidth() / 2; })
    .attr("y", function (d) { return y(d.variable) + y.bandwidth() / 2; })
    .attr("text-anchor", 'middle')
    .attr("dy", ".35em")
    .style('opacity', 0)
    .style("font-size", "20px")
    .style('fill', 'white')
    .text(function (d) { return d.value; });

  // Add title to graph
  svg.append("text")
    .attr("x", 0)
    .attr("y", -50)
    .attr("text-anchor", "left")
    .style("font-size", "22px")
    .style("fill", "white")
    .text("IVIS group formation tool");

  // Add subtitle to graph
  svg.append("text")
    .attr("x", 0)
    .attr("y", -20)
    .attr("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "white")
    .style("max-width", 400)
    .text("A D3 graph for group formation");
};


export default heatmapBuilder;