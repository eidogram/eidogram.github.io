var root;

root = typeof this !== "undefined" && this !== null ? this : exports;

function geo_success(position) {
  Meteor.clearInterval(run);
  Session.set("position",[position.coords.latitude, position.coords.longitude]);
  
  M_f.toPenta()
  
  /*
  d3.select("#circle1").transition().duration(1000)
      .attr({"cx":"40", "cy":"10"}).style("opacity","1");
  d3.select("#circle2").transition().duration(1000)
      .attr({"cx":"8.45", "cy":"32.92"}).style("opacity","1");
  d3.select("#circle3").transition().duration(1000)
      .attr({"cx":"71.54", "cy":"32.92"}).style("opacity","1");
  d3.select("#circle4").transition().duration(1000)
      .attr({"cx":"40", "cy":"43.17"}).style("opacity","1");
  d3.select("#circle5").transition().duration(1000)
      .attr({"cx":"20.5", "cy":"70"}).style("opacity","1");
  d3.select("#circle6").transition().duration(1000)
      .attr({"cx":"59.5", "cy":"70"}).style("opacity","1");
  */

  //d3.select("#text-message").text("Clicca per registrare").attr("class","record");

  root.map.setView([position.coords.latitude, position.coords.longitude], 13);
  d3.select("#map").transition().duration(1000).style("opacity","1");
}

var run = M_f.loading();

//var run = Meteor.setInterval(loading,100);

function geo_error() {
  alert("Sorry, no position available.");
}

var geo_options = {
  enableHighAccuracy: true, 
  maximumAge        : 30000, 
  timeout           : 27000
};

 Meteor.setTimeout(function() { navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options); }, 5000);