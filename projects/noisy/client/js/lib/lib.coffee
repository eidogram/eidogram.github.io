root = this ? exports

root.M_f = {

  toPenta: ->
      d3.select("#circle1").transition().duration(1000)
          .attr({"cx":"40", "cy":"10"}).style("opacity","1")
      d3.select("#circle2").transition().duration(1000)
          .attr({"cx":"8.45", "cy":"32.92"}).style("opacity","1")
      d3.select("#circle3").transition().duration(1000)
          .attr({"cx":"71.54", "cy":"32.92"}).style("opacity","1")
      d3.select("#circle4").transition().duration(1000)
          .attr({"cx":"40", "cy":"43.17"}).style("opacity","1")
      d3.select("#circle5").transition().duration(1000)
          .attr({"cx":"20.5", "cy":"70"}).style("opacity","1")
      d3.select("#circle6").transition().duration(1000)
          .attr({"cx":"59.5", "cy":"70"}).style("opacity","1")

  toTria: ->
      d3.select("#circle1").transition().duration(1000)
          .attr({"cx":"10", "cy":"10"}).style("opacity","1")
      d3.select("#circle2").transition().duration(1000)
          .attr({"cx":"40", "cy":"25"}).style("opacity","1")
      d3.select("#circle3").transition().duration(1000)
          .attr({"cx":"10", "cy":"40"}).style("opacity","1")
      d3.select("#circle4").transition().duration(1000)
          .attr({"cx":"40", "cy":"55"}).style("opacity","1")
      d3.select("#circle5").transition().duration(1000)
          .attr({"cx":"70", "cy":"40"}).style("opacity","1")
      d3.select("#circle6").transition().duration(1000)
          .attr({"cx":"10", "cy":"70"}).style("opacity","1")

  toUp: ->
      d3.select("#circle1").transition().duration(1000)
          .attr({"cx":"35", "cy":"10"}).style("opacity","1")
      d3.select("#circle2").transition().duration(1000)
          .attr({"cx":"35", "cy":"35"}).style("opacity","1")
      d3.select("#circle3").transition().duration(1000)
          .attr({"cx":"10", "cy":"10"}).style("opacity","1")
      d3.select("#circle4").transition().duration(1000)
          .attr({"cx":"10", "cy":"35"}).style("opacity","1")
      d3.select("#circle5").transition().duration(1000)
          .attr({"cx":"52.5", "cy":"52.5"}).style("opacity","1")
      d3.select("#circle6").transition().duration(1000)
          .attr({"cx":"70", "cy":"70"}).style("opacity","1")

  toDown: ->
      d3.select("#circle1").transition().duration(1000)
          .attr({"cx":"10", "cy":"10"}).style("opacity","1")
      d3.select("#circle2").transition().duration(1000)
          .attr({"cx":"70", "cy":"70"}).style("opacity","1")
      d3.select("#circle3").transition().duration(1000)
          .attr({"cx":"70", "cy":"45"}).style("opacity","1")
      d3.select("#circle4").transition().duration(1000)
          .attr({"cx":"27.5", "cy":"27.5"}).style("opacity","1")
      d3.select("#circle5").transition().duration(1000)
          .attr({"cx":"45", "cy":"45"}).style("opacity","1")
      d3.select("#circle6").transition().duration(1000)
          .attr({"cx":"45", "cy":"70"}).style("opacity","1")
        

  toMap: ->
      d3.select("#circle1").transition().duration(1000)
          .attr({"cx":"40", "cy":"10"}).style("opacity","1")
      d3.select("#circle2").transition().duration(1000)
          .attr({"cx":"10", "cy":"40"}).style("opacity","1")
      d3.select("#circle3").transition().duration(1000)
          .attr({"cx":"40", "cy":"40"}).style("opacity","1")
      d3.select("#circle4").transition().duration(1000)
          .attr({"cx":"70", "cy":"40"}).style("opacity","1")
      d3.select("#circle5").transition().duration(1000)
          .attr({"cx":"40", "cy":"70"}).style("opacity","1")
      d3.select("#circle6").transition().duration(1000)
          .attr({"cx":"70", "cy":"70"}).style("opacity","1")



  loading: ->  Meteor.setInterval(() ->
        x = d3.select("#circle" + Math.floor(Math.random() * 6 + 1))
        x.transition().duration(300).style("opacity","0.3")
        x.transition().duration(300).delay(310).style("opacity","1")
      ,200)

}


