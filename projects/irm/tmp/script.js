(function () {

  // HELPER FUNCTIONS //////////////////////////////////////////////////

  var fix, fixParteners, newData;

  fix = function(s) {
    var i;
    return ((function() {
      var _i, _len, _ref, _results;
      _ref = s.split("\"");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(i.replace(/^\s+|\s+$/g, ""));
      }
      return _results;
    })()).filter(function(j) {
      return j !== '';
    });
  };

  fixPartners = function(o) {
    o.partners = fix(o.partners);
    return o;
  };

  newData = function(data) {
    var k, v, _ref, _results;
    _ref = data.progetti;
    _results = [];
    for (k in _ref) {
      v = _ref[k];
      _results.push(fixPartners(v.progetto));
    }
    return _results;
  };

  // CHARTS ////////////////////////////////////////////////////////////
  
  var margin = {top: 30, right: 30, bottom: 30, left: 30},
      width = 540 - margin.left - margin.right,
      height = 540 - margin.top - margin.bottom;
  
  // box 1
  
  var svg1 = d3.select("#box1").append("svg")
      .attr("id","box1SVG")
      .attr("viewBox", "0 0 540 540")           // make it
      .attr("preserveAspectRatio", "xMidYMid")  // responsive
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," +
        (margin.top + 80) + ")");
  
  var line = function(L,m) {
    var m, x0, x1, y0, y1, a;
    x0 = getRandomInt(0, L);
    y0 = getRandomInt(0, L);
    a = getRandomInt(0, 360);
    x1 = m * Math.sin(a);
    y1 = m * Math.cos(a);
    return "M" + x0 + "," + y0 + "l" + x1 + "," + y1;
  };
  
  var pattern = function(n, L, m) {
    var i;
    return ((function() {
      var _i, _results;
      _results = [];
      for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
        _results.push(line(L,m));
      }
      return _results;
    })()).join('');
  };

  svg1
    .append('defs')
    .append('pattern')
      .attr('id', 'diagonalHatchCase4')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 100)
      .attr('height', 100)
    .append('path')
      .attr('d',pattern(3000,100,1))
      // .attr('d', 'M0,4l4,-4')
      .attr('stroke', '#000')
      //.attr('stroke', 'rgb(83, 83, 83)')
      .attr('stroke-width', 1);
  
  var c1 = {};
  var g1 = svg1.append("g")
      .attr("transform", "translate(0,60)");
  
  // back bars
  c1.bb = g1.append("g");
  
  c1.xScale = d3.scale.ordinal()
        .domain(["2006","2007","2008","2009","2010",
          "2011","2012","2013","2014"])
        .rangeRoundBands([0, width],0,0);

  c1.yScale = d3.scale.linear()
        .range([height / 2, 0]);
  
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
      .attr("class","line");
  
  c1.bars = g1.append("g");
      //.attr("transform", "translate(-3,0)");
  
  c1.dataLine = function(data, x, y) {
    var h, new_data, s;
    s = x.range()[1] - x.range()[0];
    h = y.range()[0];
    new_data = data.reduce(function(dd, d, i) {
      return dd.concat([[i * s, y(d.total)], [(i + 1) * s, y(d.total)]]);
    }, [[0, h]]);
    return new_data.concat([[(new_data.length - 1)/2 * s, h]]);
  };
  
  c1.title = g1.append("g")
      .attr("class","title");
  
  c1.title
    .append("line")
      .attr("class","main-line")
      .attr({ "x1": 0, "y1": -35, "x2": width, "y2": -35 });
  
  c1.title
    .append("text")
    .text("Projects started each year")
    .attr({ "x": 0, "y": -45 })
  
  c1.legend = g1.append("g")
      .attr("class","legend");
  
  c1.legend
    .append("line")
      .attr("class","main-line")
      .attr({ "x1": 0, "y1": height/2 + 25, 
        "x2": width, "y2": height/2 + 25 });
  
  c1.legend
    .append("line")
      .attr("class","sub-line")
      .attr({ "x1": 0, "y1": height/2 + 50,
        "x2": width, "y2": height/2 + 50 });
  
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
  
  var svg2 = d3.select("#box2").append("svg")
      .attr("id","box2SVG")
      .attr("viewBox", "0 0 540 540")           // make it
      .attr("preserveAspectRatio", "xMidYMid")  // responsive
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left +
        "," + (margin.top) + ")");
  
  var c2 = {};
  
  c2.side = 120;
  
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
      .attr({ "x1": 0, "y1": -35, "x2": width, "y2": -35 });
  
  c2.title
    .append("text")
    .text("Most frequent project themes")
    .attr({ "x": 0, "y": -45 })
  
    
  // box 3 /////////////////////////////////////////////////////////////

  var svg3 = d3.select("#box2").append("svg")
      .attr("id","box3SVG")
      .attr("viewBox", "0 0 540 540")           // make it
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
  
  c3.title
    .append("line")
      .attr("class","main-line")
      .attr({ "x1": 0, "y1": -35, "x2": width, "y2": -35 });
  
  c3.title
    .append("text")
    .text("Most frequent partners")
    .attr({ "x": 0, "y": -45 })
    
  // box 4 /////////////////////////////////////////////////////////////

  var svg4 = d3.select("#box4").append("svg")
      .attr("id","box4SVG")
      .attr("viewBox", "0 0 500 500")           // make it
      .attr("preserveAspectRatio", "xMidYMid")  // responsive
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left +
        "," + margin.top + ")");
  
  /*svg
    .append('defs')
    .append('pattern')
      .attr('id', 'diagonalHatchCase4')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 100)
      .attr('height', 100)
    .append('path')
      .attr('d',pattern(400,100,5))
      // .attr('d', 'M0,4l4,-4')
      .attr('stroke', '#fff')
      //.attr('stroke', 'rgb(83, 83, 83)')
      .attr('stroke-width', 1);*/

  var button = svg4.append("g")
      .attr("transform","translate(185,0)");

  button.append("rect")
      .attr({
        "id":"nmaButton",
        "x":"0",
        "y":"0",
        "height":"40",
        "width":"130",
        "rx":"10",
        "ry":"10"
      })
      .style({
        "fill":"#eee"
      });
  button.append("text")
      .text("Get a new sample")
      .attr({
        "dx":"20",
        "dy":"23"
      })
      .style({
        "fill":"#B84100",
        "font-size":"12px",
        "font-family":"Lato",
      });
  button.append("rect")
      .attr({
        "x":"0",
        "y":"0",
        "height":"40",
        "width":"130",
        "rx":"10",
        "ry":"10"
      })
      .style({
        "fill-opacity":"0"
      });
  button.on("mouseover",function(){
    var self = d3.select(this);
    self.select("rect").style("fill","#f2f2f2");
  });
  button.on("mouseout",function(){
    var self = d3.select(this);
    self.select("rect").style("fill","#eee");
  });
  button.on("click",function(){
    var data = getRandomData();
    update(data);
  });

  var cos = Math.cos(Math.PI/8),
      sin = Math.sin(Math.PI/8);

  var path = function (L,s) {
    return "M 0 0 L " +
      ( -1 * L * s * sin ) + " " + ( -1 * L * s * cos ) + " L " +
      ( L * s * sin ) + " " + ( -1 * L * s * cos ) + " Z";
  }

  var L = 100; // side length

  var c = ["#000","#000","#000"];
  var colors = [c[0],c[1],c[2],c[0],c[1],c[2],c[0],c[1]];
  var angle = 90 / 2;
  var angles = [0,
                angle,
                angle * 2,
                angle * 3,
                angle * 4,
                angle * 5,
                angle * 6,
                angle * 7,
                angle * 8
               ];

  var back = svg4.append("g").attr("transform","translate(250, 200)");
  var front = svg4.append("g").attr("transform","translate(250, 200)");
    
  // First Run /////////////////////////////////////////////////////////
  
  var firstRun = function(data) {
    
    // box 1

    c1.bb.selectAll(".bb")
        .data(data)
      .enter()
        .append("rect")
        .attr("x", function(d) { return c1.xScale(d.year); })
        .attr("y", -25)
        .attr("width", (c1.xScale.range()[1] - c1.xScale.range()[0]) + "px")
        .attr("height", height - 95)
        .attr("class",function(d,i) { return "bb " + "bb" + i  })
        .style("fill", "none");
    
    c1.fb.selectAll(".fb")
        .data(data)
      .enter()
        .append("rect")
        .attr("x", function(d) { return c1.xScale(d.year); })
        .attr("y", -25)
        .attr("width", (c1.xScale.range()[1] - c1.xScale.range()[0]) + "px")
        .attr("height", height - 95)
        .attr("class","fb")
        .on("mouseover", function(d,i) {
            c1.bb.select(".bb" + i)
                .style("fill", "gold");
         })
         .on("mouseout", function(d,i){
            self = c1.bb.select(".bb" + i)
            self.style("fill", self.classed("selected") ? "gold" : "none");
         })
        .on("click", function(d,i) {
            if ( c1.bb.select(".bb" + i).classed("selected") ) {
              c1.bb.select(".selected")
                  .classed("selected", false)
                  .style("fill", "none");
            } else {
              c1.bb.select(".selected")
                  .classed("selected", false)
                  .style("fill", "none");
              c1.bb.select(".bb" + i)
                  .attr("class", "bb " + "bb" + i + " selected");
            }
        });

    c1.yScale
        .domain([0,d3.max(data, function(d) { return d.total })]);
    
    c1.axis
        .call(c1.xAxis);
    
    c1.path
        .datum(c1.dataLine(data,c1.xScale,c1.yScale))
        .attr("d", function(d) { return c1.line(d) + "Z"; });

    var rects = c1.bars.selectAll(".rect1")
        .data(data);
        /*.attr("transform","translate(20,0)");*/
    
    rects.enter()
        .append("rect")
        .attr("x", function(d) { return c1.xScale(d.year); })
        .attr("y", function(d) { return c1.yScale(d.total * d.ratio); })
        .attr("width", (c1.xScale.range()[1] - c1.xScale.range()[0]) + "px")
        .attr("height", function(d) {
          return height / 2 - c1.yScale(d.total * d.ratio);
        })
        .attr("class","rect1");
    
    c1.total = c1.legend.selectAll(".total")
        .data(data);
    
    c1.total.enter()
        .append("text")
        .attr("class","total")
        .text(function(d) { return d.total })
        .attr("y", height/2 + 42)
        .attr("x", function(d) { return c1.xScale(d.year) })
        .attr("dx",28);

    c1.selection = c1.legend.selectAll(".selection")
        .data(data);
    
    c1.selection.enter()
        .append("text")
        .attr("class","selection")
        //.text(function(d) { return Math.floor(d.total * d.ratio) })
        .text(function(d) { return Math.floor(d.total * d.ratio) })
        .attr("y", height/2 + 69)
        .attr("x", function(d) { return c1.xScale(d.year) })
        .attr("dx",28);
    
    // box 2 ///////////////////////////////////////////////////////////
    
    c2.scale
        .domain([0,d3.max(data, function(d) { return Math.sqrt(d.total) })]);

    // back squares 
    g2.append("g").selectAll(".bs")
        .data(data)
      .enter()
        .append("rect")
        .attr({ "x": 0, "y": 0, "width": c2.side, "height": c2.side })
        .attr("class",function(d,i) { return "bs " + "bs" + i  })
        .style("fill", "none")
        .attr("transform", function(d,i) {
          return "translate(" + 
            ( c2.side * (i % 3) ) + "," + ( c2.side * Math.floor(i / 3) ) + ")";
        }); 
       
    c2.squares = g2.selectAll(".squares")
        .data(data)
      .enter()
        .append("g")
        .attr("class", "squares")
        .attr("transform", function(d,i) {
          return "translate(" + 
            ( c2.side * (i % 3) ) + "," + ( c2.side * Math.floor(i / 3) ) + ")";
        }); 
    
    c2.squaresRatio = g2.selectAll(".squares-ratio")
        .data(data);
    
    c2.squaresRatio.enter().append("rect")
        .attr("transform", function(d,i) {
          return "translate(" + 
            ( c2.side * (i % 3) ) + "," + ( c2.side * Math.floor(i / 3) ) + ")";
        })
        .attr("x", 0)
        .attr("y", function(d) { return c2.side * 0.6 - c2.scale(Math.sqrt(d.total * d.ratio)); })
        .attr("class", "squares-ratio")
        .attr("width", function(d) {
          return c2.scale(Math.sqrt(d.total * d.ratio));
        })
        .attr("height", function(d) {
          return c2.scale(Math.sqrt(d.total * d.ratio));
        });   
    
    // data
    c2.squares.append("rect")
        .attr("x", 0)
        .attr("y", function(d) {
          return c2.side * 0.6 - c2.scale(Math.sqrt(d.total));
        })
        .attr("class", "squares-total")
        .attr("width", function(d) {
          return c2.scale(Math.sqrt(d.total));
        })
        .attr("height", function(d) {
          return c2.scale(Math.sqrt(d.total));
        });
    
    c2.squares.append("line")
        .attr("class","sub-line")
        .attr({ "x1": 0, "y1": c2.side * 0.75,
          "x2": c2.side * 0.85, "y2": c2.side * 0.75 });
    
    c2.squares.append("text")
        .text(function(d) { return d.theme; })
        .attr({ "x": 0, "y": c2.side * 0.75 })
        .attr("dy", -3)
        .attr("class", "legend");
    
    c2.squares.append("text")
        .text(function(d) { return d.total; })
        .attr({ "x": 0, "y": c2.side * 0.88 })
        .attr("dy", -3)
        .attr("class", "legend total")
        .style("text-anchor", "start");    
    
    c2.textRatio = g2.selectAll(".text-ratio")
        .data(data);
    
    c2.textRatio.enter().append("text")
        .attr("class", "text-ratio")
        .attr("transform", function(d,i) {
          return "translate(" + 
            ( c2.side * (i % 3) ) + "," +
            ( c2.side * Math.floor(i / 3) ) + ")";
        })
        .text(function(d) { return Math.floor(d.total * d.ratio); })
        .attr({ "x": 22, "y": c2.side * 0.88 })
        .attr("dy", -3)
        .style("text-anchor", "start");
    
    // front squares
    g2.append("g").selectAll(".fs")
        .data(data)
      .enter()
        .append("rect")
        .attr("transform", function(d,i) {
          return "translate(" + 
            ( c2.side * (i % 3) ) + "," +
            ( c2.side * Math.floor(i / 3) ) + ")";
        })
        .attr({ "x": 0, "y": 0, "width": c2.side, "height": c2.side })
        .attr("class",function(d,i) { return "fs " + "fs" + i  })
        .on("mouseover", function(d,i) {
            g2.select(".bs" + i)
                .style("fill", "gold");
        })
        .on("mouseout", function(d,i){
            self = g2.select(".bs" + i)
            self.style("fill", self.classed("selected") ? "gold" : "none");
        })
        .on("click", function(d,i) {
            if ( g2.select(".bs" + i).classed("selected") ) {
              g2.select(".selected")
                  .classed("selected", false)
                  .style("fill", "none");
            } else {
              g2.select(".selected")
                  .classed("selected", false)
                  .style("fill", "none");
              g2.select(".bs" + i)
                  .attr("class", "bs " + "bs" + i + " selected");
            }
        });
    

    // box 3

    c3.scale
        .domain([0,d3.max(data, function(d) { return d.total })]);

    // back squares 
    g3.append("g").selectAll(".br")
        .data(data)
      .enter()
        .append("rect")
        .attr({ "x": 0, "y": -4, "width": width, "height": 25 })
        .attr("class",function(d,i) { return "br " + "br" + i  })
        .style("fill", "none")
        .attr("transform", function(d,i) {
          return "translate(0," + ( i * 25 ) + ")";
        });

    c3.rects = g3.selectAll(".rects")
        .data(data);
    
    c3.rects.enter().append("rect")
        .attr("transform", function(d,i) {
          return "translate(0," + ( i * 25 ) + ")";
        })
        .attr("x", 0)
        .attr("y", 5)
        .attr("class", "rects")
        .attr("width", function(d) { return c3.scale(d.total); })
        .attr("height", 5);

    c3.rectsRatio = g3.selectAll(".rects-ratio")
        .data(data);
    
    c3.rectsRatio.enter().append("rect")
        .attr("transform", function(d,i) {
          return "translate(0," + ( i * 25 ) + ")";
        })
        .attr("x", 0)
        .attr("y", 5)
        .attr("class", "rects-ratio")
        .attr("width", function(d) { return c3.scale(d.total * d.ratio); })
        .attr("height", 5);

    c3.partners = g3.selectAll(".legend")
        .data(data)
      .enter();
    
    c3.partners.append("text")
        .text(function(d) { return d.partner; })
        .attr({ "x": 0, "y": 0 })
        .attr("transform", function(d,i) {
          return "translate(0," + ( i * 25 ) + ")";
        })
        .attr("dy", 4)
        .attr("class", "legend");

    c3.partners.append("text")
        .text(function(d) { return d.total; })
        .attr({ "x": width, "y": 0 })
        .attr("transform", function(d,i) {
          return "translate(0," + ( i * 25 ) + ")";
        })
        .attr("dy", 4)
        .attr("dx", -25)
        .attr("class", "total");
    
    c3.textRatio = g3.selectAll(".text-ratio")
        .data(data);
    
    c3.textRatio.enter().append("text")
        .attr("class", "text-ratio")
        .attr("transform", function(d,i) {
          return "translate(0," + ( i * 25 ) + ")";
        })
        .text(function(d) { return Math.floor(d.total * d.ratio); })
        .attr({ "x": width, "y": 0 })
        .attr("dy", 4)
        .style("text-anchor", "end");

    // front squares
    g3.append("g").selectAll(".fr")
        .data(data)
      .enter()
        .append("rect")
        .attr("transform", function(d,i) {
          return "translate(0," + ( i * 25 ) + ")";
        })
        .attr({ "x": 0, "y": -4, "width": width, "height": 25 })
        .attr("class",function(d,i) { return "fr " + "fr" + i  })
        .on("mouseover", function(d,i) {
            g3.select(".br" + i)
                .style("fill", "gold");
        })
        .on("mouseout", function(d,i){
            self = g3.select(".br" + i)
            self.style("fill", self.classed("selected") ? "gold" : "none");
        })
        .on("click", function(d,i) {
            if ( g3.select(".br" + i).classed("selected") ) {
              g3.select(".selected")
                  .classed("selected", false)
                  .style("fill", "none");
            } else {
              g3.select(".selected")
                  .classed("selected", false)
                  .style("fill", "none");
              g3.select(".br" + i)
                  .attr("class", "br " + "br" + i + " selected");
            }
        });  
    
    // box 4
    
    var resize = d3.scale.linear()
        .domain(d3.extent(data,function(d){ return d.total; }))
        .range([0.2,1.3]);

    var sel_b = back.selectAll(".back1")
        .data(data);
    
    sel_b.enter().append("path")
        .attr("d",function(d,i){
          return path(L,resize(d.total));
        })
        .attr("transform",function(d,i){
          return "rotate("+angles[i]+")";
        })
        /*.style("fill","url(#diagonalHatchCase4)")*/
        .attr("class","back1 nma-back");

    var sel_f = front.selectAll(".front1")
        .data(data);
    
    sel_f.enter().append("path")
        .attr("d",function(d,i){
          return path(L,resize(d.total)*d.ratio);
        })
        .attr("transform",function(d,i){
          return "rotate("+angles[i]+")";
        })
        .attr("class","front1 nma-front")
        .style("fill",function(d,i){ return colors[i]; });
    
    sel_f.transition().duration(1000)
        .attr("d",function(d,i){
          return path(L,resize(d.total)*d.ratio);
        });

  }


  // Update /////////////////////////////////////////////////////////
  
  var update = function(data) {
    
    // box 1

    var rects = c1.bars.selectAll(".rect1")
        .data(data);
        /*.attr("transform","translate(20,0)");*/
    
    rects.transition().duration(1000)
        .attr("x", function(d) { return c1.xScale(d.year); })
        .attr("y", function(d) { return c1.yScale(d.total * d.ratio); })
        .attr("width", (c1.xScale.range()[1] - c1.xScale.range()[0]) + "px")
        .attr("height", function(d) {
          return height / 2 - c1.yScale(d.total * d.ratio);
        });

    c1.selection = c1.legend.selectAll(".selection")
        .data(data);
    
    c1.selection
      .transition()
        .duration(700)
        .ease("linear")
        .tween("text", function(d) {
            var i = d3.interpolate(this.textContent, Math.floor(d.total * d.ratio));
            return function(t) {
              this.textContent = Math.round(i(t));
            };
         });
    
    // box 2 ///////////////////////////////////////////////////////////
    
    c2.squaresRatio = g2.selectAll(".squares-ratio")
        .data(data);

    c2.squaresRatio.transition()
        .duration(1000)
        .attr("y", function(d) {
          return c2.side * 0.6 - c2.scale(Math.sqrt(d.total * d.ratio));
        })
        .attr("width", function(d) {
          return c2.scale(Math.sqrt(d.total * d.ratio));
        })
        .attr("height", function(d) {
          return c2.scale(Math.sqrt(d.total * d.ratio));
        });    
    
    c2.textRatio = g2.selectAll(".text-ratio")
        .data(data);
    
    c2.textRatio.transition()
        .duration(700)
        .ease("linear")
        .tween("text", function(d) {
            var i = d3.interpolate(this.textContent, Math.floor(d.total * d.ratio));
            return function(t) {
              this.textContent = Math.round(i(t));
            };
         });

    // box 3

    c3.rectsRatio = g3.selectAll(".rects-ratio")
        .data(data);

    c3.rectsRatio.transition()
        .duration(1000)
        .attr("width", function(d) { return c3.scale(d.total * d.ratio); });
    
    c3.textRatio = g3.selectAll(".text-ratio")
        .data(data);
    
    c3.textRatio.transition()
        .duration(700)
        .ease("linear")
        .tween("text", function(d) {
            var i = d3.interpolate(this.textContent, Math.floor(d.total * d.ratio));
            return function(t) {
              this.textContent = Math.round(i(t));
            };
         });  

  }


  firstRun(getRandomData());
  
  //update(getRandomData());

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
  }

  function getRandomData() {
    return [
      {
        "year": "2006",
        "total": 100,
        "ratio": getRandomArbitrary(0.3, 0.9),
        "partner": "Fraunhofer Gesellschaft zur Förderung angewandter Forschung e. V.",
        "theme": "environment"
      },
      {
        "year": "2007",
        "total": 93,
        "ratio": getRandomArbitrary(0.3, 0.9),
        "partner": "The Chancellor, Masters, And Scholars Of The University Of Cambridge",
        "theme": "environment"
      },
      {
        "year": "2008",
        "total": 75,
        "ratio": getRandomArbitrary(0.3, 0.9),
        "partner": "Fraunhofer Gesellschaft zur Förderung angewandter Forschung e. V.",
        "theme": "environment"
      },
      {
        "year": "2009",
        "total": 47,
        "ratio": getRandomArbitrary(0.3, 0.9),
        "partner": "Fraunhofer Gesellschaft zur Förderung angewandter Forschung e. V.",
        "theme": "environment"
      },
      {
        "year": "2010",
        "total": 100,
        "ratio": getRandomArbitrary(0.3, 0.9),
        "partner": "Fraunhofer Gesellschaft zur Förderung angewandter Forschung e. V.",
        "theme": "environment"
      },
      {
        "year": "2011",
        "total": 25,
        "ratio": getRandomArbitrary(0.3, 0.9),
        "partner": "Fraunhofer Gesellschaft zur Förderung angewandter Forschung e. V.",
        "theme": "environment"
      },
      {
        "year": "2012",
        "total": 17,
        "ratio": getRandomArbitrary(0.3, 0.9),
        "partner": "Fraunhofer Gesellschaft zur Förderung angewandter Forschung e. V.",
        "theme": "environment"
      },
      {
        "year": "2013",
        "total": 10,
        "ratio": getRandomArbitrary(0.3, 0.9),
        "partner": "Fraunhofer Gesellschaft zur Förderung angewandter Forschung e. V.",
        "theme": "environment"
      },
      {
        "year": "2014",
        "total": 7,
        "ratio": getRandomArbitrary(0.3, 0.9),
        "partner": "Fraunhofer Gesellschaft zur Förderung angewandter Forschung e. V.",
        "theme": "environment"
      }
    ];
  }
  
  /*
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
  }*/

  // Responsiveness
  // resize("case4SVG");
  

})()