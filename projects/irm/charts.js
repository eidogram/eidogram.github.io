(function () {

  // DETECT BROWSER

  var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
      // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
  var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
  var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
      // At least Safari 3+: "[object HTMLElementConstructor]"
  var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
  var isIE = /*@cc_on!@*/false || !!document.documentMode;   // At least IE6

  var okCrisp = function() {
    return isSafari ? null : "crispEdges";
  };


  // HELPER FUNCTIONS //////////////////////////////////////////////////

  Array.prototype.unique = function() {
    var key, output, value, _i, _ref, _results;
    output = {};
    for (key = _i = 0, _ref = this.length; 0 <= _ref ? _i < _ref : _i > _ref; key = 0 <= _ref ? ++_i : --_i) {
      output[this[key]] = this[key];
    }
    _results = [];
    for (key in output) {
      value = output[key];
      _results.push(value);
    }
    return _results;
  };

  var filterProjects,
      fix,
      fixParteners,
      getPartners,
      getThemes,
      getYears,
      fixData,
      __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fix = function(s) {
    var i;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = s.split("\"");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(i.replace(/^\s+|\s+$/g, "").toLowerCase());
      }
      return _results;
    })()).filter(function(j) {
      return j !== '';
    }).unique();
  };

  fixElement = function(o) {
    o.partners = fix(o.partners);
    //o.project = o.project.replace("/"," ");
    return o;
  };

  var format =  d3.time.format("%d/%m/%Y");

  fixData = function(data) {
    var k, v, _ref, _results;
    _ref = data.progetti;
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      if (v["progetto"]["Start Date"].length === 10) {
        _results.push(fixElement(v.progetto));
      }
    }
    return _results.sort(function(a, b) {
      return format.parse(a["Start Date"]) - format.parse(b["Start Date"])
    });
  };

  getYears = function(data) {
    var k, o, obj, v, year, _i, _len, _results;
    o = {};
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      obj = data[_i];
      year = obj["Start Date"].slice(6);
      if (o[year]) {
        o[year] += 1;
      } else {
        o[year] = 1;
      }
    }
    _results = [];
    for (k in o) {
      v = o[k];
      _results.push({
        "year": k,
        "value": v
      });
    }
    return _results;
  };

  getPartners = function(data) {
    var k, o, obj, partner, res, v, _i, _j, _len, _len1, _ref;
    o = {};
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      obj = data[_i];
      _ref = obj.partners;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        partner = _ref[_j];
        if (partner.toLowerCase() != obj["Organization Name"].toLowerCase()) {
          if (o[partner.toLowerCase()]) {
            o[partner.toLowerCase()] += 1;
          } else {
            o[partner.toLowerCase()] = 1;
          }
        }
      }
    }
    return res = ((function() {
      var _results;
      _results = [];
      for (k in o) {
        v = o[k];
        _results.push({
          "partner": k,
          "value": v
        });
      }
      return _results;
    })()).sort(function(a, b) {
      return b.value - a.value;
    });
  };

  getThemes = function(data) {
    var k, o, obj, res, theme, v, _i, _len;
    o = {};
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      obj = data[_i];
      theme = obj["PGA"].slice(4);
      if (o[theme]) {
        o[theme] += 1;
      } else {
        o[theme] = 1;
      }
    }
    return res = ((function() {
      var _results;
      _results = [];
      for (k in o) {
        v = o[k];
        _results.push({
          "theme": k,
          "value": v
        });
      }
      return _results;
    })()).sort(function(a, b) {
      return b.value - a.value;
    });
  };

  filterProjects = function(data, k) {
    return data.filter(function(p) {
      var theme, year, _ref;
      year = p["Start Date"].slice(6);
      theme = p["PGA"].slice(4);
      return (k.year ? k.year === year : 1) && (k.theme ? k.theme === theme : 1) && (k.partner ? (_ref = k.partner, __indexOf.call(p.partners, _ref) >= 0) : 1);
    });
  };
  
  var wwidth = (window.innerWidth > 0) ? window.innerWidth-10 : screen.width-10;
  wwidth = wwidth > 540 ? 540 : wwidth

  // Session variable storing the selections
  sel = {}

  // box 0

  var h10 = d3.select("#box0").append("h1")
      .attr("class","title-list-projs");

  var h20 = d3.select("#box0").append("h2")
      .attr("class","subtitle-list-projs");

  var div0 = d3.select("#box0").append("div")
      .attr("class","projects-info");
  
  /*d3.select("#box0").append("div")
      .attr("id","gradient");*/

  // CHARTS ////////////////////////////////////////////////////////////
  
  var margin = {top: 30, right: 30, bottom: 30, left: 30},
      width = wwidth - margin.left - margin.right,
      height = 540 - margin.top - margin.bottom;
  
  // box 1
  
  var svg1 = d3.select("#box1").append("svg")
      .attr("id","box1SVG")
      .attr("viewBox", "0 0 " + wwidth + " 300")           // make it
      .attr("preserveAspectRatio", "xMidYMid")  // responsive
      .attr("width", width + margin.left + margin.right)
      .attr("height", 300 + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," +
        (margin.top + 40) + ")");
  
  // var line = function(L,m) {
  //   var m, x0, x1, y0, y1, a;
  //   x0 = getRandomInt(0, L);
  //   y0 = getRandomInt(0, L);
  //   a = getRandomInt(0, 360);
  //   x1 = m * Math.sin(a);
  //   y1 = m * Math.cos(a);
  //   return "M" + x0 + "," + y0 + "l" + x1 + "," + y1;
  // };
  
  // var pattern = function(n, L, m) {
  //   var i;
  //   return ((function() {
  //     var _i, _results;
  //     _results = [];
  //     for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
  //       _results.push(line(L,m));
  //     }
  //     return _results;
  //   })()).join('');
  // };

  // svg1
  //   .append('defs')
  //   .append('pattern')
  //     .attr('id', 'diagonalHatchCase4')
  //     .attr('patternUnits', 'userSpaceOnUse')
  //     .attr('width', 100)
  //     .attr('height', 100)
  //   .append('path')
  //     .attr('d',pattern(3000,100,1))
  //     // .attr('d', 'M0,4l4,-4')
  //     .attr('stroke', '#000')
  //     //.attr('stroke', 'rgb(83, 83, 83)')
  //     .attr('stroke-width', 1);
  
  var c1 = {};
  var g1 = svg1.append("g")
      .attr("transform", "translate(0,0)");
  
  // back bars
  c1.bb = g1.append("g");
  
  c1.xScale = d3.scale.ordinal()
        .domain(["2006","2007","2008","2009","2010",
          "2011","2012","2013","2014"])
        .rangeRoundBands([0, width],0,0);

  c1.yScale = d3.scale.linear()
        .range([height / 3, 0]);
  
  c1.line = d3.svg.line();
        
  c1.xAxis = d3.svg.axis()
      .orient("bottom")
      .scale(c1.xScale)
      .tickSize(6, 0);
  
  c1.axis = g1.append("g")
          .attr("transform", "translate(0," + c1.yScale.range()[0] + ")")
          .attr("class", "x axis");
    
  c1.path = g1.append("path")
      .attr("transform","translate(1,0)")
      /*.style("fill","url(#diagonalHatchCase4)")*/
      .attr("class","line")
      .style("shape-rendering", okCrisp());
  
  c1.bars = g1.append("g");
      //.attr("transform", "translate(-3,0)");
  
  c1.dataLine = function(data, x, y) {
    var h, new_data, s;
    s = x.range()[1] - x.range()[0];
    h = y.range()[0];
    new_data = data.reduce(function(dd, d, i) {
      return dd.concat([[i * s, y(d.value)], [(i + 1) * s, y(d.value)]]);
    }, [[0, h]]);
    return new_data.concat([[(new_data.length - 1)/2 * s, h]]);
  };
  
  c1.title = g1.append("g")
      .attr("class","title")
      .attr("transform","translate(0,0)");
  
  c1.title
    .append("line")
      .attr("class","main-line")
      .style("shape-rendering", okCrisp())
      .attr({ "x1": 0, "y1": -35, "x2": width, "y2": -35 });
  
  c1.title
    .append("text")
    .text("Projects started")
    .attr({ "x": 0, "y": -45 })

  c1.title.append("rect")
    .attr({
      "x": 0,
      "y": -25,
      "height": 3,
      "width": 25  
    })
    .style({
      //"fill": "transparent",
      "opacity": 0,
      "stroke": "#828282",
      "stroke-width": "1px",
      "shape-rendering": "crispEdges"
    });

  c1.title.append("text")
    .text("Total")
    .attr({ "x": 28, "y": -20 })
    .attr("class","legend");

  c1.title.append("rect")
    .attr({
      "x": 70,
      "y": -28,
      "height": 10,
      "width": 81 
    })
    .style({
      "fill": "gold",
      "stroke": "none",
      "shape-rendering": "crispEdges"
    });

  c1.title.append("rect")
    .attr({
      "x": 70,
      "y": -25,
      "height": 3,
      "width": 25  
    })
    .style({
      "fill": "#828282",
      "stroke": "none",
      "shape-rendering": "crispEdges"
    });

  c1.title.append("text")
    .text("Selection")
    .attr({ "x": 98, "y": -20 })
    .attr("class","legend"); 
  
  c1.legend = g1.append("g")
      .attr("class","legend")
      .attr("transform","translate(0,-80)");
  
  c1.legend
    .append("line")
      .attr("class","main-line")
      .style("shape-rendering", okCrisp())
      .attr({ "x1": 0, "y1": height/2 + 25, 
        "x2": width, "y2": height/2 + 25 });
  
  c1.legend
    .append("line")
      .attr("class","sub-line")
      .style("shape-rendering", okCrisp())
      .attr({ "x1": 0, "y1": height/2 + 50,
        "x2": width, "y2": height/2 + 50 });

  /*c1.legend
    .append("rect")
      .attr("class","rects")
      .attr({ "x": 0, "y": height/2 + 50,
        "width": width, "height": 30 });*/
  
  /*c1.legend
    .append("text")
    .text("Year")
    .attr({ "x": -50, "y": height/2 + 15 })

  c1.legend
    .append("text")
    .text("Total")
    .style("font-weight", "bold")
    .attr({ "x": -50, "y": height/2 + 42 })

  c1.legend
    .append("text")
    .text("Selection")
    .attr({ "x": -50, "y": height/2 + 69 })*/
 
  // front bars
  c1.fb = g1.append("g");
  
  
  // box 2 /////////////////////////////////////////////////////////////
  
  var hheight = Math.floor(wwidth * 1.07);
  hheight = hheight < 540 ? hheight : 540;

  var svg2 = d3.select("#box2").append("svg")
      .attr("id","box2SVG")
      .attr("viewBox", "0 0 " + wwidth + " " + hheight)           // make it
      .attr("preserveAspectRatio", "xMidYMid")  // responsive
      .attr("width", width + margin.left + margin.right)
      .attr("height", hheight)
      //.attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left +
        "," + (margin.top) + ")");
  
  var c2 = {};
  
  c2.side = Math.floor(140 * wwidth / 540);
  
  c2.scale = d3.scale.linear()
        .range([0, c2.side * 0.6]);
  
  var g2 = svg2.append("g")
      .attr("transform", "translate(0,70)");
    
  // title
  c2.title = g2.append("g")
      .attr("class","title");
  
  c2.title
    .append("line")
      .attr("class","main-line")
      .style("shape-rendering", okCrisp())
      .attr({ "x1": 0, "y1": -35, "x2": width, "y2": -35 });
  
  c2.title
    .append("text")
    .text("Main themes")
    .attr({ "x": 0, "y": -45 })

  c2.title.append("rect")
    .attr({
      "x": 0,
      "y": -25,
      "height": 3,
      "width": 25  
    })
    .style({
      //"fill": "transparent",
      "opacity": 0,
      "stroke": "#828282",
      "stroke-width": "1px",
      "shape-rendering": "crispEdges"
    });

  c2.title.append("text")
    .text("Total")
    .attr({ "x": 28, "y": -20 })
    .attr("class","legend");

  c2.title.append("rect")
    .attr({
      "x": 70,
      "y": -28,
      "height": 10,
      "width": 81 
    })
    .style({
      "fill": "gold",
      "stroke": "none",
      "shape-rendering": "crispEdges"
    });

  c2.title.append("rect")
    .attr({
      "x": 70,
      "y": -25,
      "height": 3,
      "width": 25  
    })
    .style({
      "fill": "#828282",
      "stroke": "none",
      "shape-rendering": "crispEdges"
    });

  c2.title.append("text")
    .text("Selection")
    .attr({ "x": 98, "y": -20 })
    .attr("class","legend"); 
  
    
  // box 3 /////////////////////////////////////////////////////////////

  var svg3 = d3.select("#box3").append("svg")
      .attr("id","box3SVG")
      .attr("viewBox", "0 0 " + wwidth + " 540")           // make it
      .attr("preserveAspectRatio", "xMidYMid")  // responsive
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left +
        "," + (margin.top) + ")");
    
  var c3 = {};
  
  c3.scale = d3.scale.linear()
        .range([0, width * 0.9]);
  
  var g3 = svg3.append("g")
      .attr("transform", "translate(0,70)");
    
  // title
  c3.title = g3.append("g")
      .attr("class","title");
      //.attr("transform","translate(0,-20)");
  
  c3.title
    .append("line")
      .attr("class","main-line")
      .style("shape-rendering", okCrisp())
      .attr({ "x1": 0, "y1": -35, "x2": width, "y2": -35 });
  
  c3.title
    .append("text")
    .text("Main partners")
    .attr({ "x": 0, "y": -45 })

  c3.title.append("rect")
    .attr({
      "x": 0,
      "y": -25,
      "height": 3,
      "width": 25  
    })
    .style({
      //"fill": "transparent",
      "opacity": 0,
      "stroke": "#828282",
      "stroke-width": "1px",
      "shape-rendering": "crispEdges"
    });

  c3.title.append("text")
    .text("Total")
    .attr({ "x": 28, "y": -20 })
    .attr("class","legend1");

  c3.title.append("rect")
    .attr({
      "x": 70,
      "y": -28,
      "height": 10,
      "width": 81  
    })
    .style({
      "fill": "gold",
      "stroke": "none",
      "shape-rendering": "crispEdges"
    });

  c3.title.append("rect")
    .attr({
      "x": 70,
      "y": -25,
      "height": 3,
      "width": 25  
    })
    .style({
      "fill": "#828282",
      "stroke": "none",
      "shape-rendering": "crispEdges"
    });

  c3.title.append("text")
    .text("Selection")
    .attr({ "x": 98, "y": -20 })
    .attr("class","legend1");

  // box 4 /////////////////////////////////////////////////////////////
    
  // First Run /////////////////////////////////////////////////////////
  
  var GetFirstRun = function(update) {
    return function(data) {

      //  Prapare data relative to Years, Partners and Themes
      var data = {
        "years" : getYears(data),
        "partners" : getPartners(data).slice(0, 17),
        "themes": getThemes(data).slice(0, 9)
      }
      
      // box 1
      c1.bb.selectAll(".bb")
          .data(data.years)
        .enter()
          .append("rect")
          .attr("x", function(d) { return c1.xScale(d.year); })
          .attr("y", -10)
          .attr("width", (c1.xScale.range()[1] - c1.xScale.range()[0]) + "px")
          .attr("height", height / 3 + 87)
          .attr("class",function(d,i) { return "bb " + "bb" + i  })
          .style("fill", "none")
          .style("shape-rendering", okCrisp());
      
      c1.fb.selectAll(".fb")
          .data(data.years)
        .enter()
          .append("rect")
          .attr("x", function(d) { return c1.xScale(d.year); })
          .attr("y", -10)
          .attr("width", (c1.xScale.range()[1] - c1.xScale.range()[0]) + "px")
          .attr("height", height / 3 + 87)
          .attr("class","fb")
          .style("shape-rendering", okCrisp())
          .on("mouseover", function(d,i) {
              var sel = c1.bb.select(".bb" + i);
              console.log(sel.style("fill"));
              if (sel.style("fill") === "rgb(255, 215, 0)") {
                sel.style("opacity", "0.3");
              } else {
                sel.style("fill", "gold");
              }
           })
           .on("mouseout", function(d,i){
              self = c1.bb.select(".bb" + i)
              self.style("opacity", "1");
              self.style("fill", self.classed("selected") ? "gold" : "none");
           })
          .on("click", function(d,i) {
              if ( c1.bb.select(".bb" + i).classed("selected") ) {
                c1.bb.select(".selected")
                    .classed("selected", false)
                    .style("fill", "none");
                sel.year = undefined;
                update();
              } else {
                c1.bb.select(".selected")
                    .classed("selected", false)
                    .style("fill", "none");
                c1.bb.select(".bb" + i)
                    .attr("class", "bb " + "bb" + i + " selected");
                sel.year = d.year;
                update();           
              }
          });

      c1.yScale
          .domain([0,d3.max(data.years, function(d) { return d.value })]);
      
      c1.axis
          .call(c1.xAxis);
      
      c1.path
          .datum(c1.dataLine(data.years,c1.xScale,c1.yScale))
          .attr("d", function(d) { return c1.line(d) + "Z"; })
          .style("shape-rendering", okCrisp())
          .attr("transform", "translate(" +
            c1.xScale(data.years[0].year) + ",0)");

      var rects = c1.bars.selectAll(".rect1")
          .data(data.years, function(d) { return d.year; });
          /*.attr("transform","translate(20,0)");*/
      
      rects.enter()
          .append("rect")
          .attr("x", function(d) { return c1.xScale(d.year); })
          .attr("y", function(d) { return c1.yScale(d.value); })
          .style("shape-rendering", okCrisp())
          .attr("width", (c1.xScale.range()[1] - c1.xScale.range()[0]) + "px")
          .attr("height", function(d) {
            return height / 3 - c1.yScale(d.value);
          })
          .attr("class","rect1");
      
      c1.total = c1.legend.selectAll(".total")
          .data(data.years);
      
      c1.total.enter()
          .append("text")
          .attr("class","total")
          .text(function(d) { return d.value })
          .attr("y", height/2 + 42)
          .attr("x", function(d) { return c1.xScale(d.year) })
          .attr("dx",c1.xScale.rangeBand()/2 + 11);

      c1.selection = c1.legend.selectAll(".selection")
          .data(data.years, function(d) { return d.year; });
      
      c1.selection.enter()
          .append("text")
          .attr("class","selection")
          //.text(function(d) { return Math.floor(d.value) })
          .text(function(d) { return Math.floor(d.value) })
          .attr("y", height/2 + 69)
          .attr("x", function(d) { return c1.xScale(d.year) })
          .attr("dx",c1.xScale.rangeBand()/2 + 11);
      
      // box 2 ///////////////////////////////////////////////////////////
      
      var nT = data["themes"].length;

      if (nT < 4) {

        d3.select("#box2").select("svg")
            .attr("viewBox", "0 0 " + wwidth + " 240")           // make it
            .attr("height", 240);

      } else if (nT < 7) {

        d3.select("#box2").select("svg")
            .attr("viewBox", "0 0 " + wwidth + " 390")           // make it
            .attr("height", 390);

      }

      c2.scale
          .domain([0,d3.max(data.themes, function(d) { return Math.sqrt(d.value) })]);

      // back squares 
      g2.append("g").selectAll(".bs")
          .data(data.themes)
        .enter()
          .append("rect")
          .attr({ "x": 0, "y": 0, "width": c2.side, "height": c2.side })
          .attr("class",function(d,i) { return "bs " + "bs" + i  })
          .style("fill", "none")
          .style("shape-rendering", okCrisp())
          .attr("transform", function(d,i) {
            return "translate(" + 
              ( c2.side * (i % 3) ) + "," + ( c2.side * Math.floor(i / 3) ) + ")";
          }); 
         
      c2.squares = g2.selectAll(".squares")
          .data(data.themes)
        .enter()
          .append("g")
          .attr("class", "squares")
          .attr("transform", function(d,i) {
            return "translate(" + 
              ( c2.side * (i % 3) ) + "," + ( c2.side * Math.floor(i / 3) ) + ")";
          }); 
      
      c2.squaresRatio = g2.selectAll(".squares-ratio")
          .data(data.themes, function(d) { return d.theme; });
      
      c2.squaresRatio.enter().append("rect")
          .attr("transform", function(d,i) {
            return "translate(" + 
              ( c2.side * (i % 3) ) + "," + ( c2.side * Math.floor(i / 3) ) + ")";
          })
          .attr("x", 0)
          .attr("y", function(d) { return c2.side * 0.6 - c2.scale(Math.sqrt(d.value)); })
          .attr("class", "squares-ratio")
          .style("shape-rendering", okCrisp())
          .attr("width", function(d) {
            return c2.scale(Math.sqrt(d.value));
          })
          .attr("height", function(d) {
            return c2.scale(Math.sqrt(d.value));
          });   
      
      // data
      c2.squares.append("rect")
          .attr("x", 0)
          .attr("y", function(d) {
            return c2.side * 0.6 - c2.scale(Math.sqrt(d.value));
          })
          .attr("class", "squares-total")
          .style("shape-rendering", okCrisp())
          .attr("width", function(d) {
            return c2.scale(Math.sqrt(d.value));
          })
          .attr("height", function(d) {
            return c2.scale(Math.sqrt(d.value));
          });
      
      c2.squares.append("line")
          .attr("class","sub-line")
          .style("shape-rendering", okCrisp())
          .attr({ "x1": 0, "y1": c2.side * 0.75,
            "x2": c2.side * 0.85, "y2": c2.side * 0.75 });
      
      c2.squares.append("text")
          .text(function(d) {
            return wwidth < 540 && d.theme.length > 10
              ? d.theme.slice(0,10) + ".."
              : d.theme;
          })
          .attr({ "x": 0, "y": c2.side * 0.75 })
          .attr("dy", -3)
          .attr("class", "legend");
      
      c2.squares.append("text")
          .text(function(d) { return d.value; })
          .attr({ "x": 0, "y": c2.side * 0.88 })
          .attr("dy", -3)
          .attr("class", "legend total")
          .style("text-anchor", "start");    
      
      c2.textRatio = g2.selectAll(".text-ratio")
          .data(data.themes, function(d) { return d.theme; });
      
      c2.textRatio.enter().append("text")
          .attr("class", "text-ratio selection")
          .attr("transform", function(d,i) {
            return "translate(" + 
              ( c2.side * (i % 3) ) + "," +
              ( c2.side * Math.floor(i / 3) ) + ")";
          })
          .text(function(d) { return Math.floor(d.value); })
          .attr({ "x": 22, "y": c2.side * 0.88 })
          .attr("dy", -3)
          .style("text-anchor", "start");
      
      // front squares
      g2.append("g").selectAll(".fs")
          .data(data.themes)
        .enter()
          .append("rect")
          .attr("transform", function(d,i) {
            return "translate(" + 
              ( c2.side * (i % 3) ) + "," +
              ( c2.side * Math.floor(i / 3) ) + ")";
          })
          .attr({ "x": 0, "y": 0, "width": c2.side, "height": c2.side })
          .attr("class",function(d,i) { return "fs " + "fs" + i  })
          .style("shape-rendering", okCrisp())
          .on("mouseover", function(d,i) {
              var sel = g2.select(".bs" + i);
              if (sel.style("fill") === "rgb(255, 215, 0)") {
                sel.style("opacity", "0.3");
              } else {
                sel.style("fill", "gold");
              }
          })
          .on("mouseout", function(d,i){
              self = g2.select(".bs" + i);
              self.style("opacity",1);
              self.style("fill", self.classed("selected") ? "gold" : "none");
          })
          .on("click", function(d,i) {
              if ( g2.select(".bs" + i).classed("selected") ) {
                g2.select(".selected")
                    .classed("selected", false)
                    .style("fill", "none");
                sel.theme = undefined;
                update();
              } else {
                g2.select(".selected")
                    .classed("selected", false)
                    .style("fill", "none");
                g2.select(".bs" + i)
                    .attr("class", "bs " + "bs" + i + " selected");
                sel.theme = d.theme;
                update();
              }
          });
      

      // box 3

      c3.scale
          .domain([0,d3.max(data.partners, function(d) { return d.value })]);

      // back squares 
      g3.append("g").selectAll(".br")
          .data(data.partners)
        .enter()
          .append("rect")
          .attr({ "x": 0, "y": -4, "width": width, "height": 25 })
          .attr("class",function(d,i) { return "br " + "br" + i  })
          .style("fill", "none")
          .style("shape-rendering", okCrisp())
          .attr("transform", function(d,i) {
            return "translate(0," + ( i * 25 ) + ")";
          });

      c3.rects = g3.selectAll(".rects")
          .data(data.partners);
      
      c3.rects.enter().append("rect")
          .attr("transform", function(d,i) {
            return "translate(0," + ( i * 25 ) + ")";
          })
          .attr("x", 0)
          .attr("y", 5)
          .attr("class", "rects")
          .style("shape-rendering", okCrisp())
          .attr("width", function(d) { return c3.scale(d.value); })
          .attr("height", 3);

      c3.rectsRatio = g3.selectAll(".rects-ratio")
          .data(data.partners, function(d) { return d.partner; });
      
      c3.rectsRatio.enter().append("rect")
          .attr("transform", function(d,i) {
            return "translate(0," + ( i * 25 ) + ")";
          })
          .attr("x", 0)
          .attr("y", 5)
          .attr("class", "rects-ratio")
          .style("shape-rendering", okCrisp())
          .attr("width", function(d) { return c3.scale(d.value); })
          .attr("height", 3);

      c3.partners = g3.selectAll(".legend")
          .data(data.partners)
        .enter();
      
      c3.partners.append("text")
          .text(function(d) {
            var n = Math.floor(60 * wwidth / 540);
            return d.partner.length < n
              ? d.partner
              : d.partner.slice(0, -5 + +n + 1 || 9e9) + "..."
          })
          .attr({ "x": 0, "y": 0 })
          .attr("transform", function(d,i) {
            return "translate(0," + ( i * 25 ) + ")";
          })
          .attr("dy", 3)
          .attr("class", "legend");

      c3.partners.append("text")
          .text(function(d) { return d.value; })
          .attr({ "x": width, "y": 0 })
          .attr("transform", function(d,i) {
            return "translate(0," + ( i * 25 ) + ")";
          })
          .attr("dy", 3)
          .attr("dx", -25)
          .attr("class", "total");
      
      c3.textRatio = g3.selectAll(".text-ratio")
          .data(data.partners, function(d) { return d.partner; });
      
      c3.textRatio.enter().append("text")
          .attr("class", "text-ratio selection")
          .attr("transform", function(d,i) {
            return "translate(0," + ( i * 25 ) + ")";
          })
          .text(function(d) { return Math.floor(d.value); })
          .attr({ "x": width, "y": 0 })
          .attr("dy", 3)
          .style("text-anchor", "end");

      // front
      g3.append("g").selectAll(".fr")
          .data(data.partners)
        .enter()
          .append("rect")
          .style("shape-rendering", okCrisp())
          .attr("transform", function(d,i) {
            return "translate(0," + ( i * 25 ) + ")";
          })
          .attr({ "x": 0, "y": -4, "width": width, "height": 25 })
          .attr("class",function(d,i) { return "fr " + "fr" + i  })
          .on("mouseover", function(d,i) {
              var sel = g3.select(".br" + i);
              if (sel.style("fill") === "rgb(255, 215, 0)") {
                sel.style("opacity", "0.3");
              } else {
                sel.style("fill", "gold");
              }
          })
          .on("mouseout", function(d,i){
              self = g3.select(".br" + i)
              self.style("opacity", "1");
              self.style("fill", self.classed("selected") ? "gold" : "none");
          })
          .on("click", function(d,i) {
              if ( g3.select(".br" + i).classed("selected") ) {
                g3.select(".selected")
                    .classed("selected", false)
                    .style("fill", "none");
                sel.partner = undefined;
                update();
              } else {
                g3.select(".selected")
                    .classed("selected", false)
                    .style("fill", "none");
                g3.select(".br" + i)
                    .attr("class", "br " + "br" + i + " selected");
                sel.partner = d.partner.toLowerCase();
                update();
              }
          });  

    };
  };

  // Update /////////////////////////////////////////////////////////
  
  var getUpdate = function(data) {

    return function() {

      fdata = filterProjects(data, sel);

      // box0

      h20.text(fdata.length + " Projects Selected");

      var spans = div0.selectAll(".projInfo")
        .data(fdata);

      spans.text(function(d) { return d.project; });
      
      spans.enter()
        .append("span")
        .attr("class","projInfo")
        .text(function(d) { return d.project; });

      spans.exit().remove();


      //  Prapare data relative to Years, Partners and Themes
      var selections = {
        "years" : getYears(fdata),
        "partners" : getPartners(fdata),
        "themes": getThemes(fdata)
      }
      
      // box 1

      var rects = c1.bars.selectAll(".rect1")
          .data(selections.years, function(d) { return d.year; });
          /*.attr("transform","translate(20,0)");*/
      
      rects.transition().duration(1000)
          .attr("y", function(d) { return c1.yScale(d.value); })
          .attr("height", function(d) {
            return height / 3 - c1.yScale(d.value);
          });

      rects.exit().transition().duration(1000)
          .attr("y", height / 3)
          .attr("height", function(d) {
            return 0;
          });

      c1.selection = c1.legend.selectAll(".selection")
          .data(selections.years, function(d) { return d.year; });
      
      c1.selection
        .transition()
          .duration(700)
          .ease("linear")
          .tween("text", function(d) {
              var i = d3.interpolate(this.textContent, Math.floor(d.value));
              return function(t) {
                this.textContent = Math.round(i(t));
              };
           });

      c1.selection.exit()
        .transition()
          .duration(700)
          .ease("linear")
          .tween("text", function(d) {
              var i = d3.interpolate(this.textContent, 0);
              return function(t) {
                this.textContent = Math.round(i(t));
              };
           });
      
      // box 2 ///////////////////////////////////////////////////////////
      
      c2.squaresRatio = g2.selectAll(".squares-ratio")
          .data(selections.themes, function(d) { return d.theme; });

      c2.squaresRatio.transition()
          .duration(1000)
          .attr("y", function(d) {
            return c2.side * 0.6 - c2.scale(Math.sqrt(d.value));
          })
          .attr("width", function(d) {
            return c2.scale(Math.sqrt(d.value));
          })
          .attr("height", function(d) {
            return c2.scale(Math.sqrt(d.value));
          });

      c2.squaresRatio.exit().transition()
          .duration(1000)
          .attr("y", function(d) {
            return c2.side * 0.6;
          })
          .attr("width", 0)
          .attr("height", 0);   
      
      c2.textRatio = g2.selectAll(".text-ratio")
          .data(selections.themes, function(d) { return d.theme; });
      
      c2.textRatio.transition()
          .duration(700)
          .ease("linear")
          .tween("text", function(d) {
              var i = d3.interpolate(this.textContent, Math.floor(d.value));
              return function(t) {
                this.textContent = Math.round(i(t));
              };
           });

      c2.textRatio.exit().transition()
          .duration(700)
          .ease("linear")
          .tween("text", function(d) {
              var i = d3.interpolate(this.textContent, 0);
              return function(t) {
                this.textContent = Math.round(i(t));
              };
           });

      // box 3

      c3.rectsRatio = g3.selectAll(".rects-ratio")
          .data(selections.partners, function(d) { return d.partner; });

      c3.rectsRatio.transition()
          .duration(1000)
          .attr("width", function(d) { return c3.scale(d.value); });

      c3.rectsRatio.exit().transition()
          .duration(1000)
          .attr("width", 0);
      
      c3.textRatio = g3.selectAll(".text-ratio")
          .data(selections.partners, function(d) { return d.partner; });
      
      c3.textRatio.transition()
          .duration(700)
          .ease("linear")
          .tween("text", function(d) {
              var i = d3.interpolate(this.textContent, Math.floor(d.value));
              return function(t) {
                this.textContent = Math.round(i(t));
              };
           });

      c3.textRatio.exit().transition()
          .duration(700)
          .ease("linear")
          .tween("text", function(d) {
              var i = d3.interpolate(this.textContent, 0);
              return function(t) {
                this.textContent = Math.round(i(t));
              };
           });

    };
  };

  var listProjs = function(data) {

    //h10.text(data.length + " Projects");
    h10.text("Projects Titles");
    h20.text(data.length + " Projects Selected");

    div0.selectAll(".projInfo")
        .data(data)
      .enter()
        .append("span")
        .attr("class","projInfo")
        .text(function(d) { return d.project; });

  }

  var drawMap = function(data, topology, coordinates) {
    
    var cities = getPartners(data)
        .map(function(el){
          return {
            "partner": el.partner,
            "coords": coordinates[el.partner]
          }; 
        })
        .filter(function(el) { 
          return el.coords != undefined && el.coords.length == 2; });
        //.slice(0, 500);

    var margin = {top: 40, right: 40, bottom: 40, left: 40},
        width = wwidth - margin.left - margin.right,
        height = width + 20 - margin.top - margin.bottom;

    var svg = d3.select("#box5").append("svg")
        .attr("id", "map")
        .attr("viewBox", "0 0 " + wwidth + " " + (wwidth+20))          // make it
        .attr("preserveAspectRatio", "xMidYMid") // responsive
        .attr("width", wwidth)
        .attr("height", wwidth + 20);

    var map = svg.append("g")
        .attr("class","wmap")
        .attr("transform","translate(40,57)");

    var title = svg.append("g")
        .attr("class","title")
        .attr("transform","translate(30,90)");
  
    title
      .append("line")
        .attr("class","main-line")
        .style("shape-rendering", okCrisp())
        .attr({ "x1": 0, "y1": -35, "x2": (width+20), "y2": -35 });

    title.append("rect")
      .attr({
        "x": 0,
        "y": -33,
        "height": 28,
        "width": 250  
      })
      .style({
        "fill": "#fff",
        "stroke": "none",
        "shape-rendering": "crispEdges"
      });

    title
      .append("text")
      .text("Partners in Europe")
      .attr({ "x": 0, "y": -45 })

    title.append("rect")
      .attr({
        "x": 0,
        "y": -25,
        "height": 3,
        "width": 3  
      })
      .style({
        "fill-opacity": 0,
        "stroke": "#96281B",
        "stroke-width": "1px"
      })
      .style("shape-rendering", okCrisp());

    title.append("text")
      .text("Location of one or more partners")
      .attr({ "x": 8, "y": -20 })
      .attr("class","legend");

    //var projection = d3.geo.azimuthalEquidistant()  // projection
    var projection = d3.geo.azimuthalEqualArea()
    //var projection = d3.geo.conicEqualArea()
    //var projection = d3.geo.conicConformal()
    //var projection = d3.geo.stereographic()
    //var projection = d3.geo.mercator()
    //var projection = d3.geo.conicEquidistant()
    //var projection = d3.geo.equirectangular()
          .center([17.25,52.3]) // europe
          //.center([-73.98, 40.77]) // NY
          //.center([144.96, -27.81])
          //.rotate([-11,0,0])
          .clipExtent([[0,0],[width,width]])
          .rotate([0,0,0])
          .translate([width/2,width/2])
          .scale(Math.floor(500*wwidth/540));

    var path = d3.geo.path()
        .projection(projection);

    var features = topojson
        .feature(topology, topology.objects.land);

    map.selectAll(".city-dot")
        .data(cities)
      .enter()
        .append("rect")
        .attr("class","city-dot")
        .style("shape-rendering", okCrisp())
        .attr({
          "x": 0,
          "y": 0,
          "width": 3,
          "height": 3
        })
        .attr("transform", function(d) {
          return "translate (" +
            projection([d.coords[1],d.coords[0]]) + ")";
        });

    map.append("path")
      .datum(features)
      .attr("d", path);
      // .style({
      //   "stroke": "#828282",
      //   "stroke-width": "1px",
      //   "fill": "#fff"
      // });

    map.append("rect")
      .attr({
        "x": 0,
        "y": 0,
        "width": width,
        "height": width
      })
      .style({
        //"fill": "transparent",
        "stroke": "#fff",
        "stroke-width": "2px"
      })
      .style("shape-rendering", okCrisp());

    // var name = data[0]["Organization Name"].toLowerCase();
    // var coordsOrg = coordinates[name];

    // map.append("rect")
    //     .datum(coordsOrg)
    //     .attr({
    //       "x": 0,
    //       "y": 0,
    //       "width": 10,
    //       "height": 10
    //     })
    //     .attr("transform", function(d) {
    //       return "translate (" +
    //         projection([d[1],d[0]]) + ")";
    //     })
    //     .style({
    //       "fill": "gold",
    //       "stroke": "#666",
    //       "stroke-width": "1px"
    //     })






  }

  var drawProjects = function(data) {
    
    var n = data.length;
    var hh = n > 200 ? 3 : 4;
    var hTooltip = 100;
  
    var margin4 = {top: 30, right: 10, bottom: 30, left: 30},
        width4 = wwidth - margin4.left - margin4.right,
        height4 = hTooltip + n * hh - 15;

    var tScale = d3.time.scale()
        .range([150, width4 - margin4.left - margin4.right])
        .domain([format.parse(data[0]["Start Date"]),
          d3.max(data, function(d) {
            return format.parse(d["End Date"])})]);
    var pScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) {
          return d["partners"].length; })])
        .range([0,150]);

    var svg4 = d3.select("#box4").append("svg")
        .attr("id","box4SVG")
        .attr("viewBox", "0 0 " + wwidth + " " + (hTooltip + n * hh - 15)) // make it
        .attr("preserveAspectRatio", "xMidYMid")  // responsive
        .attr("width", width4 + margin4.left + margin4.right)
        .attr("height", height4)
      .append("g")
        .attr("transform", "translate(" + margin4.left +
        "," + (margin4.top + 40) + ")");
    
    var title = svg4.append("g")
        .attr("class","title");
    
    title
      .append("line")
        .attr("class","main-line")
        .style("shape-rendering", okCrisp())
        .attr({ "x1": 0, "y1": -35, "x2": width, "y2": -35 });

    title.append("rect")
        .attr({
          "x": 0,
          "y": -25,
          "height": hh - 1,
          "width": 25  
        })
        .attr("class","project-partners")
        .style("shape-rendering", okCrisp());

    title.append("text")
      .text("Number of Partners")
      .attr({ "x": 28, "y": -20 })
      .attr("class","legend");

    title.append("rect")
        .attr({
          "x": 150,
          "y": -25,
          "height": hh - 1,
          "width": 25  
        })
        .style({
          "fill": "#828282",
          "stroke": "none",
          "shape-rendering": "crispEdges"
        });

    title.append("text")
      .text("Duration")
      .attr({ "x": 178, "y": -20 })
      .attr("class","legend"); 

    
    title
      .append("text")
      .text(wwidth < 540 ? "Project Duration" : "Project Duration and number of Partners")
      .attr({ "x": 0, "y": -45 })

    title
      .append("line")
        .attr("class","sub-line")
        .style("shape-rendering", okCrisp())
        .attr({ "x1": 0, "y1": -12, "x2": width, "y2": -12 });

    var pRectsg = svg4.append("g")
        .attr("transform","translate(0,5)");

    var details = svg4.append("g")
        .style("display","none")
        .attr("class","legend");
        /*.attr("transform","translate(0,5)");*/

    var detailsBackground = details.append("rect")
        .attr({
          "y": -10,
          "width": width,
          "height": 28
        })
        .style({
          "fill": "#fff",
          "opacity": 0.7,
          "stroke-width": "0px"
        })
        .style("shape-rendering", okCrisp());

    var detailsTitle = details.append("text");

    var detailsInfo = details.append("text")
        .attr("dy","15"); 

    // var toolTip = svg4.append("g");

    var pRects = pRectsg.selectAll(".project")
        .data(data)
      .enter().append("g")
        .on("mouseover", function(d,i) {
            d3.select(this)
              .style("opacity", 0.7);
            details.style("display",null);
            details.attr("transform", "translate(0," + (i * hh - 18) + ")")
            detailsTitle.text(
              d.project.length > (wwidth * 70 / 540)
                ? d.project.slice(0, wwidth * 70 / 540) + "..."
                : d.project);
            detailsInfo.text(d["Start Date"]+" - "+d["End Date"] + 
              " | " + (d.partners.length-1) + " Partners");
         })
         .on("mouseout", function(){
            details.style("display","none");
            d3.select(this)
              .style("opacity", 1);
         })
    
    pRects.append("rect")
        .attr("x", function(d) {
          return tScale(format.parse(d["Start Date"]));
        })
        .attr("y", function(d,i) {
          return i * hh;
        })
        .attr("width", function(d) {
          return tScale(format.parse(d["End Date"])) -
            tScale(format.parse(d["Start Date"]));
        })
        .attr("height", hh - 1)
        .attr("class","project")
        .style("shape-rendering", okCrisp());

    pRects.append("rect")
        .attr("x", function(d) {
          return tScale(format.parse(d["Start Date"])) -
            pScale(d["partners"].length-1);
        })
        .attr("y", function(d,i) {
          return i * hh;
        })
        .attr("width", function(d) {
          return pScale(d["partners"].length-1);
        })
        .attr("height", hh - 1)
        .attr("class","project-partners")
        .style("shape-rendering", okCrisp());

  };

  queue()
    .defer(d3.json, "./js/data.json")
    .defer(d3.json, "./js/world.json")
    .defer(d3.json, "./js/coords.json")
    .await(ready);

  //d3.json("data.json", function(error, data) {
  function ready(error, data, topology, coordinates) {
    
    // Fix data
    var data = fixData(data);

    var update = getUpdate(data);
    var firstRun = GetFirstRun(update);

    // First run, show total values
    //  Draw charts
    firstRun(data);

    // Draw Projects
    drawProjects(data);

    // Draw Map
    drawMap(data, topology, coordinates);

    listProjs(data);

    var container = document.querySelector('#container-viz');
    var msnry = new Masonry( container, {
      // options
      columnWidth: 540,
      itemSelector: '.item-viz'
    });

    d3.selectAll(".item-viz")
      .data([0,1,2,3,4,5])
      .transition()
        .delay(function(i){
          return i * 100;})
        .duration(1000)
        .style("opacity", 1);

  }
  
  //update(getRandomData());

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
  }

  
  // function resize(id) {
  //   console.log("res");
  //   var chart = $("#"+id),
  //       aspect = chart.width() / chart.height(),
  //       container = chart.parent();
  //   var resize = function() {
  //       var targetWidth = container.width();
  //       chart.attr("width", targetWidth);
  //       chart.attr("height", Math.round(targetWidth / aspect));
  //   };
  //   $(window).on("resize", resize).trigger("resize");
  //   $(window).on("ready", resize).trigger("resize");
  // }

  // Responsiveness
  //resize("box1SVG");
  

})()