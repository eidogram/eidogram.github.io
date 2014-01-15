(function(){

  d3.json("./map/world.json", function(error, topology) {
    var land = topojson.feature(topology, topology.objects.countries);
    var path = d3.geo.path()
      .projection(projection);
    group.append("path")
      .datum(land)
      .attr("d", path);
    group1.append("path")
      .datum(land)
      .attr("d", path);

  });

  /*var projection = d3.geo.mercator()
    .rotate([-11.5,0])
    .scale(140);
  */

  var projection = d3.geo.azimuthalEqualArea()
      .clipAngle(180 - 1e-3)
      .scale(140)
      //.translate([width / 2, height / 2])
      .precision(.1);

  var width = 900,
      height = 600;

  var img = d3.select("#container_map")
    .append("svg")
    .attr("id", "chart_map")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 800 800")          // make it
    .attr("preserveAspectRatio", "xMidYMid"); // responsive

  
  img.append("text")
    .text("Top 20 largest disaster-induced displacement events")
    .attr("class","title")
    .style("font-size","32px")
    .attr({"x":"-100", "y":"50"}); 


  var defs = img.append("defs")

  /*
  var gradient = defs.append("radialGradient")
    .attr("id", "gradient")
    .attr({"cx":"50%","cy":"50%","r":"100%"});
  gradient.append("stop")
    .attr({"stop-color":"white","offset":"0%"});
  gradient.append("stop")
    .attr({"stop-color":"black","offset":"100%"});
  */

  var mask = defs.append("mask")
    .attr("id","MaskMap");

  // visible map

  var group1 = img.append("g")
    .attr("transform","translate(-280," + height * 0.2 + ")")
    .style({"fill":"#f4ede5", "stroke":"#65000b"});



  // masked map
  var group = img.append("g")
    .attr("mask","url(#MaskMap)")
    .attr("transform","translate(-280," + height * 0.2 + ")")
    .style({"fill":"#B20000", "opacity":"1"});

  /*
  var background = group.append("rect")
    .attr("mask","url(#Mask)")
    .attr({"width":width, "height":height, "x":0, "y":0})
    .style("fill","E4D00A");
  */

  var barmaxwidth = 200,
      barHeight = 19;

  var bars = img.append("g")
    .attr("transform","translate(720,130)")
    .attr("width", barmaxwidth);


  /* -------------- DATA --------------- */

  var k = 0.5,   // R = A^.5 * k is the cirle radius (A is the deplacement value)
      k1 = 3;  // R * k1 is the external circle radius

  var x = d3.scale.linear()
      .range([0, barmaxwidth]);

  var toStr = function(a) {
      return Number(a.replace(".", "").replace(".", ""));
    };


  d3.json("./data/top.json", function(error, data) {
    
    x.domain([0, d3.max(data, function(d) { return toStr(d.displaced); })]);
    data.sort(function (a, b) { return toStr(b.displaced) - toStr(a.displaced); }); // higher evacuations are on the top

    bars.attr("height", barHeight * data.length);

    var move = function(d) {
      focus_circle.transition().duration(1500).delay(0)
        .attr("cx", d.xy[0])
        .attr("cy", d.xy[1])
        .attr("r", d.R * k1);
      focus_text1.transition().duration(800).style("opacity","0");
      focus_text2.transition().duration(800).style("opacity","0");
      focus_text3.transition().duration(800).style("opacity","0");
      focus_text1.transition().duration(0).delay(900);
      focus_text1.transition().duration(800).delay(1000)
        .text(d.event)
        .style("opacity","1");
      focus_text2.transition().duration(0).delay(900);
      focus_text2.transition().duration(800).delay(1000)
        .text(d.displaced + " displaced")
        .style("opacity","1");
      focus_text3.transition().duration(0).delay(900);
      focus_text3.transition().duration(800).delay(1000)
        .text(d.date + " 2012")
        .style("opacity","1");
      bar.style({"fill":"transparent"});
      bars.select("#" + d.id)
        .style({"fill":"#b20000"});
    };

    var bar = bars.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("id", function(d) {return d.id;})
        .attr("class","map-rects")
        .attr("transform", function(d, i) { return "translate(0," + i * 1.3 * barHeight + ")"; })
        .on("click", move);


    bar.append("rect")
        .attr({"rx":"5", "ry":"5"})
        .attr("width", function(d) { return x(toStr(d.displaced)); })
        .attr("height", barHeight - 1);


    bar.append("text")
        .attr("class","mapbartext")
        .attr("x","-5")
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .attr("text-anchor","end")
        .text(function(d) { return d.country; });

    bars.select("#c1")
      .style("fill","#b20000");


    data.sort(function (a, b) { return toStr(a.displaced) - toStr(b.displaced); }); // higher evacuations are on the top
    var dato, index, newdata, _fn, _i, _len;

    newdata = [];

    _fn = function(dato) {
      return newdata.push(_.extend(dato, {
        //"date": 1000 * (index + Math.random()),
        "xy": projection([dato.lng,dato.lat]),
        "R": Math.log(Math.sqrt(toStr(dato.displaced)) * k) // Area = k * log(data)
      }));
    };

    for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
      dato = data[index];
      _fn(dato);
    }

    
    /*
    var tot_time = data.reduce(function(previousValue, currentValue, index, array){
      return previousValue < currentValue.date ? currentValue.date : previousValue;
    },0);
    */

    /*credits.transition().duration(2000).delay(tot_time + 3000)
      .style("opacity",1);*/

    
    var circles0 = img.selectAll("circle")
        .data(newdata)
      .enter();

    circles0.append("circle")
      .attr("transform","translate(-280," + height * 0.2 + ")")
      .style("opacity",0)
      .attr("cx",function(d) { return d.xy[0]; })
      .attr("cy",function(d) { return d.xy[1]; })
      .attr("r",function(d) { return d.R * k1; })
      .on("click", move);
      


    var circles = d3.select("#MaskMap").selectAll("circle")
        .data(newdata)
      .enter();

    var circles_g = circles.append("g");

    circles_g.append("circle")
      .attr("class","circlemap")
      .attr("cx",function(d) { return d.xy[0]; })
      .attr("cy",function(d) { return d.xy[1]; })
      .attr("r",function(d) { return d.R * k1; });
      /*
      .attr({"r":"0", "fill":"#212121", "opacity":0.5})
      .transition().ease("exp").duration(du).delay(function(d) { return d.date; })
        .attr("r",function(d) { return d.R * k1; });
      */
    
    
    var focus = img.append("g")
      .attr("transform","translate(-280," + height * 0.2 + ")");

    var focus_circle = focus.append("circle")
      .attr("id","focuscircle")
      .attr("cx",newdata[19].xy[0])
      .attr("cy",newdata[19].xy[1])
      .attr("r",newdata[19].R * k1);

    var focus_text = focus.append("g")
      .attr("transform","translate(300,400)")
      .attr("class","focustext");

    var focus_text1 = focus_text.append("text")
      .attr("text-anchor", "start")
      .attr("dy","2.1em")
      .text("Monsoons floods (1st period)");

    var focus_text2 = focus_text.append("text")
      .attr("text-anchor", "start")
      .attr("dy","3.3em")
      .text("6.900.000 displaced");  

    var focus_text3 = focus_text.append("text")
      .attr("text-anchor", "start")
      .attr("dy","4.5em")
      .text("June/July 2012");  
    
  });

  /*Make the chart responsive*/
  var chart = $("#chart_map"),
      aspect = chart.width() / chart.height(),
      container = chart.parent();
  $(window).on("resize", function() {
      var targetWidth = container.width();
      chart.attr("width", targetWidth);
      chart.attr("height", Math.round(targetWidth / aspect));
  }).trigger("resize");

})();



/* ----------------------------------- */