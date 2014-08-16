(function(){
  /*
  var margin = {top: 20, right: 50, bottom: 30, left: 50};
  var width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
  */
  var width = 960;
  var height = 600;

  var svg = d3.select("#case1").append("svg")
      .attr("id", "chartCase1")
      .attr("viewBox", "0 0 500 600")          // make it
      .attr("preserveAspectRatio", "xMidYMid") // responsive
      //.attr("width", width + margin.right + margin.left)
      //.attr("height", height + margin.top + margin.bottom);
      .attr("width", 500)
      .attr("height", 600);

  /*
  svg.append("circle")
      .attr({
        "cx":0,
        "cy":0,
        "r":5
      })
      .style("fill","red");

  svg.append("circle")
      .attr({
        "cx":0,
        "cy":600,
        "r":5
      })
      .style("fill","red");

  svg.append("circle")
      .attr({
        "cx":500,
        "cy":0,
        "r":5
      })
      .style("fill","red");

  svg.append("circle")
      .attr({
        "cx":500,
        "cy":600,
        "r":5
      })
      .style("fill","red");
  */

  var defs = svg.append("defs");
  defs
    .append('pattern')
      .attr('id', 'diagonalHatchCase1')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
    .append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#616161')
      .attr('stroke-width', 1);

  var img = svg.append("g")
      .attr("transform","translate(" + -180 + "," + 0.03 * height + ")");

  var text = svg.append("g")
    .attr("class","text")
    .attr("transform","translate(" + 0 + "," + 0.9 * height + ")");

  //var colors = ["#222222", "#222222", "#232323", "#242424", "#252525", "#262626"];
  var colors = ["#313131", "#323232", "#333333", "#343434", "#353535", "#363636"];
  //var colors = ["red", "violet", "green", "blue", "#22A7F0", "#F7CA18"];
  var electionsDates = {"y13":"24th February 13", "y08":"April 13th 08", "y06":"April 9th 06"};


  d3.json("./data/data-case1.json", function(error, data) {
    
    data.sort(function (a, b) { return b.pop - a.pop; }); // higher evacuations are on the bottom
    
    // linear regression parameters (see ./script.py)
    lr_log = {
      "dens":{
        'y13': {
          's2': 0.0027017114910056154, 
          'ds2a': 0.0024962384773704271,
          'ds2b': 0.0029446469805571914, 
          'b0': 0.65831086653909066, 
          'b1': 0.022717575212475884, 
          'db1a': 0.020320105514684297,
          'db1b': 0.025115044910267472,
          'db0a': 0.64744866413604207,
          'db0b': 0.66917306894213924
        },
        'y08': {
          's2': 0.001786039194332607,
          'ds2a': 0.0016502057210132598,
          'ds2b': 0.0019466382469990311,
          'b0': 0.77294411555819065,
          'b1': 0.0090229863083594909,
          'db1a': 0.0070736842816121045,
          'db1b': 0.010972288335106876,
          'db0a': 0.7641124238881325,
          'db0b': 0.7817758072282488
        },
        'y06': {
          's2': 0.0011516638028308982,
          'ds2a': 0.0010640764223685429,
          'ds2b': 0.001255220385638123,
          'b0': 0.79110304409444676,
          'b1': 0.012696974441421397,
          'db1a': 0.011131678351920712,
          'db1b': 0.014262270530922083,
          'db0a': 0.78401116595287168,
          'db0b': 0.79819492223602184
        }
      },
      "pop":{
        'y13': {
          's2': 0.0030583815060594016,
          'ds2a': 0.0028257827008249291,
          'ds2b': 0.0033333884455063211,
          'b0': 0.64255158164973591,
          'b1': 0.016390834623551127,
          'db1a': 0.013952205833142512,
          'db1b': 0.018829463413959743,
          'db0a': 0.62520089460171535,
          'db0b': 0.65990226869775648
        },
        'y08': {
          's2': 0.0018903631358530948,
          'ds2a': 0.0017465955234778644,
          'ds2b': 0.0020603429043693066,
          'b0': 0.78509683691262211,
          'b1': 0.0038762238184332312,
          'db1a': 0.0019590014509774482,
          'db1b': 0.0057934461858890141,
          'db0a': 0.77145592303920862,
          'db0b': 0.79873775078603559
        },
        'y06': {
          's2': 0.0013252973669047403,
          'ds2a': 0.0012245046490859557,
          'ds2b': 0.0014444669250541853,
          'b0': 0.79764845516190974,
          'b1': 0.0069645734023945334,
          'db1a': 0.0053592721855382185,
          'db1b': 0.0085698746192508484,
          'db0a': 0.78622684021951683,
          'db0b': 0.80907007010430265
        }
      }
    };

    var densScale = d3.scale.log()
      .domain([d3.min(data, function(d) { return d.dens; }), 10 * d3.max(data, function(d) { return d.dens; })])
      .range([0, width]); 

    var percScale = d3.scale.linear()
      .domain([d3.min(data, function(d) { return d["y13"]["perc"]; }), d3.max(data, function(d) { return d["y13"]["perc"]; })])
      .range([0, 500]);
    var popScale = d3.scale.log()
      .domain([d3.min(data, function(d) { return d.pop; }), 10 * d3.max(data, function(d) { return d.pop; })])
      //.domain([d3.min(data, function(d) { return d.pop; }), 2300000])
      .range([0, width]);

    var rDensScale = d3.scale.sqrt()
      .domain([d3.min(data, function(d) { return d.pop; }), d3.max(data, function(d) { return d.pop; })])
      .range([1,70]);

    var rPopScale = d3.scale.sqrt()
      .domain([d3.min(data, function(d) { return d.dens; }), d3.max(data, function(d) { return d.dens; })])
      .range([10,40]);

    
    ///////////////////////////////

    var rect= function(b0, b1, x) {
      return b0 + b1 * x;
    };

    var state = {"year":"y13", "xdata":"dens", "arc":"closed", "entr":"False"};

    var coords = function(b0,b1) {
      var xdataScale = state.xdata == "pop" ? popScale : densScale;
      var x1 = d3.min(data, function(d) { return state.xdata == "pop" ? d.pop : d.dens; }),
          x2 = 11 * d3.max(data, function(d) { return state.xdata == "pop" ? d.pop : d.dens; }),
          y1 = rect(lr_log[state.xdata][state.year][b0],lr_log[state.xdata][state.year][b1],Math.log(x1)),
          y2 = rect(lr_log[state.xdata][state.year][b0],lr_log[state.xdata][state.year][b1],Math.log(x2));
      return {
        "x1":xdataScale(x1),
        "x2":xdataScale(x2),
        "y1":height - percScale(y1),
        "y2":height - percScale(y2)
      };
    };

    var arcObj = function() {
      var EndLine = coords("b0","db1a"),
          StartLine = coords("b0","db1b");
      var innerR = Math.sqrt(Math.pow(0,2) + Math.pow(0,2)),
          outerR = Math.sqrt(Math.pow(coordsLrLine.x2-coordsLrLine.x1,2) + Math.pow(coordsLrLine.y2-coordsLrLine.y1,2)),
          startA = Math.atan(Math.abs(StartLine.x2 - StartLine.x1)/Math.abs(StartLine.y2 - StartLine.y1)),
          endA = Math.atan(Math.abs(EndLine.x2 - EndLine.x1)/Math.abs(EndLine.y2 - EndLine.y1));
      return {"innerRadius":innerR, "outerRadius":outerR, "startAngle":startA, "endAngle":endA};
    };

    var tooltips = img.append("g");

    var circles = img.append("g")
        .attr("id","circles")
        .attr("transform","translate(0,-100)")
      .selectAll("circles")
        .data(data)
        .enter()
        .append("circle")
          .style("opacity","1")
          .style("fill", function() { return colors[Math.floor(Math.random() * colors.length)]; })
          .attr("class","data-circle")
          .attr("cx", function(d) { return densScale(d.dens); }) // start with dens
          .attr("cy", function(d) { return height - percScale(d[state.year].perc); })
          .attr("r", function(d) { return rDensScale(d.pop); })
          .on("click",function(d,i) {
            var xdataScale = state.xdata == "pop" ? popScale : densScale;
            var xtip = xdataScale(state.xdata == "pop" ? d.pop : d.dens),
                ytip = height - percScale(d[state.year]["perc"]),
                pperc = Math.round(d[state.year]["perc"] * 1000) / 10,
                xxdatatxt = state.xdata == "pop" ? "size: " : "density: ",
                xxdata = state.xdata == "pop" ? Math.round(d.pop) : Math.round(d.dens * 1000)/1000;
            var tip = tooltips.append("g")
              .attr("id","tip" + i)
              .datum(d)
              .attr("transform","translate(" + xtip + "," + ytip + ")")
              .on("click",function() {
                d3.select("#tip" + i).remove()
              });
            tip.append("circle")
              //.attr("d","M 0 0 L 20 0 L 20 10 L 12 10 L 10 16.93 L 8 10 L 0 10 Z")
              //.attr("transform","translate(" + xtip + "," + ytip + ")")
              .attr({"cx":0, "cy":0, "r":55})
              .style({"fill-opacity":"0.7", "stroke-opacity":"1", "stroke-width":"2px", "fill":"#f1f1f1"});
            tip.append("text")
              .text(d.comune)
              .attr({"x":0, "y":0, "dy":"-10"})
              .style({"font-size":"10px","text-anchor":"middle", "font-weight":"bold"});
            tip.append("text")
              .attr("class","tipxData")
              .text(function(d) {
                if (state.entr == "true") {
                  var part = partition(d);
                  return part[1];
                } else {
                  var xxdatatxt = state.xdata == "pop" ? "size: " : "density: ",
                      xxdata = state.xdata == "pop" ? Math.round(d.pop) : Math.round(d.dens * 1000)/1000;
                  return xxdatatxt +  xxdata;
                };
              })
              .attr({"x":0, "y":0, "dy":"0"})
              .style({"font-size":"10px","text-anchor":"middle"});
            tip.append("text")
              .attr("class","tipPerc")
              .text(function(d) {
                if (state.entr == "true") {
                  var part = partition(d);
                  return part[0];
                } else {
                  var pperc = Math.round(d[state.year]["perc"] * 1000) / 10;
                  return "turnout: " + pperc + "%"
                };
              })
              .attr({"x":0, "y":0, "dy":"10"})
              .style({"font-size":"10px","text-anchor":"middle"});
          });

    var maxpop = d3.max(data, function(d) { return Math.log(d.pop);}),
        minpop = d3.min(data, function(d) { return Math.log(d.pop);});
    /*circles.transition().duration(1500)
      .delay(function(d) { return 2000 * (maxpop/Math.log(d.pop) - 1); })
      //.delay(function(d,i) { return i * 7000/1206; })
      .style("opacity","1");*/

    var coordsLrLine = coords("b0","b1");

    var lrLine = img.append("line")
        .attr("transform","translate(0,-100)")
        .attr("x1",coordsLrLine.x1)
        .attr("y1",coordsLrLine.y1)
        .attr("x2",coordsLrLine.x2)
        .attr("y2",coordsLrLine.y2)
        .style("stroke-dasharray","3,3")
        .style("opacity","1")
        .attr("class","linreg");

    /*lrLine.transition().duration(500)
      .delay(function(d) { return 2000 * (maxpop/minpop - 2); })
      .style("opacity","1");*/

    /*d3.select("#text-container").transition().duration(500)
      .delay(function(d) { return 2000 * (maxpop/minpop - 1.5); })
      .style("opacity","1");

    d3.select("footer").transition().duration(500)
      .delay(function() { return 2000 * (maxpop/minpop - 1.5); })
      .style("opacity","1");*/

    /*var db0Line = img.append("line")
        .attr("transform","translate(0,-100)")
        .attr("x1",coordsLrLine.x1)
        .attr("y1",coordsLrLine.y1)
        .attr("x2",coordsLrLine.x2)
        .attr("y2",coordsLrLine.y2)
        .style("stroke-width","0")
        .attr("class","inter-line");

    var arcPath = function() {
        var ao = arcObj();
        var arc = d3.svg.arc()
          .innerRadius(ao.innerRadius)
          .outerRadius(ao.outerRadius * 1.1)
          .startAngle(function() { return state.arc == "closed" ? ao.startAngle + (ao.endAngle - ao.startAngle)/2 : ao.startAngle; })
          .endAngle(function() { return state.arc == "closed" ? ao.startAngle + (ao.endAngle - ao.startAngle)/2 : ao.endAngle; }); 
          //.startAngle(ao.startAngle)
          //.endAngle(ao.endAngle);
        return arc;
    };

    var inclArc = img.append("path")
        .attr("d", arcPath(state.arc))
        .attr("class","arc")
        .attr("transform","translate(0," + (-100+coordsLrLine.y1) + ")");*/

    var tooltips = img.append("g").attr("transform","translate(0,-100)");

    var partition = function(d) {

      var l, t;

      switch (state.year) {
        case "y06":
          l = d.y06.liste;
          //t = l.p + l.sb;
          t = d.y06.votanti - d.y06.nonvalide
          return ["Berlusconi " + Math.round(l.sb / t * 100) + "%", "Prodi " + Math.round(l.p / t * 100) + "%"];
        case "y08":
          l = d.y08.liste;
          //t = l.c + l.sb + l.v;
          t = d.y08.votanti - d.y08.nonvalide
          return ["Berl." + Math.round(l.sb / t * 100) + "% Casini " + Math.round(l.c / t * 100) + "%", "Veltroni " + Math.round(l.v / t * 100) + "%"];
        case "y13":
          l = d.y13.liste;
          //t = l.b + l.sb + l.m + l.g;
          t = d.y13.votanti - d.y13.nonvalide
          return ["Berl. " + Math.round(l.sb / t * 100) + "% Bers. " + Math.round(l.b / t * 100) + "%", "Grillo " + Math.round(l.g / t * 100) + "% Monti " + Math.round(l.m / t * 100) + "%"];
      }

    };

    var change = function(xdata, newYear) {

      state.xdata = xdata;
      state.year = newYear;
      coordsLrLine = coords("b0","b1");

      d3.select("#txtData")
        .text(function() { return xdata == "pop" ? "size (log)" : "density (log)"; });
      d3.select("#txtElect")
        .text(function() { return electionsDates[state.year]; });

      circles.transition().duration(2000)
        .attr("cx", function(d) {
          var xdataScale = xdata == "pop" ? popScale : densScale;
          var value = xdata == "pop" ? d.pop : d.dens;
          return xdataScale(value); 
        })
        .attr("cy", function(d) { return height - percScale(d[state.year]["perc"]); })
        .attr("r", function(d) {
          var value = xdata == "pop" ? d.dens : d.pop;
          var rdataScale = xdata == "pop" ? rPopScale : rDensScale;
          //return rdataScale(value);
          return rDensScale(d.pop);
        })
        .style("fill", function(d) {
          if (state.entr == "true") {
            var entrScale;
            switch (state.year) {
              case "y13":
                entrScale = entrScale13;
                break;
              case "y08":
                entrScale = entrScale08;
                break;
              case "y06":
                entrScale = entrScale06;
            }
            return entrScale(d[state.year]["entropia"]);
          } else {
            return d; //leave elements as-is
          };
        });

      tooltips.selectAll("g").transition().duration(2000)
        .attr("transform", function(d) {
          var xdataScale = state.xdata == "pop" ? popScale : densScale;
          var xtip = xdataScale(state.xdata == "pop" ? d.pop : d.dens),
              ytip = height - percScale(d[state.year]["perc"]);
          return  "translate(" + xtip + "," + ytip + ")";
        });

      tooltips.selectAll(".tipPerc")
        .text(function(d) {
          if (state.entr == "true") {
            var part = partition(d);
            return part[0];
          } else {
            var pperc = Math.round(d[state.year]["perc"] * 1000) / 10;
            return "turnout: " + pperc + "%"
          };
        });

      tooltips.selectAll(".tipxData")
        .text(function(d) {
          if (state.entr == "true") {
            var part = partition(d);
            return part[1];
          } else {
            var xxdatatxt = state.xdata == "pop" ? "size: " : "density: ",
                xxdata = state.xdata == "pop" ? Math.round(d.pop) : Math.round(d.dens * 1000)/1000;
            return xxdatatxt +  xxdata;
          };
        });


      
      lrLine.transition().duration(2000)
        .attr("x1",coordsLrLine.x1)
        .attr("y1",coordsLrLine.y1)
        .attr("x2",coordsLrLine.x2)
        .attr("y2",coordsLrLine.y2);

      /*var db0s = db0Line.style("stroke-width");
      var db0a = lr_log[state.xdata][state.year]['db0a'],
          db0b = lr_log[state.xdata][state.year]['db0b'];
      db0Line.transition().duration(2000)
        .attr("x1",coordsLrLine.x1)
        .attr("y1",coordsLrLine.y1)
        .attr("x2",coordsLrLine.x2)
        .attr("y2",coordsLrLine.y2)
        .style("stroke-width",function() {
          return db0s == "0px" || db0s == "0" ? 0 : percScale(db0b)-percScale(db0a);
        });

      inclArc.transition().duration(2000)
        .attr("d", arcPath())
        .attr("transform","translate(0," + (-100+coordsLrLine.y1) + ")");
      */

    };

    /*
    var changeYear = function(newYear) {

      state.year = newYear;
      coordsLrLine = coords("b0","b1");

      d3.select("#txtElect")
        .text(function() { return electionsDates[state.year]; });

      circles.transition().duration(2000)
        .attr("cy", function(d) { return height - percScale(d[state.year]["perc"]); });
      
      lrLine.transition().duration(2000)
        .attr("y1",coordsLrLine.y1)
        .attr("y2",coordsLrLine.y2);

      var db0s = db0Line.style("stroke-width");
      var db0a = lr_log[state.xdata][state.year]['db0a'],
          db0b = lr_log[state.xdata][state.year]['db0b'];
      db0Line.transition().duration(2000)
        .attr("y1",coordsLrLine.y1)
        .attr("y2",coordsLrLine.y2)
        .style("stroke-width",function() {
          return db0s == "0px" || db0s == "0" ? 0 : percScale(db0b)-percScale(db0a);
        });

      inclArc.transition().duration(2000)
        .attr("d", arcPath())
        .attr("transform","translate(0," + coordsLrLine.y1 + ")");
    };

    var changeData = function(xdata) {

      state.xdata = xdata;
      coordsLrLine = coords("b0","b1");

      d3.select("#txtData")
        .text(function() { return xdata == "pop" ? "size (log)" : "density (log)"; });

      circles.transition().duration(2000)
        .attr("cx", function(d) {
          var xdataScale = xdata == "pop" ? popScale : densScale;
          var value = xdata == "pop" ? d.pop : d.dens;
          return xdataScale(value); 
        })
        .attr("r", function(d) {
          var value = xdata == "pop" ? d.dens : d.pop;
          var rdataScale = xdata == "pop" ? rPopScale : rDensScale;
          //return rdataScale(value);
          return rDensScale(d.pop);
        });

      lrLine.transition().duration(2000)
        .attr("x1",coordsLrLine.x1)
        .attr("y1",coordsLrLine.y1)
        .attr("x2",coordsLrLine.x2)
        .attr("y2",coordsLrLine.y2);

      var db0s = db0Line.style("stroke-width");
      var db0a = lr_log[state.xdata][state.year]['db0a'],
          db0b = lr_log[state.xdata][state.year]['db0b'];
      db0Line.transition().duration(2000)
        .attr("x1",coordsLrLine.x1)
        .attr("y1",coordsLrLine.y1)
        .attr("x2",coordsLrLine.x2)
        .attr("y2",coordsLrLine.y2)
        .style("stroke-width",function() {
          return db0s == "0px" || db0s == "0" ? 0 : percScale(db0b)-percScale(db0a);
        });

      inclArc.transition().duration(2000)
        .attr("d", arcPath())
        .attr("transform","translate(0," + coordsLrLine.y1 + ")");

    };
    */

    /*
    var clickShowdb0 = function(){
      console.log(db0Line.style("stroke-width"));
      if (db0Line.style("stroke-width") == "0px" || db0Line.style("stroke-width") == "0") {
        var db0a = lr_log[state.xdata][state.year]['db0a'],
            db0b = lr_log[state.xdata][state.year]['db0b'];

        db0Line.transition().duration(1200).style("stroke-width",function() { return percScale(db0b)-percScale(db0a); });
      } else {
        db0Line.transition().duration(1200).style("stroke-width",0);
      };
    };

    var clickShowArc = function() {
      if (state.arc == "closed") {
        state.arc = "open";
      } else {
        state.arc = "closed";
      };
      inclArc.transition().duration(1200)
        .attr("d", arcPath())
        .attr("transform","translate(0," + (-100+coordsLrLine.y1) + ")");      
    };
    */


    var clickShowEntr = function() {

      if (state.entr == "true") {

        
        circles.transition().duration(1200)
          .style("fill", function() { return colors[Math.floor(Math.random() * colors.length)]; });

        tooltips.selectAll(".tipPerc")
          .text(function(d) {
            var pperc = Math.round(d[state.year]["perc"] * 1000) / 10;
            return "turnout: " + pperc + "%";
          });

        tooltips.selectAll(".tipxData")
          .text(function(d) {
            var xxdatatxt = state.xdata == "pop" ? "size: " : "density: ",
                xxdata = state.xdata == "pop" ? Math.round(d.pop) : Math.round(d.dens * 1000)/1000;
            return xxdatatxt +  xxdata;
          });

        state.entr = "false";

      } else {

        tooltips.selectAll(".tipPerc")
          .text(function(d) {
              var part = partition(d);
              return part[0];
          });

        tooltips.selectAll(".tipxData")
          .text(function(d) {
              var part = partition(d);
              return part[1];
          });

        state.entr = "true";
        showEntr();

      };

    };

    var showEntr = function() {

      if (state.entr == "true") {
        
        var entrScale;

        switch (state.year) {
          case "y13":
            entrScale = entrScale13;
            break;
          case "y08":
            entrScale = entrScale08;
            break;
          case "y06":
            entrScale = entrScale06;
        }
          
        circles.transition().duration(1200)
          .style("fill",function(d) { return entrScale(d[state.year]["entropia"]); });

      };
    };

    // texts    

    /*d3.select("#y13").on("click",function() {
      d3.select(".on-year").classed("on-year",0);
      d3.select(this).classed("on-year",1);
      changeYear("y13");
    });
    d3.select("#y08").on("click",function() {
      d3.select(".on-year").classed("on-year",0);
      d3.select(this).classed("on-year",1);
      changeYear("y08");
    });
    d3.select("#y06").on("click",function() {
      d3.select(".on-year").classed("on-year",0);
      d3.select(this).classed("on-year",1);
      changeYear("y06");
    });

    d3.select("#dens").on("click",function() {
      d3.select(".on-data").classed("on-data",0);
      d3.select(this).classed("on-data",1);
      changeData("dens");
    });
    
    d3.select("#pop").on("click",function() {
      d3.select(".on-data").classed("on-data",0);
      d3.select(this).classed("on-data",1);
      changeData("pop");
    });

    d3.select("#inter").on("click", function() {
      var item = d3.select(this);
      item.classed("on-conf") == 1 ? item.classed("on-conf",0) : item.classed("on-conf",1);
      clickShowdb0();
    });

    d3.select("#incl").on("click", function() {
      var item = d3.select(this);
      item.classed("on-conf") == 1 ? item.classed("on-conf",0) : item.classed("on-conf",1);
      clickShowArc();
    });
    */


    // Legend
    

    var legend = img.append("g")
      .style({"fill":"#616161", "opacity":"1"})
      //.attr("transform","translate(70,90)");
      .attr("transform","translate(120,350)");
    
    
    var entrop = legend.append("g")
      .attr("transform","translate(295,55) scale(1.3)");
    var entropCircles = entrop.append("g")
        .attr("transform","translate(90,-10)");
    entropCircles.append("circle")
      .attr({"cx":"0", "cy":"48", "r":"7"})
      .style({"fill":"#626262", "opacity":"0.9"});
    entropCircles.append("circle")
      .attr({"cx":"0", "cy":"32", "r":"7"})
      .style({"fill":"#626262", "opacity":"0.6"});
    entropCircles.append("circle")
      .attr({"cx":"0", "cy":"16", "r":"7"})
      .style({"fill":"#626262", "opacity":"0.4"});
    entropCircles.append("circle")
      .attr({"cx":"0", "cy":"0", "r":"7"})
      .style({"fill":"#626262", "opacity":"0.1"});
    entrop.append("text")
      .text("Voter")
      .style({"font-size":"9px", "text-anchor":"start"})
      .attr({"x":"30", "y":"10"});
    entrop.append("text")
      .text("Uncertainty")
      .style({"font-size":"9px", "text-anchor":"start"})
      .attr({"x":"30", "y":"20"});
    entrop.append("path")
      .style({"fill-opacity":"0.5", "stroke-opacity":"1", "stroke-width":"1px", "fill":"url(#diagonalHatchCase1)"})
      .attr("transform","translate(-44,-15)")
      .attr("d","M 60 22 L 70 22 L 70 32 L 60 32 Z");
    entrop.append("path")
      .style({"fill-opacity":"0", "stroke-opacity":"1", "stroke-width":"1px", "fill":"#D8A800"})
      .attr("d","M 60 22 L 70 22 L 70 32 L 60 32 Z")
      .attr("transform","translate(-44,-15)")
      .on("click", function () {
        var item = d3.select(this);
        item.style("fill-opacity") > 0.4 ? item.style("fill-opacity","0") : item.style("fill-opacity","0.5");
        clickShowEntr();
      });

    
    var entrScale13 = d3.scale.linear()
      .domain([1.359,1.509]) // mean +/- std
      .range(["#000", "#bbb"]);

    var entrScale08 = d3.scale.linear()
      .domain([1.116,1.374]) // mean +/- std
      .range(["#000", "#bbb"])

    var entrScale06 = d3.scale.linear()
      .domain([0.634,0.703]) // mean +/- std
      .range(["#000", "#bbb"])
    


    // parties
    /*
    var parties = legend.append("g")
      .attr("transform","translate(610,0)");

    var pColors = {"sb":"#00698c", "g":"#8c6900", "b":"#8c0024", "v":"#8c0024", "p":"#8c0024", "m":"#323232", "c":"#323232"};
    //var pColors = {"sb":"#008dc8", "g":"#c89600", "b":"#c80025", "v":"#3c2828", "p":"#3c2828", "m":"#323232", "c":"#323232"};
    //var pColors = {"sb":"#00a9ff", "g":"#ffc400", "b":"#ff0025", "v":"#3c2828", "p":"#3c2828", "m":"#323232", "c":"#323232"};
    //var pColors = {"sb":"#2a283c", "g":"#3c3c28", "b":"#3c2828", "v":"#3c2828", "p":"#3c2828", "m":"#323232", "c":"#323232"};
    //var pColors = {"sb":"#323232", "g":"#40bf7f", "b":"#c1c1c1", "v":"#fff", "p":"#fff", "m":"#fff", "c":"#fff"};

    parties.append("circle")
      .attr({"cx":"0", "cy":"0", "r":"7"})
      .on("click",function() {
        circles.transition()
          .style("fill",function(d) { return pColors[d[state.year]["liste"]["w"]]; });
      });
    */


    var buttons = legend.append("g")
      .attr("transform","translate(200,80) rotate(-45) scale(1.3)");
    buttons.append("path")
      .attr("transform","translate(0,0)")
      .attr("d","M 7 10 L 13 10 M 10 7 L 10 13")
      .style({"stroke-width":"1px", "stroke":"#626262"});
    buttons.append("path")
      .attr("transform","translate(20,0)")
      .attr("d","M 7 10 L 13 10 M 10 7 L 10 13")
      .style({"stroke-width":"1px", "stroke":"#626262"});
    buttons.append("path")
      .attr("transform","translate(40,0)")
      .attr("d","M 7 10 L 13 10 M 10 7 L 10 13")
      .style({"stroke-width":"1px", "stroke":"#626262"});
    buttons.append("path")
      .attr("transform","translate(0,20)")
      .attr("d","M 7 10 L 13 10 M 10 7 L 10 13")
      .style({"stroke-width":"1px", "stroke":"#626262"});
    buttons.append("path")
      .attr("transform","translate(20,20)")
      .attr("d","M 7 10 L 13 10 M 10 7 L 10 13")
      .style({"stroke-width":"1px", "stroke":"#626262"});
    buttons.append("path")
      .attr("transform","translate(40,20)")
      .attr("d","M 7 10 L 13 10 M 10 7 L 10 13")
      .style({"stroke-width":"1px", "stroke":"#626262"});
    buttons.append("text")
      .text(electionsDates["y06"])
      .attr("transform","rotate(90) translate(0,0)")
      .style({"font-size":"9px", "text-anchor":"end"})
      .attr({"x":"0", "y":"-7"});
    buttons.append("text")
      .text(electionsDates["y08"])
      .attr("transform","rotate(90) translate(0,-20)")
      .style({"font-size":"9px", "text-anchor":"end"})
      .attr({"x":"0", "y":"-7"});
    buttons.append("text")
      .text(electionsDates["y13"])
      .attr("transform","rotate(90) translate(0,-40)")
      .style({"font-size":"9px", "text-anchor":"end"})
      .attr({"x":"0", "y":"-7"});
    buttons.append("text")
      .text("population density")
      .attr("transform","rotate(0) translate(0,0)")
      .style({"font-size":"9px", "text-anchor":"end"})
      .attr({"x":"0", "y":"12"});
    buttons.append("text")
      .text("population size")
      .attr("transform","rotate(0) translate(0,20)")
      .style({"font-size":"9px", "text-anchor":"end"})
      .attr({"x":"0", "y":"12"});
    buttons.append("circle")
      .attr("id","mark")
      .attr("transform","translate(0,0)")
      .attr({"cx":"10", "cy":"10", "r":"7"})
      .style({"fill":"#626262", "opacity":"0.1"})
      .on("click",function() {
        var itemOn = d3.select(".on");
        var item = d3.select(this);
        itemOn.transition().style({"fill":"#626262", "opacity":"0.1"});
        itemOn.classed("on",0);
        item.transition().style({"fill":"#D8A800", "opacity":"0.4"});
        item.classed("on",1);
        change("dens","y06");
      });
    buttons.append("circle")
      .attr("id","mark")
      .attr("transform","translate(20,0)")
      .attr({"cx":"10", "cy":"10", "r":"7"})
      .style({"fill":"#626262", "opacity":"0.1"})
      .on("click",function() {
        var itemOn = d3.select(".on");
        var item = d3.select(this);
        itemOn.transition().style({"fill":"#626262", "opacity":"0.1"});
        itemOn.classed("on",0);
        item.transition().style({"fill":"#D8A800", "opacity":"0.4"});
        item.classed("on",1);
        change("dens","y08");
      });
    buttons.append("circle")
      .attr("id","mark")
      .attr("class","on")
      .attr("transform","translate(40,0)")
      .attr({"cx":"10", "cy":"10", "r":"7"})
      .style({"fill":"#D8A800", "opacity":"0.4"})
      .on("click",function() {
        var itemOn = d3.select(".on");
        var item = d3.select(this);
        itemOn.transition().style({"fill":"#626262", "opacity":"0.1"});
        itemOn.classed("on",0);
        item.transition().style({"fill":"#D8A800", "opacity":"0.4"});
        item.classed("on",1);
        change("dens","y13");
      });
    buttons.append("circle")
      .attr("id","mark")
      .attr("transform","translate(0,20)")
      .attr({"cx":"10", "cy":"10", "r":"7"})
      .style({"fill":"#626262", "opacity":"0.1"})
      .on("click",function() {
        var itemOn = d3.select(".on");
        var item = d3.select(this);
        itemOn.transition().style({"fill":"#626262", "opacity":"0.1"});
        itemOn.classed("on",0);
        item.transition().style({"fill":"#D8A800", "opacity":"0.4"});
        item.classed("on",1);
        change("pop","y06");
      });
    buttons.append("circle")
      .attr("id","mark")
      .attr("transform","translate(20,20)")
      .attr({"cx":"10", "cy":"10", "r":"7"})
      .style({"fill":"#626262", "opacity":"0.1"})
      .on("click",function() {
        var itemOn = d3.select(".on");
        var item = d3.select(this);
        itemOn.transition().style({"fill":"#626262", "opacity":"0.1"});
        itemOn.classed("on",0);
        item.transition().style({"fill":"#D8A800", "opacity":"0.4"});
        item.classed("on",1);
        change("pop","y08");
      });
    buttons.append("circle")
      .attr("id","mark")
      .attr("transform","translate(40,20)")
      .attr({"cx":"10", "cy":"10", "r":"7"})
      .style({"fill":"#626262", "opacity":"0.1"})
      .on("click",function() {
        var itemOn = d3.select(".on");
        var item = d3.select(this);
        itemOn.transition().style({"fill":"#626262", "opacity":"0.1"});
        itemOn.classed("on",0);
        item.transition().style({"fill":"#D8A800", "opacity":"0.4"});
        item.classed("on",1);
        change("pop","y13");
      });




    /*
    var bubble = legend.append("g")
      .attr("transform","translate(145,-75)");
    bubble.append("circle")
      .style({"fill-opacity":"1", "stroke-opacity":"1", "stroke-width":"1px", "fill":"#e1e1e1"})
      .attr({"cx":"20", "cy":"100", "r":"20"});
    bubble.append("circle")
      .style({"fill-opacity":"1", "stroke-opacity":"1", "stroke-width":"1px", "fill":"url(#diagonalHatchCase1)"})
      .attr({"cx":"20", "cy":"100", "r":"20"});
    bubble.append("text")
      .text("population")
      .style({"font-size":"9px"})
      .attr({"x":"45", "y":"100", "dy":"0"});
    bubble.append("text")
      .text("size (log)")
      .style({"font-size":"9px"})
      .attr({"x":"45", "y":"100", "dy":"10"});

    
    var axes = legend.append("g");
    axes.append("circle")
      .style("fill","#626262")
      .attr({"cx":"0", "cy":"50", "r":"2"});
    axes.append("line")
      .style({"stroke-width":"1px", "stroke":"#626262"})
      .attr({"x1":"0", "x2":"0", "y1":"50", "y2":"0"});
    axes.append("line")
      .style({"stroke-width":"1px", "stroke":"#626262"})
      .attr({"x1":"0", "x2":"50", "y1":"50", "y2":"50"});
    axes.append("path")
      .attr("d","M -3 0 L 3 0 L 0 -5.2 Z");
    axes.append("path")
      .attr("d","M 50 47 L 50 53 L 55.2 50 Z");
    axes.append("circle")
      .attr({"cx":"15", "cy":"30", "r":"4"})
      .style("fill","#626262");
    axes.append("circle")
      .attr({"cx":"35", "cy":"20", "r":"7"})
      .style({"fill":"#626262",});
    axes.append("line")
      .style({"stroke-width":"1px", "stroke":"#626262", "stroke-dasharray":"2,2"})
      .attr({"x1":"15", "x2":"15", "y1":"30", "y2":"50"});
    axes.append("line")
      .style({"stroke-width":"1px", "stroke":"#626262", "stroke-dasharray":"2,2"})
      .attr({"x1":"15", "x2":"0", "y1":"30", "y2":"30"});
    axes.append("line")
      .style({"stroke-width":"1px", "stroke":"#626262", "stroke-dasharray":"2,2"})
      .attr({"x1":"35", "x2":"35", "y1":"20", "y2":"50"});
    axes.append("line")
      .style({"stroke-width":"1px", "stroke":"#626262", "stroke-dasharray":"2,2"})
      .attr({"x1":"35", "x2":"0", "y1":"20", "y2":"20"});
    axes.append("text")
      .text("population")
      .style({"font-size":"9px"})
      .attr({"x":"60", "y":"50"});
    axes.append("text")
      .attr("id","txtData")
      .text("density (log)")
      .style({"font-size":"9px"})
      .attr({"x":"60", "y":"50", "dy":"10"});
    axes.append("text")
      .text("voter turnout")
      .style({"font-size":"9px", "text-anchor":"middle"})
      .attr({"x":"0", "y":"-29"});
    axes.append("text")
      .text("general elections")
      .style({"font-size":"9px","text-anchor":"middle"})
      .attr({"x":"0", "y":"-29", "dy":"10"});
    axes.append("text")
      .text("24th February 13")
      .style({"font-size":"9px","text-anchor":"middle"})
      .attr("id","txtElect")
      .attr({"x":"0", "y":"-29", "dy":"20"});
    */

    /*
    var lrLeg = legend.append("g")
      //.attr("transform","translate(0,140)");
      //.attr("transform","translate(280,0)");
      .attr("transform","translate(200,250) scale(1.3)");
    lrLeg.append("circle")
      .attr({"cx":"35", "cy":"20", "r":"7"})
      .style({"fill":"#626262"});
    lrLeg.append("circle")
      .attr({"cx":"15", "cy":"30", "r":"4"})
      .style("fill","#626262");
    lrLeg.append("line")
      .attr({"x1":"0", "y1":"35", "x2":"55", "y2":"13"})
      .style({"stroke-width":"5px", "stroke":"#626262", "stroke-opacity":"0.3"});
    lrLeg.append("line")
      .attr({"x1":"0", "y1":"35", "x2":"55", "y2":"13"})
      .style({"stroke-width":"1px", "stroke":"#626262", "stroke-dasharray":"2,2"});
    lrLeg.append("text")
      .text("Linear Regression")
      .style({"font-size":"9px"})
      .attr({"x":"60", "y":"10", "dy":"0"});
    lrLeg.append("text")
      .text("95% confidence intervals")
      .style({"font-size":"9px"})
      .attr({"x":"60", "y":"10", "dy":"10"});
    lrLeg.append("path")
      .style({"fill-opacity":"0.5", "stroke-opacity":"1", "stroke-width":"1px", "fill":"url(#diagonalHatchCase1)"})
      .attr("d","M 60 22 L 70 22 L 70 32 L 60 32 Z");
    lrLeg.append("path")
      .style({"fill-opacity":"0", "stroke-opacity":"1", "stroke-width":"1px", "fill":"#D8A800"})
      .attr("d","M 60 22 L 70 22 L 70 32 L 60 32 Z")
      .attr("id","inclConf")
      .on("click", function() {
        var item = d3.select(this);
        item.style("fill-opacity") > 0.4 ? item.style("fill-opacity","0") : item.style("fill-opacity","0.5");
        clickShowArc();
      });
    lrLeg.append("text")
      .text("on slope")
      .style({"font-size":"9px"})
      .attr({"x":"72", "y":"20", "dy":"10"});
    lrLeg.append("path")
      .style({"fill-opacity":"0.5", "stroke-opacity":"1", "stroke-width":"1px", "fill":"url(#diagonalHatchCase1)"})
      .attr({"transform":"translate(0,12)"})
      .attr("d","M 60 22 L 70 22 L 70 32 L 60 32 Z");
    lrLeg.append("path")
      .style({"fill-opacity":"0", "stroke-opacity":"1", "stroke-width":"1px", "fill":"#D8A800"})
      .attr({"transform":"translate(0,12)"})
      .attr("d","M 60 22 L 70 22 L 70 32 L 60 32 Z")
      .on("click", function() {
        var item = d3.select(this);
        item.style("fill-opacity") > 0.4 ? item.style("fill-opacity","0") : item.style("fill-opacity","0.5");
       clickShowdb0();
      });
    lrLeg.append("text")
      .text("on y-intercept")
      .style({"font-size":"9px"})
      .attr({"x":"72", "y":"20", "dy":"20"});
    */




    /*lrLeg.append("line")
      .style({"stroke-width":"1px", "stroke":"#626262"})
      .attr({"x1":"0", "x2":"0", "y1":"50", "y2":"0"});
    lrLeg.append("line")
      .style({"stroke-width":"1px", "stroke":"#626262"})
      .attr({"x1":"0", "x2":"50", "y1":"50", "y2":"50"});
    lrLeg.append("path")
      .attr("d","M -3 0 L 3 0 L 0 -5.2 Z");
    lrLeg.append("path")
      .attr("d","M 50 47 L 50 53 L 55.2 50 Z");
    lrLeg.append("circle")
      .style("fill","#626262")
      .attr({"cx":"0", "cy":"50", "r":"2"});
    */

    /*d3.select("h1").transition().duration(500)
      .delay(function() { return 2000 * (maxpop/minpop - 2); })
      .style("opacity","1");*/
    
    /*legend.transition().duration(0)
      .delay(function() { return 0 * (maxpop/minpop - 1.75); })
      .style("opacity","1");*/
    

    /*
    var xlabels = legend.append("g");
    xlabels.append("path")
        .attr("d","M 0 0 L 80 0 L 90 8 L 80 16 L 0 16 Z ")
        .attr("class","label");
    xlabels.append("circle")
        .attr({"cx":"98", "cy":"8", "r":"8"})
        //.attr("id","y13")
        .attr("class","label-circle")
        .on("click",function() {
          console.log("go");
          //d3.select(".on-year").classed("on-year",0);
          //d3.select(this).classed("on-year",1);
          changeYear("y13");
        });
      */

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
  resize("chartCase1");

})();