(function () {

  var margin = {top: 40, right: 40, bottom: 40, left: 40},
      width = 500 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var svg = d3.select("#case4").append("svg")
      .attr("id","case4SVG")
      .attr("viewBox", "0 0 500 600")          // make it
      .attr("preserveAspectRatio", "xMidYMid")  // responsive
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    //.append("g")
    //  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg
    .append('defs')
    .append('pattern')
      .attr('id', 'diagonalHatchCase4')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)
    .append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', '#fff')
      //.attr('stroke', 'rgb(83, 83, 83)')
      .attr('stroke-width', 1);

  var button = svg.append("g")
      .attr("transform","translate(185,540)");
  /*button.append("rect")
      .attr("id","shadow")
      .attr({
        "x":"1",
        "y":"1",
        "height":"40",
        "width":"130",
        "rx":"10",
        "ry":"10"
      })
      .style({
        "fill":"#bbb"
      });*/
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
    //self.select("text").style("fill","#861200");
  });
  button.on("mouseout",function(){
    var self = d3.select(this);
    self.select("rect").style("fill","#eee");
    //self.select("text").style("fill","#B84100");
  });
  button.on("click",function(){
    var data = getRandomData();
    update(data);
  });

  var tan = Math.tan(Math.PI/6);

  var pathR = function (L,s) {
    return "M 0 0 L 0 "+(s*L/2*tan)+" L "+(s*L/2)+" "+(s*L/2*tan)+" Z";
  }

  var pathL = function (L,s) {
    return "M 0 0 L 0 "+(s*L/2*tan)+" L "+(-1*s*L/2)+" "+(s*L/2*tan)+" Z";
  }

  var L = 200; // side length

  //var c = ["#786000","#D8A800","#909000"];
  var c = ["#CB8C1F","#B84100","#861200"];
  var colors = [c[0],c[1],c[2],c[0],c[1],c[2]];
  var angles = [0,0,120,120,-120,-120];

  var back = svg.append("g").attr("transform","translate(250, 130)");
  var backLines = svg.append("g").attr("transform","translate(250, 130)");
  var front = svg.append("g").attr("transform","translate(250, 130)");
  var back1 = svg.append("g").attr("transform","translate(250, 400)");
  var back1Lines = svg.append("g").attr("transform","translate(250, 400)");
  var front1 = svg.append("g").attr("transform","translate(250, 400)");

  var update = function(data) {
    
    back.selectAll(".back")
        .data(data)
      .enter().append("path")
        .attr("class","back nma-back")
        .attr("d",function(d,i){
          return isOdd(i) ? pathR(L,1) : pathL(L,1);
        })
        .attr("transform",function(d,i){
          return "rotate("+angles[i]+")";
        })
        .style("fill",function(d,i){ return colors[i]; });
    
    backLines.selectAll(".backlines")
        .data(data)
      .enter().append("path")
        .attr("d",function(d,i){
          return isOdd(i) ? pathR(L,1) : pathL(L,1);
        })
        .attr("transform",function(d,i){
          return "rotate("+angles[i]+")";
        })
        .attr("class","backlines nma-back")
        .style("fill","url(#diagonalHatchCase4)");

    var sel = front.selectAll(".front")
        .data(data);
    sel.enter().append("path")
        .attr("d",function(d,i){
          return isOdd(i) ? pathR(L,d.ratio) : pathL(L,d.ratio);
        })
        .attr("transform",function(d,i){
          return "rotate("+angles[i]+")";
        })
        .attr("class","front nma-front")
        .style("fill",function(d,i){ return colors[i]; });
    sel.transition().duration(1000)
        .attr("d",function(d,i){
          return isOdd(i) ? pathR(L,d.ratio) : pathL(L,d.ratio);
        });


    var resize = d3.scale.linear()
        .domain(d3.extent(data,function(d){ return d.total; }))
        .range([0.8,1.3]);

    
    var sel1b = back1.selectAll(".back1")
        .data(data);
    sel1b.enter().append("path")
        .attr("d",function(d,i){
          return isOdd(i) ? pathR(L,resize(d.total)) : pathL(L,resize(d.total));
        })
        .attr("transform",function(d,i){
          return "rotate("+angles[i]+")";
        })
        .attr("class","back1 nma-back")
        .style("fill",function(d,i){ return colors[i]; });
    sel1b.transition().duration(1000)
        .attr("d",function(d,i){
          return isOdd(i) ? pathR(L,resize(d.total)) : pathL(L,resize(d.total));
        });


    var sel1bl = back1Lines.selectAll(".backlines1")
        .data(data);
    sel1bl.enter().append("path")
        .attr("d",function(d,i){
          return isOdd(i) ? pathR(L,resize(d.total)) : pathL(L,resize(d.total));
        })
        .attr("transform",function(d,i){
          return "rotate("+angles[i]+")";
        })
        .attr("class","backlines1 nma-back")
        .style("fill","url(#diagonalHatchCase4)");
    sel1bl.transition().duration(1000)
        .attr("d",function(d,i){
          return isOdd(i) ? pathR(L,resize(d.total)) : pathL(L,resize(d.total));
        });        

    var sel1f = front1.selectAll(".front1")
        .data(data);
    sel1f.enter().append("path")
        .attr("d",function(d,i){
          return isOdd(i) ? pathR(L,resize(d.total)*d.ratio) : pathL(L,resize(d.total)*d.ratio);
        })
        .attr("transform",function(d,i){
          return "rotate("+angles[i]+")";
        })
        .attr("class","front1 nma-front")
        .style("fill",function(d,i){ return colors[i]; });
    sel1f.transition().duration(1000)
        .attr("d",function(d,i){
          return isOdd(i) ? pathR(L,resize(d.total)*d.ratio) : pathL(L,resize(d.total)*d.ratio);
        });

  }

  update(getRandomData());

  function isOdd(n) {
    return n % 2 ? true : false;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
  }

  function getRandomData() {
    return [
      {
        "total": getRandomInt(60, 100),
        "ratio": getRandomArbitrary(0.3, 0.9)
      },
      {
        "total": getRandomInt(60, 100),
        "ratio": getRandomArbitrary(0.3, 0.9)
      },
      {
        "total": getRandomInt(60, 100),
        "ratio": getRandomArbitrary(0.3, 0.9)
      },
      {
        "total": getRandomInt(60, 100),
        "ratio": getRandomArbitrary(0.3, 0.9)
      },
      {
        "total": getRandomInt(60, 100),
        "ratio": getRandomArbitrary(0.3, 0.9)
      },
      {
        "total": getRandomInt(60, 100),
        "ratio": getRandomArbitrary(0.3, 0.9)
      }
    ];
  }


})()