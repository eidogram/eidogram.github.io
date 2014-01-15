(function() {

  var data = [
    {"id":"y1","year":"2008", "displaced":"36.1", "perc":"80"},
    {"id":"y2","year":"2009", "displaced":"16.7", "perc":"38"},
    {"id":"y3","year":"2010", "displaced":"42.3", "perc":"80"},
    {"id":"y4","year":"2011", "displaced":"16.4", "perc":"41"},
    {"id":"y5","year":"2012", "displaced":"32.4", "perc":"68"}
  ];

  var x = d3.scale.linear()
    .range([0,130])
    .domain([0, 42.3]);

  var maxHeight = x(42.3);
  var barWidth = 60;

  var width = 900,
      height = 360;

  var chart = d3.select("#container_years")
    .append("svg")
      .attr("id","chart_years")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", "0 0 900 360")          // make it
      .attr("preserveAspectRatio", "xMidYMid") // responsive
    .append("g").attr("transform","translate(100,-100) scale(1)");

  chart.append("text")
    .text("Global disaster-induced displacement")
    .attr("class","title")
    .style("font-size","18px")
    .attr({"x":"0", "y":"160"}); 

  var rects = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("class","rect-years")
      .on("click", function(d) {
        d3.select("#" + d.id).transition().duration(1000).style("opacity","1");
      });
  
  rects.append("rect")
    .attr("class","rect")
    .attr("width", barWidth)
    .attr("height", function(d) { return x(+d.displaced); })
    .attr("transform", function(d, i) {
      var delta = x(maxHeight - d.displaced);
      return "translate(" + i * 1.3 * barWidth + "," + delta + ")"; });

  rects.append("rect")
    .attr("class","rect rect1")
    .attr("width", barWidth)
    .attr("height", function(d) { return x(+d.displaced * 0.01 * +d.perc); })
    .attr("transform", function(d, i) {
      var delta = x(maxHeight - (+d.displaced * 0.01 * +d.perc));
      return "translate(" + i * 1.3 * barWidth + "," + delta + ")"; });

  rects.append("text")
    .attr("class", "text_year")
    .attr({"dy":"20", "dx":"14"})
    .attr("transform", function(d, i) {
      var delta = x(maxHeight);
      return "translate(" + i * 1.3 * barWidth + "," + delta + ")"; })
    .text(function(d) {return d.year;});

  var details = rects.append("g")
    .attr("id",function(d) {return d.id;})
    .style("opacity","0");

  details.append("text")
    .attr("class", "text_year text_year1")
    .attr({"dy":"-7", "dx":"9"})
    .attr("transform", function(d, i) {
      var delta = x(maxHeight - d.displaced);
      return "translate(" + i * 1.3 * barWidth + "," + delta + ")"; })
    .text(function(d) {return d.displaced;});

  details.append("text")
    .attr("class", "text_year text_year2")
    .attr({"dy":"15", "dx":"19"})
    .attr("transform", function(d, i) {
      var delta = x(maxHeight - (+d.displaced * 0.01 * +d.perc));
      return "translate(" + i * 1.3 * barWidth + "," + delta + ")"; })
    .text(function(d) {return d.perc + "%";});

  d3.select("#y5")
    .style("opacity","1");
  
  var legend = chart.append("g")
      .attr("transform","translate(372,299.4527)")
  legend.append("line")
      .attr({"x1":"0", "y1":"32.8638", "x2":"48", "y2":"32.8638"})
      .style({"fill":"#b20000", "stroke-width":"2px", "stroke":"#b20000", "stroke-dasharray":"4, 4"});
  legend.append("line")
      .attr({"x1":"0", "y1":"0", "x2":"48", "y2":"0"})
      .style({"fill":"#b20000", "stroke-width":"2px", "stroke":"#b20000", "stroke-dasharray":"4, 4"});
  legend.append("text")
      .attr("class","text_year text_year3")
      .text("Annual global displacement in million")
      .attr("transform","translate(50,5)");
  legend.append("text")
      .attr("class","text_year text_year3")
      .text("by events causing 1 million or more displaced")
      .attr("transform","translate(50,37.8638)");

  /*Make the chart responsive*/
  var chart = $("#chart_years"),
      aspect = chart.width() / chart.height(),
      container = chart.parent();
  $(window).on("resize", function() {
      var targetWidth = container.width();
      chart.attr("width", targetWidth);
      chart.attr("height", Math.round(targetWidth / aspect));
  }).trigger("resize");

})()