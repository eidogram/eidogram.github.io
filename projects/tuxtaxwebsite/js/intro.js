//Credits: https://gist.github.com/widged/5780720
(function() {

  var margin = {top: 20, right: 20, bottom: 20, left: 20};
  var width = 500 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var mainsvg = d3.select('#intro').append('svg')
      .attr("id","introSVG")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", "0 0 500 500")           // make it
      .attr("preserveAspectRatio", "xMidYMid"); // responsive

  mainsvg.append('defs')
      .append('pattern')
        .attr('id', 'diagonalHatchIntro')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 4)
        .attr('height', 4)
      .append('path')
        .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
        .attr('stroke', '#D8A800')
        //.attr("stroke","a6c0d6")
        .attr('stroke-width', 1);

  var svg = mainsvg.append("g")
      .attr("transform","translate(100,120) scale(1.1)");

  var labels = svg.append("g")
      .style({
        "font-family":"Lato",
        "font-size":"14px",
        "font-weight":"400",
        //"font-style":"italic",
        "fill":"#aaa"
      });
  labels.append("text")
      .text("Analysis")
      .attr("transform","translate(-10,260) rotate(-60)");
  labels.append("text")
      .text("Design")
      .attr("transform","translate(160,0) rotate(60)");
  labels.append("text")
      .text("Development")
      .style("text-anchor","end")
      .attr("transform","translate(300,280) rotate(0)");

  // small triagles
  var L = 20;
  var path = "M -10 5.773502691896256 L 10 5.773502691896256 L 0 -11.547005383792515 Z"
  // --------------

  var w = 300;
  var h = 260;
  var m = 0;
  var colors = ["#313131", "#323232", "#333333", "#343434", "#353535", "#363636"];

  var corners = [[m,h+m], [w+m,h+m], [(w/2)+m,m]]

  corners.forEach(function(corner, idx) { 
    var c1 = idx, c2 = idx + 1; if(c2 >= corners.length) { c2 = 0;}
    svg.append("line")
      .attr("x1", corners[c1][0])
      .attr("y1", corners[c1][1])
      .attr("x2", corners[c2][0])
      .attr("y2", corners[c2][1])
      .style("opacity",function(){ return Math.random() * (1 - 0.2) + 0.2; })
      .style({
        "stroke-width": "0.5px",
        "stroke": "#bbb"
      });
  })

  var ticks = [0,10,20,30,40,50,60,70,80,90,100], n = ticks.length;
  ticks.forEach(function(v) {
    
    var coord1 = coord(v, 0, 100-v);
    var coord2 = coord(v, 100-v, 0);
    var coord3 = coord(0, 100-v, v);
    var coord4 = coord(100-v, 0, v);

    ecoords1 = extend(coord1,coord2);
    ecoords2 = extend(coord2,coord3);
    ecoords3 = extend(coord3,coord4);



    if(v !== 0 && v !== 100) {
    //if(true) {

      svg.append("line")
        .attr("x1", ecoords1[0])
        .attr("y1", ecoords1[1])
        .attr("x2", ecoords1[2])
        .attr("y2", ecoords1[3])
        .style("opacity",function(){ return Math.random() * (1 - 0.2) + 0.2; })
        .style({
          "stroke-width": "0.5px",
          "stroke": "#bbb"
        });

      svg.append("line")
        .attr("x1", ecoords2[0])
        .attr("y1", ecoords2[1])
        .attr("x2", ecoords2[2])
        .attr("y2", ecoords2[3])
        .style("opacity",function(){ return Math.random() * (1 - 0.2) + 0.2; })
        .style({
          "stroke-width": "0.5px",
          "stroke": "#bbb"
        });

      svg.append("line")
        .attr("x1", ecoords3[0])
        .attr("y1", ecoords3[1])
        .attr("x2", ecoords3[2])
        .attr("y2", ecoords3[3])
        .style("opacity",function(){ return Math.random() * (1 - 0.2) + 0.2; })
        .style({
          "stroke-width": "0.5px",
          "stroke": "#bbb"
        });


    }
    
    /*svg.append("text")
      .attr("x", coord1[0] - 15)
             .attr("y", coord1[1]  )
             .text( function (d) { return v; })
             .classed('tick-text tick-a', true);

    svg.append("text")
      .attr("x", coord2[0] - 6)
             .attr("y", coord2[1] + 10 )
             .text( function (d) { return (100- v); })
             .classed('tick-text tick-b', true);

    svg.append("text")
      .attr("x", coord3[0] + 6)
             .attr("y", coord3[1] )
             .text( function (d) { return v; })
             .classed('tick-text tick-c', true);
    */

  })

  /*var angles = svg.selectAll(".angles").data([coord(0, 0, 100), coord(0, 100, 0), coord(100, 0, 0)]);
  angles.enter().append("path")
      .attr("d",path)
      .style({
        "fill":"#eee",
        "stroke-width":"0px"
      })
      .style("opacity",function(){ return Math.random() * (1 - 0.5) + 0.5; })
      .attr("transform",function(d){ return "translate("+d[0]+","+d[1]+") scale(1)"; });*/

  var angles = svg.selectAll(".angles").data([coord(0, 0, 100), coord(0, 100, 0), coord(100, 0, 0)]);
  angles.enter().append("circle")
      .attr("cx",function(d){ return d[0]; })
      .attr("cy",function(d){ return d[1]; })
      .attr("r",2)
      .style({
        "fill":"#bbb",
        "stroke-width":"0px"
      })
      .style("opacity",function(){ return Math.random() * (1 - 0.2) + 0.2; });

  var arc = d3.svg.arc()
    .innerRadius(300)
    .outerRadius(300);

  var circle1 = svg.append("path")
      .datum({startAngle: Math.PI/8, endAngle: Math.PI/3})
      .attr("transform","translate("+coord(100, 0, 0)[0]+","+coord(100, 0, 0)[1]+")")
      .style("opacity",function(){ return Math.random() * (0.8 - 0.4) + 0.4; })
      .style({
        "stroke-width": "0.5px",
        "stroke": "#bbb"
      })
      .attr("d", arc);

  var circle2 = svg.append("path")
      .datum({startAngle: -1*Math.PI/9, endAngle: -1*Math.PI/3.5})
      .attr("transform","translate("+coord(0, 100, 0)[0]+","+coord(0, 100, 0)[1]+")")
      .style("opacity",function(){ return Math.random() * (0.8 - 0.4) + 0.4; })
      .style({
        "stroke-width": "0.5px",
        "stroke": "#bbb"
      })
      .attr("d", arc);

  var dots = svg.selectAll(".dots").data([coord(10, 20, 70), coord(20, 30, 50), coord(40, 20, 40), coord(20, 70, 10)]);
  var dotg = dots.enter().append("g")
      .attr("transform",function(d){ return "translate("+d[0]+","+d[1]+") rotate("+(Math.random()*360)+") scale(0.7)"; });
  var dotgg = dotg.append("g");
  var dotb = dotgg.append("path")
      .attr("d",path)
      .attr("id",function(d,i){ return "dotb"+i; })
      .style("fill", "url(#diagonalHatchIntro)")
      .style({
        "stroke-width":"0px",
      })
      .attr("transform","scale(0)");  
  var dot = dotgg.append("path")
      .attr("d",path)
      .attr("id",function(d,i){ return "dot"+i; })
      .style("fill", function() { return colors[Math.floor(Math.random() * colors.length)]; })
      .style({
        "stroke-width":"0px",
      })
      //.attr("transform",function(d){ return "translate("+d[0]+","+d[1]+") scale(0.7)"; })
      .on("mouseover",function(d,i){
        d3.select("#dotb"+i).attr("transform","scale(2)");
        var doc = document.getElementById("introSVG");
        doc.pauseAnimations();
        //var self =  d3.select(this);
      })
      .on("mouseout",function(d,i){
        d3.select("#dotb"+i).attr("transform","scale(0)");
        var doc = document.getElementById("introSVG");
        doc.unpauseAnimations();
        //var self =  d3.select(this);
      });
    dotgg.append("animateTransform")
        .attr("class","animate")
        .attr({
            "attributeName":"transform",
            "attributeType":"XML",
            "type":"rotate",
            "from":"0 0 0",
            "to":"360 0 0",
            "dur":"10s",
            "repeatCount":"indefinite"
        });


  /*
  var circles = svg.selectAll("circle").data([coord(10, 20, 70), coord(20, 30, 50), coord(40, 20, 40), coord(20, 80, 0)]);

  circles.enter().append("circle")
    .attr("cx", function (d) { return d[0]; })
    .attr("cy", function (d) { return d[1]; })
    .attr("r", 6);
  
  */

  //var intervalID = window.setInterval(animate, 1000);

  function animate() {
    svg.selectAll("line")
        .transition().duration(900)
        .style("opacity",function(){ return Math.random() * (1 - 0.2) + 0.2;; });
    angles.transition().duration(900)
        .style("opacity",function(){ return Math.random() * (1 - 0.2) + 0.2;; });
    svg.selectAll(".arc")
        .transition().duration(900)
        .style("opacity",function(){ return Math.random() * (0.8 - 0.4) + 0.4;; });
    /*dots.transition().duration(900)
        .style("opacity",function(){ return Math.random() * (1 - 0.8) + 0.8;; });*/

  }

  function coord(a, b, c){
    var sum, pos = [0,0];
      sum = a + b + c;
      if(sum !== 0) {
        a /= sum;
        b /= sum;
        c /= sum;

      pos[0] =  corners[0][0]  * a + corners[1][0]  * b + corners[2][0]  * c;
      pos[1] =  corners[0][1]  * a + corners[1][1]  * b + corners[2][1]  * c;
    }
      return pos;
  }
  
  function scale(/* point */ p, factor) {
      return [p[0] * factor, p[1] * factor];
  }

  function extend(coordsA, coordsB) {
    var x1 = coordsA[0],
        y1 = coordsA[1],
        x2 = coordsB[0],
        y2 = coordsB[1],
        m = (y2 - y1)/(x2-x1),
        q = y2 - m * x2,
        delta = 20,
        x1d = x1 <= x2 ? x1 - Math.random() * delta : x1 + Math.random() * delta,
        x2d = x1 <= x2 ? x2 + Math.random() * delta : x2 - Math.random() * delta,
        y1d = m * x1d + q,
        y2d = m * x2d + q;
    return [x1d,y1d,x2d,y2d];
  }

  function Pause()
  {
     svg.pauseAnimations();
  };




})()