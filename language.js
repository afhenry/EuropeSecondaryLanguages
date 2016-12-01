//Initialize variables for color and boundary buttons
var change = 0,
    boundary = 0;

var width = 960,
    height = 1100;

var formatNumber = d3.format(",d");
    
var projection = d3.geo.albers()
    .center([10, 50])
    .rotate([-15, 2, 0])
    .parallels([38, 69])
    .scale(800)
    .translate([width/2, height-300]);

var path = d3.geo.path()
    .projection(projection);
    
var color = d3.scale.threshold()
    .domain([1, 10, 50, 100, 500, 1000, 2000, 5000])
    .range(["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);

    
// A position encoding for the key only.
var x = d3.scale.linear()
    .domain([0, 5100])
    .range([0, 480]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(13)
    .tickValues(color.domain())
    .tickFormat(function(d) { return d >= 100 ? formatNumber(d) : null; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(440,40)");


g.selectAll("rect")
    .data(color.range().map(function(d, i) {
      return {
        x0: i ? x(color.domain()[i - 1]) : x.range()[0],
        x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
        z: d
      };
    }))
    .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return d.x0; })
    .attr("width", function(d) { return d.x1 - d.x0; })
    .style("fill", function(d) { return d.z; });

g.call(xAxis).append("text")
    .attr("class", "caption")
    .attr("y", -6)
    .text("Population per square mile");
    

d3.json("eu.json", function(error, eu) {
  if (error) throw error;
  console.log(eu);

  svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(eu, eu.objects.EUMAP).features)
    .enter().append("path")
    .attr("fill", '#fff')
    .attr("d", path)
    .append("title");

    
  // Draw county borders.
  svg.append("path")
      .datum(topojson.mesh(eu, eu.objects.EUMAP))
      .attr("class", "mesh")
      .attr("d", path)
      .style('fill', '#fff');
});

d3.select(self.frameElement).style("height", height + "px");