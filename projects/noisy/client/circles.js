var root;

root = typeof this !== "undefined" && this !== null ? this : exports;

Template.circles.rendered = function() {

  var width = 80;
  var height = 80;

  var svg = d3.select("#containerCircles").append("svg")
      .attr("id", "chart")
      .attr("viewBox", "0 0 80 80")          // make it
      .attr("preserveAspectRatio", "xMidYMid") // responsive
      .attr("width", width)
      .attr("height", height);
  
  var circles = svg.append("g").attr("id","circles").attr("transform","scale(0.9) translate(5,2)");
  
  var c1 = circles.append("circle")
      .attr("id","circle1")
      .attr({"cx":"40", "cy":"10", "r":"10"});
  //c1.append("text").text("ciao").style({"font-size":"8px", "fill":"#131313"});
  var c2 = circles.append("circle")
      .attr("id","circle2")
      .attr({"cx":"10", "cy":"40", "r":"10"});
  var c3 = circles.append("circle")
      .attr("id","circle3")
      .attr({"cx":"40", "cy":"40", "r":"10"});
  var c4 = circles.append("circle")
      .attr("id","circle4")
      .attr({"cx":"70", "cy":"40", "r":"10"});
  var c5 = circles.append("circle")
      .attr("id","circle5")
      .attr({"cx":"40", "cy":"70", "r":"10"});
  var c5 = circles.append("circle")
      .attr("id","circle6")
      .attr({"cx":"70", "cy":"70", "r":"10"});



  // Responsive
  var chart = $("#chart"),
      aspect = chart.width() / chart.height(),
      container = chart.parent();
  var resize = function() {
      var targetWidth = container.width();
      chart.attr("width", targetWidth);
      chart.attr("height", Math.round(targetWidth / aspect));
  };
  $(window).on("resize", resize).trigger("resize");
  $(window).on("ready", resize).trigger("resize");

}



