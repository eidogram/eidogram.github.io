(function(){

  var data = [ 
    {"type":"Flood", "displaced":"22.010.000"},
    {"type":"Storm", "displaced":"9.567.000"},
    {"type":"Earthquake", "displaced":"637.000"},
    {"type":"Wildfire", "displaced":"59.000"},
    {"type":"Landslide", "displaced":"47.000"},
    {"type":"Volcano", "displaced":"43.000"}
  ];

  var toStr = function(a) {
      return Number(a.replace(".", "").replace(".", ""));
    };

  var x = d3.scale.linear()
    .range([0,70])
    .domain([0, Math.sqrt(22010000)]);

  var width = 900,
      height = 400;

  var chart = d3.select("#container_type")
    .append("svg")
    .attr("id","chart_type")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 900 400")          // make it
    .attr("preserveAspectRatio", "xMidYMid"); // responsive

  chart.append("text")
    .text("People displaced by type of related hazard in 2012")
    .attr("class","title")
    .attr({"x":"110", "y":"70"}); 

  var tmp = 0,
      dist = 50;

  var circles = chart.append("g")
      .attr("transform","translate(150,90)")
    .selectAll("circle")
      .data(data)
    .enter().append("g")
    .attr("transform", function(d) {
      var pos = tmp + x(Math.sqrt(toStr(d.displaced)));
      tmp = pos + x(Math.sqrt(toStr(d.displaced))) + dist;
      return "translate(" + pos + ",200)";});

  circles.append("circle")
      .attr("class","circletype")
      .attr("r",function(d) { return x(Math.sqrt(toStr(d.displaced))); })
      .attr("cy",function(d) { return -x(Math.sqrt(toStr(d.displaced))); });

  circles.append("text")
    .attr("class","typetext")
    .text(function(d) {return d.type;})
    .attr("transform","rotate(45)")
    .attr({"dx":"17", "dy":"15"})
    .attr("text-anchor", "start");

  circles.append("text")
    .attr("class","typetext1 typetext")
    .text(function(d) {return d.displaced;})
    .attr("transform","rotate(45)")
    .attr({"dx":"17", "dy":"30"})
    .attr("text-anchor", "start");

  /*Make the chart responsive*/
  var chart = $("#chart_type"),
      aspect = chart.width() / chart.height(),
      container = chart.parent();
  $(window).on("resize", function() {
      var targetWidth = container.width();
      chart.attr("width", targetWidth);
      chart.attr("height", Math.round(targetWidth / aspect));
      //container.css("padding-top", (container.height() - chart.height())/2);
  }).trigger("resize");


})()