(function() {
  // D3js chart
  var width = 500;
  var height = 500;

  var svg = d3.select("#case3").append("svg")
      .attr("id", "chartCase3")
      .attr("viewBox", "0 0 100 100")          // make it
      .attr("preserveAspectRatio", "xMidYMid") // responsive
      .attr("width", width)
      .attr("height", height)
    .append("g");

  var go = false;
  var buttons = svg.append("g").attr("transform","translate(80,90)");
  buttons.append("rect")
      .attr({
        "x":-15,
        "y":-1,
        "height":6,
        "width":28,
        "rx":2,
        "ry":2
      })
      .style({
        "fill":"#eee",
        "fill-opacity":"0.5"
      });
  var text = buttons.append("g").attr("transform","translate(-13,3.2)");
  text.append("text")
      .text(function(){ return conv(0)+":"+conv(0); })
      .style({
        "fill":"#131313",
        "font-size":"3px",
        "font-weight":"700",
        "font-family":"Lato"
      });
  var play = buttons.append("path")
      .attr("id","play-c3")
      .attr("d","M 0 0 L 0 4 L 3.16 2 Z")
      .style({
        "fill":"#131313"
      })
      .on("click",function(){
        go = true;
        self = d3.select(this);
        self.style("fill",function(){ return go ? "#D8A800" : "#131313"; })
        d3.select("#pause-c3").selectAll("path").style("fill","#131313");
      });
  var pause = buttons.append("g").attr("transform","translate(8,0.5)")
      .attr("id","pause-c3")
      .on("click",function(){
        go = false;
        self = d3.select(this);
        self.selectAll("path").style("fill",function(){ return go ? "#131313" : "#D8A800"; })
        d3.select("#play-c3").style("fill","#131313");
      });
  pause.append("path")
      .attr("d","M 0 0 L 0 3 L 1.2 3 L 1.2 0 Z")
      .style({
        "fill":"#D8A800"
      });
  pause.append("path")
      .attr("d","M 1.8 0 L 1.8 3 L 3 3 L 3 0 Z")
      .style({
        "fill":"#D8A800"
      });
  pause.append("path")
      .attr("d","M 0 0 L 0 3 L 3 3 L 3 0 Z")
      .style({
        "fill":"#D8A800",
        "fill-opacity":"0"
      });


  /// background grid  

  /*var grid = svg.append("g")
    .attr("transform","scale(1)");

  var mkCell = function(i) {
    var path = drawPath(i,"A");
    return grid.append("path")
            .attr("class", "back-grid")
            .attr("d", path);
  };

  for (var i = 0; i < 10000; i++) {
    mkCell(i);
  }*/

  ///

  //var gridA = svg.append("g")
  //  .attr("transform","scale(1)");
  var gridD = svg.append("g")
    .attr("transform","translate(-5,5) scale(0.9)");

  function drawPath(cell, mat) {
    var x = cell % 100,
        y = 99 - Math.floor(cell / 100),
        e = 0.1;
    if (mat == "A") {
      var path = "M " + (x+e) + " " + (y+e) +
                 " L " + (x+1-e) + " " + (y+e) +
                 " L " + (x+1-e) + " " + (y+1-e) +
                 " L " + (x+e) + " " + (y+1-e) + " Z";
    } else {
      var path = "M " + (x+e) + " " + (y+e) +
                 " L " + (x+1-e) + " " + (y+e) +
                 " L " + (x+1-e) + " " + (y+1-e) +
                 " L " + (x+e) + " " + (y+1-e) + " Z";
    }
    return path;
  }

  function styleCell(mat) {
    if (mat == "A") {
      var res = "on-cell-A"
    } else {
      var res = "on-cell-D"
    };
    return res
  }
  
  d3.json("./data/data-case3.json", function(error, data) {
    
    // D3js chart
    function update(dtdata,grid,mat) {

      var cells = grid.selectAll("path")
          .data(dtdata, function(d) { return d; });

      cells.enter().append("path")
          //.attr("class", styleCell(mat))
          .style({
            "fill":"#131313"
            //"fill":"#CF000F"
            //"fill":"#D8A800"
          })
          .attr("d", function(d) {
            return drawPath(d,mat);
          });

      cells.exit().remove();
          //.attr("class","off-cell");

    }

    var snapshot = 0;
    //update(data["D"][60], gridD, "D")
    
    // draw first snapshot
    go = true;
    update(data["D"][snapshot], gridD, "D");
    go = false;
    
    var run = setInterval(function() {
      //update(data["A"][snapshot], gridA, "A")
      if (go) {
        update(data["D"][snapshot], gridD, "D");
        snapshot += 1;
        if (snapshot === 144) {
          snapshot = 0;
          //clearInterval(run);
        }
        buttons.select("text")
            .text(function(){
              var hh = Math.floor(snapshot * 10/60);
              var mm = (snapshot * 10) % 60
              return conv(hh)+":"+conv(mm); 
            })
      }
    }, 300);
  });
  
  function conv(i) {
    return i < 10 ? "0"+i : +i;
  }


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
  resize("chartCase3");

})()