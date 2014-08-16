(function() {
  var margin = {top: 40, right: 40, bottom: 40, left: 40},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var svg = d3.select("#case2").append("svg")
      .attr("id","case2SVG")
      .attr("viewBox", "0 0 500 500")          // make it
      .attr("preserveAspectRatio", "xMidYMid")  // responsive
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  /*svg
    .append('defs')
    .append('pattern')
      .attr('id', 'dotsPattern')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 1.5)
      .attr('height', 1.5)
      .attr('patternTransform', 'rotate(45)')
    .append('circle')
      .attr('cx', '1')
      .attr('cy', '1')
      .attr("r","0.5")
      .attr('stroke', 'none')
      .attr("fill","#aaa");*/
  
  svg
    .append('defs')
    .append('pattern')
      .attr('id', 'diagonalHatchCase2')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
    .append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#d8a800')
      //.attr('stroke', 'rgb(83, 83, 83)')
      .attr('stroke-width', 1);

  // scales and axes

  var x = d3.scale.ordinal()
      .rangeBands([0,width*0.97],0,0);

  var xAxis = d3.svg.axis()
      .scale(x);

  var C = 0.65;
  var C1 = 0.3;

  var y = d3.scale.linear()
      .range([height*C, 150]);

  var yBottom = d3.scale.linear()
      .range([height*C1, 0]);

  /*var yAxis = d3.svg.axis()
      .scale(y)
      .tickSize(width)
      .tickFormat(function(d){
        return d + "%";
      })
      .orient("right");*/

  var observables;

  // get the data

  d3.csv("./data/data-case2.csv", function(d) {
    var keys = d3.keys(d);
    observables = {
      "field0": keys[0],
      "field1": keys[1],
      "field2": keys[2],
      "field3": keys[3],
      "field4": keys[4]          
    };
    return {
      field0: d[keys[0]],
      field1: +d[keys[1]],
      field2: +d[keys[2]],
      field3: +d[keys[3]],
      field4: +d[keys[4]],
    };
  }, function(error, data) {

    var color = d3.scale.ordinal()
        .domain(d3.keys(data[0]).filter(function(key) { return key !== "field0"}))
        .range(["#D8A800","#535353","#d8a800","#535353"]);
    
    // update scale domains

    x.domain(data.map(function (d) { return d.field0; }));
    y.domain([0,d3.max([
      d3.max(data, function(d) { return d.field1; }),
      d3.max(data, function(d) { return d.field2; })]
      )]);
    yBottom.domain([0,1.1*d3.max([
      d3.max(data, function(d) { return d.field3; }),
      d3.max(data, function(d) { return d.field4; })]
      )]);


    // set bars width
    var barWidth = 0.25 * width/data.length;

    // draw axes
    var xAxisSVG = svg.append("g")
        .attr("transform", "translate(0," + height*C + ")")
        .call(xAxis);
    xAxisSVG.selectAll("text")
        .attr("dy", "1em")
        .attr("dx", "0em")
        .style({
          "text-anchor": "middle",
          "fill":"#535353",
          "font-weight": "bold",
          "font-size":"11px",
          "font-family":"Lato"
        });
    xAxisSVG.selectAll("path")
        .style({
          "fill":"none",
          "stroke": "#333",
          "stroke-width": "0px"
        });
    xAxisSVG.selectAll("line")
        .style({
          "fill":"none",
          "stroke": "none",
          "stroke-width": "1px"
        });

    var yAxis = d3.svg.axis()
        .scale(yBottom)
        .tickSize(5)
        //.tickFormat(formatCurrency)
        .orient("right");

    /*yAxisSVG.selectAll("line")
        .style({
          "fill":"none",
          "stroke": "none",
          "stroke-width": "1px"
        });*/




    // draw data

    var bar1 = svg.selectAll(".bar1")
        .data(data)
      .enter().append("g")
        .attr("class","bar1");
    bar1.append("rect")
        .attr("x",function(d){ return x(d.field0) + barWidth; })
        .attr("class",function(d,i){ return "g"+i})
        .attr("width",barWidth)
        /*.attr("y",function(d){
          var den = d.field1 + d.field2;
          if (den != 0) {
            return y(100 * d.field1/den);
          } else {
            return y(0);
          }
        })
        .attr("height",function(d){
          var den = d.field1 + d.field2;
          if (den != 0) {
            return height - y(100 * d.field1/den);
          } else {
            return height - y(0);
          }
        })*/
        .attr("y",function(d){ return y(d.field1); })
        .attr("height",function(d){ return height*C - y(d.field1); })
        .style("fill", function(d) { return color("field1"); });
    bar1.append("text")
        .attr("x",function(d){ return x(d.field0) + 2 * barWidth; })
        .attr("dx","-0.3em")
        /*.attr("y",function(d){
          var den = d.field1 + d.field2;
          if (den != 0) {
            return y(100 * d.field1/den);
          } else {
            return y(0);
          }
        })*/
        .attr("y",function(d){ return y(d.field1); })
        .attr("dy","-0.4em")
        /*.text(function(d){
          var den = d.field1 + d.field2;
          if (den != 0) {
            var res = 100 * d.field1/den;
            return res.toFixed(0) + "%";
          } else {
            var res = 0;
            return res.toFixed(0) + "%";
          }
        })*/
        .text(function(d){
          var i = d.field1;
          return i === parseInt(i) ? i : i.toFixed(2);
        })
        .style("fill", function(d) { return color("field1"); })
        .style({
          "text-anchor": "end",
          "font-size":"11px",
          "font-weight": "bold",
          "font-family":"Lato"
        });

    var bar2 = svg.selectAll(".bar2")
        .data(data)
      .enter().append("g")
        .attr("class","bar2");
    bar2.append("rect")
        .attr("x",function(d){ return x(d.field0) + 2 * barWidth; })
        .attr("class",function(d,i){ return "g"+i})
        .attr("width",barWidth)
        /*.attr("y",function(d){
          var den = d.field1 + d.field2;
          if (den != 0) {
            return y(100 * d.field2/den);
          } else {
            return y(0);
          }
        })
        .attr("height",function(d){
          var den = d.field1 + d.field2;
          if (den != 0) {
            return height - y(100 * d.field2/den);
          } else {
            return height - y(0);
          }
        })*/
        .attr("y",function(d){ return y(d.field2); })
        .attr("height",function(d){ return height*C - y(d.field2); })
        .style("fill", function(d) { return color("field2"); });
    bar2.append("text")
        .attr("x",function(d){ return x(d.field0) + 2 * barWidth; })
        .attr("dx","0.3em")
        /*.attr("y",function(d){
          var den = d.field1 + d.field2;
          if (den != 0) {
            return y(100 * d.field2/den);
          } else {
            return y(0);
          }
        })*/
        .attr("y",function(d){ return y(d.field2); })
        .attr("dy","-0.4em")
        /*.text(function(d){
          var den = d.field1 + d.field2;
          if (den != 0) {
            var res = 100 - 100 * d.field1/den;
            return res.toFixed(0) + "%";
          } else {
            var res = 0;
            return res.toFixed(0) + "%";
          }
        })*/
        .text(function(d){
          var i = d.field2;
          return i === parseInt(i) ? i : i.toFixed(2);
        })
        .style("fill", function(d) { return color("field2"); })
        .style({
          "text-anchor": "start",
          "font-size":"11px",
          "font-weight": "bold",
          "font-family":"Lato"
        });


    // svg line generator
    var line3 = d3.svg.line()
      .x(function(d) { return x(d.field0) + 2 * barWidth; })
      .y(function(d) { return yBottom(d.field3); })
      //.interpolate("linear"); // linear interpolation
      .interpolate("basis");  //  B-spline interpolation

    var line4 = d3.svg.line()
      .x(function(d) { return x(d.field0) + 2 * barWidth; })
      .y(function(d) { return yBottom(d.field4); })
      //.interpolate("linear"); // linear interpolation
      .interpolate("basis");  //  B-spline interpolation

    var lines = svg.append("g")
        .attr("transform","translate(0," + (height*C+35) + ")");

    var rectBackGround = lines.selectAll("rect")
        .data(data)
      .enter().append("rect")
        .attr("class",function(d,i){ return "gb"+i})
        .attr("x",function(d){ return x(d.field0) + barWidth; })
        .attr("width",2 * barWidth)
        .attr("y",0)
        .attr("height",height*C1)
        .style("fill","url(#diagonalHatchCase2)")
        .style("opacity", "0.7");
    
    var datalines3b = lines.append("path")
        .datum(data)
        .attr("d",line3)
        .style({
          "stroke-linecap": "round",
          "stroke-width":"7px",
          "stroke":"#fff",
          "fill":"none",
          "stroke-opacity":"0.6"
        });

    var datalines3 = lines.append("path")
        .datum(data)
        .attr("d",line3)
        .style({
          "stroke-linecap": "round",
          "stroke-width":"1px",
          "stroke":"#d8a800",
          "fill":"none"
        });



    /*datadots3 = lines.selectAll(".datadots3")
        .data(data)
      .enter().append("circle")
        .attr("cx",function(d){ return x(d.field0) + 2 * barWidth; })
        .attr("cy",function(d){ return yBottom(d.field3); })
        .attr("r","3px")
        .attr("class",function(d,i){ return "g"+i})
        .style({
          "fill":"#a6c0d6"
        });*/
    var datalines4b = lines.append("path")
        .datum(data)
        .attr("d",line4)
        .style({
          "stroke-linecap": "round",
          "stroke-width":"7px",
          "stroke":"#fff",
          "fill":"none",
          "stroke-opacity":"0.6"
        });
    var datalines4 = lines.append("path")
        .datum(data)
        .attr("d",line4)
        .style({
          "stroke-linecap": "round",
          "stroke-width":"1px",
          "stroke":"#535353",
          "fill":"none"
        });
    /*datadots4 = lines.selectAll(".datadots4")
        .data(data)
      .enter().append("circle")
        .attr("cx",function(d){ return x(d.field0) + 2 * barWidth; })
        .attr("cy",function(d){ return yBottom(d.field4); })
        .attr("r","3px")
        .attr("class",function(d,i){ return "g"+i})
        .style({
          "fill":"#535353",
        });*/

    var yAxisSVG = lines.append("g")
        .attr("transform","translate(" + (width*0.97-15) + ",0)")
        .call(yAxis);
    yAxisSVG.selectAll("path").remove();
    yAxisSVG.selectAll("line")
        .style({
          "stroke":"#aaa",
          "stroke-width":"0px"
        });
    yAxisSVG.selectAll("text")
        .style({
          "fill":"#535353",
          "text-anchor": "start",
          "font-size":"10px",
          "font-weight": "bold",
          "font-family":"Lato"
        });

    var bar0 = svg.selectAll(".bar0")
        .data(data)
      .enter().append("g")
        .attr("class","bar0");
    bar0.append("rect")
        .attr("x",function(d){ return x(d.field0) + barWidth; })
        .attr("width",2 * barWidth)
        .attr("y",100)
        .attr("height",height - 80)
        .style("fill","#eee")
        .style("opacity", "0")
        .on('mouseover', function(d,i){
            //svg.selectAll(".g"+i).style({opacity:'0.7'});
            svg.selectAll(".g"+i).style({"stroke-width":"1px","stroke":"#fff"});
            svg.selectAll(".gb"+i).style({"stroke-width":"2px","stroke":"#fff"});
        })
        .on('mouseout', function(d,i){
            //svg.selectAll(".g"+i).style({opacity:'1'});
            svg.selectAll(".g"+i).style({"stroke-width":"0px","stroke":"#fff"});
            svg.selectAll(".gb"+i).style({"stroke-width":"0px","stroke":"#fff"});
        })            

    var legend1 = svg.selectAll(".legend1")
        .data(color.domain().slice(0,2))
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend1.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend1.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style({
          "fill":"#535353",
          "font-size":"11px",
          "font-family":"Lato",
          "font-weight": "bold",
          "text-anchor": "end"
        })
        .text(function(d) { return observables[d]; });

    var legend2 = svg.selectAll(".legend2")
        .data(color.domain().slice(2,4))
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + (60 + i * 20) + ")"; });

    legend2.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "url(#diagonalHatchCase2)");

    legend2.append("circle")
        .attr({
          "cx": width - 9,
          "r": "5"
        })
        .attr("transform","translate(0,9)")
        .style("fill", color);

    legend2.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style({
          "fill":"#535353",
          "font-size":"11px",
          "font-family":"Lato",
          "font-weight": "bold",
          "text-anchor": "end"
        })
        .text(function(d) { return observables[d]; });

  });

  function resize(id) {
    var chart = $("#"+id),
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

  // Responsiveness
  resize("case2SVG");

})()