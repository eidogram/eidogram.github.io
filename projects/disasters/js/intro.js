(function() {

  d3.json("./map/world.json", function(error, topology) {
    var land = topojson.feature(topology, topology.objects.countries);
    var path = d3.geo.path()
      .projection(projection);
    group.append("path")
      .datum(land)
      .attr("d", path);
    /*group1.append("path")
      .datum(land)
      .attr("d", path);*/
  });

  var projection = d3.geo.mercator()
    .rotate([-11.5,0])
    .scale(140);

  var width = 960,
      height = 500;

  var img = d3.select("#container")
    .append("svg")
    .attr("id", "chart")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 960 500")          // make it
    .attr("preserveAspectRatio", "xMidYMid"); // responsive

  //img.attr("transform","scale(1.5)"); 

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
    .attr("id","Mask");

  // visible map
  /*
  var group1 = img.append("g")
    .attr("transform","translate(0," + height * 0.15 + ")")
    .style("fill","#f5f5f5");
  */

  // masked map
  var group = img.append("g")
    .attr("mask","url(#Mask)")
    .attr("transform","translate(-30," + height * 0.03 + ")")
    .style({"fill":"#B20000", "opacity":"1"});


  var background = group.append("rect")
    .attr("mask","url(#Mask)")
    .attr({"width":width, "height":height, "x":0, "y":0})
    //.style("fill","E4D00A");
    .style("fill","#65000B");


  var title = img.append("g")
    .attr("transform","translate(" + width * 0.15  + "," + height * 0.1 + ")")
    .attr("class","maintitle");
  title.append("text")
    .attr("dy",0)
    .style({"text-transform":"uppercase", "font-size":"25px"})
    //.text("#32.026.621");
    .text("32.4 million");
  title.append("text")
    .attr("dy",15)
    .style({"text-transform":"uppercase", "font-size":"8px"})
    .text("Worldwide people displaced");
  title.append("text")
    .attr("dy",24)
    .style({"text-transform":"uppercase", "font-size":"8px"})
    .text("during 2012 due to natural disasters");
  /*title.append("text")
    .attr("dy",37)  
    .style({"font-size":"8px"})
    .text("Data visualization by");
  title.append("a")
    .attr("xlink:href","http://tuxtax.ch/")
    .attr("target","_blank")
    .append("text")
      .attr({"dx":"80", "dy":"37"})  
      .style({"font-size":"8px"})
      .text("TUXTAX");*/
  
  title.append("text")
    .attr("dy",37) 
    .style({"font-size":"8px"})
    .text("Data and text from ");
  title.append("a")
    .attr("xlink:href","http://www.internal-displacement.org/")
    .attr("target","_blank")
    .append("text")
      .attr({"dx":"71", "dy":"37"})  
      .style({"font-size":"8px", "text-decoration":"underline", "fill":"#65000B"})
      .text("iDMC");


  title.transition().duration(2000).delay(100000)
    .style("opacity","1");


  /*
  var share = img.append("g")
    .attr("transform","translate(" + width * 0.12  + "," + height * 0.07 + ")")
    .attr("class","maintitle");

  //http://bl.ocks.org/mbostock/3094619
  var sharelink = share.append("a")
    .attr("target","_blank")
    .attr("xlink:href","https://twitter.com/intent/tweet?original_referer=http://tuxtax.ch&url=www.tuxtax.ch/people-displaced-by-disasters/&text=World%20amount%20of%20people%20displaced%20during%202012%20due%20to%20natural%20disasters.%20%23DataViz%20by%20Tuxtax.");

  
  sharelink.append("text")
    .attr("transform","translate(755, -2)") 
    .style("fill","131313")
    .text("Share on Twitter");
  

  sharelink.append("path")
    .attr("transform","translate(805, -30) scale(.05)")
    .attr("d","M 630, 425 A 195, 195 0 0 1 331, 600 A 142, 142 0 0 0 428, 570 A  70,  70 0 0 1 370, 523 A  70,  70 0 0 0 401, 521 A  70,  70 0 0 1 344, 455 A  70,  70 0 0 0 372, 460 A  70,  70 0 0 1 354, 370 A 195, 195 0 0 0 495, 442 A  67,  67 0 0 1 611, 380 A 117, 117 0 0 0 654, 363 A  65,  65 0 0 1 623, 401 A 117, 117 0 0 0 662, 390 A  65,  65 0 0 1 630, 425 Z")
    .style("fill","#65000B");

  share.transition().duration(2000).delay(101000)
    .style("opacity","1");

  var logo = img.append("a")
    .attr("xlink:href","http://tuxtax.ch/")
    .attr("target","_blank")
    .append("image")
      .style("opacity","0")
      .attr("xlink:href","tuxtax.svg")
      .attr({"x":"920", "y":"462", "width":"45", "height":"35"});


  logo.transition().duration(2000).delay(101000)
    .style("opacity","1");
  */

  var tot_text = img.append("text")
    //.attr("transform","translate(" + width/2 * 1  + "," + height * 0.2 + ")")
    .attr("class","tot")
    .attr("x",width * 0.3)
    .attr("y",height * 0.07)
    .attr("text-anchor", "end")
    .style({"font-size":"15", "opacity":"1"})
    .text("");

  /*
  var bottom = img.append("g")
    .attr("transform","translate(" + width * 0  + "," + height * 0.85 + ")")
    .attr("class","bottom")
    .style("opacity","0");

  bottom.transition().duration(2000).delay(100000)
    .style("opacity","1");

  var cause1 = bottom.append("g")
    .attr("transform","translate(" + width * 0.15  + "," + height * 0 + ")");

  cause1.append("text")
    .attr({"dy":0, "dx":0})
    .text("20.2%");
  cause1.append("text")
    .attr({"dy":15, "dx":0})
    .attr("class","cause")
    .text("Meteorological");
  var causes1 = cause1.append("g")
    .attr("transform","translate(" + width * 0  + "," + height * 0.06 + ")")
    .attr("class","causes");
  causes1.append("text")
    .attr({"dy":0, "dx":0})
    .text("Storms: tropical, winter,");   
  causes1.append("text")
    .attr({"dy":10, "dx":0})
    .text("tornados, snow and sand.");   


  var cause2 = bottom.append("g")
    .attr("transform","translate(" + width * 0.35 + "," + height * 0 + ")");

  cause2.append("text")
    .attr({"dy":0, "dx":0})
    .text("62.4%");
  cause2.append("text")
    .attr({"dy":15, "dx":0})
    .attr("class","cause")
    .text("Hydrological");
  var causes2 = cause2.append("g")
    .attr("transform","translate(" + width * 0  + "," + height * 0.06 + ")")
    .attr("class","causes");
  causes2.append("text")
    .attr({"dy":0, "dx":0})
    .text("Floods: flash, coastal, riverine,");   
  causes2.append("text")
    .attr({"dy":10, "dx":0})
    .text("snow melt, dam releases;");   
  causes2.append("text")
    .attr({"dy":20, "dx":0})
    .text("wet mass movements: landslides,"); 
  causes2.append("text")
    .attr({"dy":30, "dx":0})
    .text("avalanches, sudden subsidence,"); 
  causes2.append("text")
    .attr({"dy":40, "dx":0})
    .text("Sea-level rise."); 

  var cause3 = bottom.append("g")
    .attr("transform","translate(" + width * 0.55  + "," + height * 0 + ")");

  cause3.append("text")
    .attr({"dy":0, "dx":0})
    .text("0.7%");
  cause3.append("text")
    .attr({"dy":15, "dx":0})
    .attr("class","cause")
    .text("Climatological");
  var causes3 = cause3.append("g")
    .attr("transform","translate(" + width * 0  + "," + height * 0.06 + ")")
    .attr("class","causes");
  causes3.append("text")
    .attr({"dy":0, "dx":0})
    .text("Extreme winter conditions,");   
  causes3.append("text")
    .attr({"dy":10, "dx":0})
    .text("heat waves, wild fires,"); 
   causes3.append("text")
    .attr({"dy":20, "dx":0})
    .text("Drought (with associated food Insecurity)");  


  var cause4 = bottom.append("g")
    .attr("transform","translate(" + width * 0.75  + "," + height * 0 + ")");

  cause4.append("text")
    .attr({"dy":0, "dx":0})
    .text("16.7%");
  cause4.append("text")
    .attr({"dy":15, "dx":0})
    .attr("class","cause")
    .text("Geophysical");
  var causes4 = cause4.append("g")
    .attr("transform","translate(" + width * 0  + "," + height * 0.06 + ")")
    .attr("class","causes");
  causes4.append("text")
    .attr({"dy":0, "dx":0})
    .text("Earthquakes and tsunamis,");   
  causes4.append("text")
    .attr({"dy":10, "dx":0})
    .text("volcanic eruptions, dry mass movements");   
  causes4.append("text")
    .attr({"dy":20, "dx":0})
    .text("(rock falls, landslides,"); 
  causes4.append("text")
    .attr({"dy":30, "dx":0})
    .text("avalanches, sudden Subsidence)")
  causes4.append("text")
    .attr({"dy":40, "dx":0})
    .text("Long-lasting subsidence Volcanic mud flow.")

  d3.select("#logo").transition().duration(2000).delay(100000)
    .style("opacity","1");

  d3.select("#tweet").transition().duration(2000).delay(100000)
    .style("opacity","1");

  */

  /* -------------- DATA --------------- */

  var du = 350,         // exp transition duration (1000 = 1 sec)
      du1 = 2.5 * 1000,  // linear transition duration
      delta = 1000,     // delta time between exp and linear
      maxtime = 80;     // simulation length in seconds


  var k = 3,   // R = A^.5 * k is the cirle radius (A is the deplacement value)
      k1 = 3;  // R * k1 is the external circle radius


  d3.json("./data/data.json", function(error, data) {
    
    data.sort(function (a, b) { return a.deplacement - b.deplacement; }); // higher evacuations are on the top

    var dato, index, newdata, _fn, _i, _len;

    newdata = [];

    var italy;

    italy = function(dato) {
      if (dato.country === 'Italy') {
        return 1 * 1000;
      } else {
        return 1000 * ((index + Math.random()) * 1  + 14);
      }
    };

    _fn = function(dato) {
      return newdata.push(_.extend(dato, {
        //"date": 1000 * (index + Math.random()),
        "date": italy(dato),
        "xy": projection([dato.lng,dato.lat]),
        "R": Math.log(Math.sqrt(dato.deplacement)) * k // Area = k * log(data)
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

    circles = d3.select("#Mask").selectAll("circle")
        .data(newdata)
      .enter().append("g");

    circles.append("circle")
      .attr("cx",function(d) { return d.xy[0]; })
      .attr("cy",function(d) { return d.xy[1]; })
      .attr({"r":"0", "fill":"#212121", "opacity":0.5})
      //.attr("shape-rendering","optimizeSpeed")      
      //.attr("shape-rendering","geometricPrecision")
      .transition().ease("exp").duration(du).delay(function(d) { return d.date; })
        .attr("r",function(d) { return d.R * k1; });

    circles.append("circle")
      .attr("cx",function(d) { return d.xy[0]; })
      .attr("cy",function(d) { return d.xy[1]; })
      .attr({"r":"0", "fill":"#fff"})
      //.attr("shape-rendering","optimizeSpeed")      
      //.attr("shape-rendering","geometricPrecision")
      .transition().ease("exp").duration(du).delay(function(d) { return d.date; })
        .attr("r",function(d) { return d.R; })
      .transition().ease("linear")
      .duration(function(d) {
        if (d.country === "Italy") {
          return du1 * 5;
        } else {
          return du1;
        }
      })
      .delay(function(d) { return d.date + delta; })
        .attr("r",function(d) { return d.R * 1.4142; });

    circles.append("circle")
      .attr("cx",function(d) { return d.xy[0]; })
      .attr("cy",function(d) { return d.xy[1]; })
      .attr({"r":"0", "fill":"#212121"})
      //.attr("shape-rendering","optimizeSpeed")
      //.attr("shape-rendering","geometricPrecision")
      .transition().ease("linear")
      .duration(function(d) {
        if (d.country === "Italy") {
          return du1 * 5;
        } else {
          return du1;
        }
      })
      .delay(function(d) { return d.date + delta; })
        .attr("r",function(d) { return d.R; });
    
    texts = img.append("g")
      .attr("transform","translate(-30," + height * 0.03 + ")")
      .selectAll("text")
        .data(newdata)
      .enter();
    
    texts.append("text")
      .text(function(d) {
        if (d.country === "Italy") {
          return "people displaced in " + d.country;
        } else {
          return d.country;
        }
      })
      .attr("class","info")
      .attr("x",function(d) { return d.xy[0]; })
      .attr("y",function(d) { return d.xy[1]; })
      .attr("text-anchor", "middle")
      //.attr("dy",".31em")
      .attr("dy", function(d) { return d.R + 30; })
      .transition().ease("exp").duration(du).delay(function(d) { return d.date; })
      .style({"opacity":"1"})
      .transition().ease("linear").duration(du * 8)
      .delay(function(d) {
        if (d.country === "Italy") {
          return d.date + du1 * 4.5 + 500;
        } else {
          return d.date + 1500;
        }
      })
      .style({"opacity":"0"});

    texts.append("text")
      .text(function(d) {
        if (d.country === "Italy") {
          return "during 2012 due to natural disasters";
        } else {
          return;
        }
      })
      .attr("class","info")
      .attr("x",function(d) { return d.xy[0]; })
      .attr("y",function(d) { return d.xy[1]; })
      .attr("text-anchor", "middle")
      //.attr("dy",".31em")
      .attr("dy", function(d) { return d.R + 40; })
      .transition().ease("exp").duration(du).delay(function(d) { return d.date; })
      .style({"opacity":"1"})
      .transition().ease("linear").duration(du * 8)
      .delay(function(d) {
        if (d.country === "Italy") {
          return d.date + du1 * 4.5 + 500;
        } else {
          return d.date + 1500;
        }
      })
      .style({"opacity":"0"});

    texts.append("text")
      .text(function(d) { return 0; })
      .attr("class","numb")
      .attr("x",function(d) { return d.xy[0]; })
      .attr("y",function(d) { return d.xy[1]; })
      .attr("text-anchor", "middle")
      //.attr("dy",".31em")
      .attr("dy", function(d) { return d.R + 20; })
      .transition().ease("exp").duration(du).delay(function(d) { return d.date; })
      .style({"opacity":"1"})
      .transition().ease("linear")
      .duration(function(d) {
        if (d.country === "Italy") {
          return du1 * 4.5;
        } else {
          return 1000;
        }
      })
      .delay(function(d) { return d.date + 500; })
      .tween("text", function(d) {
        var i = d3.interpolate(this.textContent, d.deplacement);
        return function(t) {
          this.textContent = Math.round(i(t));
        };
      })
      .transition().ease("linear").duration(du * 8)
      .delay(function(d) {
        if (d.country === "Italy") {
          return d.date + du1 * 4.5 + 500;
        } else {
          return d.date + 1500;
        }
      })   
      .style({"opacity":"0"});


  });

/* ----------------------------------- */

  // Make the chart responsive

  var chart = $("#chart"),
      aspect = chart.width() / chart.height(),
      container = chart.parent();
  $(document).ready( function() {
      var targetWidth = container.width();
      var targetHeight = container.height();
      var max = Math.max(targetWidth,targetHeight);
      var min = Math.min(targetWidth,targetHeight);
      chart.attr("width", max);
      chart.attr("height", Math.round(max / aspect));
  });

})();