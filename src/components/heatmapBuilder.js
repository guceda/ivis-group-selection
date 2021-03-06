import * as d3 from 'd3';
/** 
 * Base code retrieved from https://www.d3-graph-gallery.com/graph/heatmap_style.html 
*/


const heatmapBuilder = (data0, containerEl) => {
  // set the dimensions and margins of the graph
  const margin = { top: 80, right: 25, bottom: 30, left: 40 },
    width = 450 * 3 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  const selected = [];
  const colors = ['red', 'yellow', 'green'];

  // append the svg object to the body of the page
  const svg = d3.select(containerEl)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  let data = [];
  let columns = Object.keys(data0[0]);

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

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  const myGroups = d3.map(data, function (d) { return d.group; }).keys()
  const myVars = d3.map(data, function (d) { return d.variable; }).keys()

  // Build X scales and axis:
  const x = d3.scaleBand()
    .range([0, width])
    .domain(myGroups)
  // .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  const y = d3.scaleBand()
    .range([height, 0])
    .domain(myVars)
  // .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Build color scale
  const myColor = (value) => {
    let colorValues = ['#0A2F51',
      '#0E4D64',
      '#137177',
      '#188977',
      '#1D9A6C',
      '#39A96B',
      '#56B870',
      '#74C67A',
      '#99D492',
      '#BFE1B0',
      '#DEEDCF'];

    return colorValues[10 - value];
  }
  // const myColor = d3.scaleSequential()
  //   .interpolator(d3.interpolateInferno)
  //   .domain([1, 100])

  // create a tooltip
  const tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function (d) {
    svg.selectAll('rect').style('opacity', 0.3);
    svg.selectAll(`.${d.variable.replace(' ', '_')}`).selectAll('rect').style('opacity', 0.55);
    svg.selectAll(`.${d.group.replace(' ', '_')}`).selectAll('rect').style('opacity', 0.8);
    svg.selectAll(`.${d.group.replace(' ', '_')}`).selectAll('text').style('opacity', 0.8);
    d3.select(this).style('opacity', 1);
    // tooltip
    //   .style("opacity", 1)
    // d3.select(this)
    //   .style("opacity", 1)
  }
  const mousemove = function (d) {
    tooltip
      .html("The exact value of<br>this cell is: " + d.value)
      .style("left", (d3.mouse(this)[0] + 70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  const mouseleave = function (d) {
    svg.selectAll('rect').style('opacity', 0.8);
    svg.selectAll(`.${d.group.replace(' ', '_')}`).selectAll('text').style('opacity', 0);
    tooltip.style("opacity", 0);
    d3.select(this).style("opacity", 0.8);
  }

  const click = function (d) {
    const idx = selected.indexOf(d);
    const isSelected = idx > -1;
    isSelected ? selected.splice(idx) : selected.push(d);
    d3.selectAll(`.${d.variable}`).filter(`.${d.group}`).select('rect')
      .style("stroke", isSelected ? "none" : "black");

  }

  // add the squares
  const cells = svg.selectAll()
    .data(data, function (d) { return d.group + ':' + d.variable; })
    .enter()
    .append("g")
    .attr('class', (d) => `${d.variable.replace(' ', '_')} ${d.group.replace(' ', '_')}`)
    .on("click", click)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // append the square
  cells.append("rect")
    .attr("x", function (d) { return x(d.group) })
    .attr("y", function (d) { return y(d.variable) })
    // .attr("rx", 4)
    // .attr("ry", 4)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) { return myColor(d.value) })
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8);

  // append the legend
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