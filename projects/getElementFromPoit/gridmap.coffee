root = exports ? this
root.gridmap = () ->

  # ---- Default Values ------------------------------------------------

  projection = undefined
  side = 10 #side of the cell in pixel
  key = "id"
  grid = d3.map()
  data = undefined
  features = undefined
  width = 500
  height = 500
  isabsolute = undefined

  # --------------------------------------------------------------------

  chart = (selection) ->

    w = width
    h = height
        
    # Using `document.elementFromPoint` the specified point must be
    # inside the visible bounds of the document
    backup = {
      "position": selection.style("position")
      "top": selection.style("top")
      "left": selection.style("left")
      "opacity": selection.style("opacity")
    }
    selection.style({
      "position": "fixed"
      "top": 0
      "left": 0
      "opacity": 0
    })

    projection.translate([w / 2, h / 2]);
    path = d3.geo.path()
      .projection(projection)

    area = d3.map()
    centroid = d3.map()
    for f in features
      area.set(f[key], path.area(f) / (w * h))
      c = path.centroid(f)
      if c then centroid.set(f[key], c)

    radius = d3.scale.linear()
      .range([0, side / 2 * 0.9])

    svg = selection.append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("viewBox", "0 0 "+w+" "+h)

    map = svg.append("g")
    map.attr("class", "counties")
      .selectAll("path")
        .data(features)
      .enter().append("path")
        .style("fill","#000")
        .style("fill-opacity",0)
        .attr("data-key", (d) -> d[key] )
        .attr("d", path)

    matrix = map.node().getScreenCTM()
    dy = matrix.f
    dx = matrix.e
    nx = Math.floor(w / side)
    ny = Math.floor(h / side)
    if grid.size() is 0
      for i in [0..nx-1]
        for j in [0..ny-1]
          x = side * i + side / 2
          y = side * j + side / 2
          element = document.elementFromPoint(x + dx,y + dy)
          if element
            attr = element.getAttribute("data-key")
            if attr
              centroid.remove(attr)
              value = [attr]
            else value = []
          else value = []
          grid.set(i+","+j, {keys: value, x: x, y: y})

    # add not hitted features to the nearest cell
    centroid.forEach((k,v) ->
      i = Math.floor(v[0] / side)
      j = Math.floor(v[1] / side)
      try
        grid.get(i+","+j).keys.push(k)
    )

    density = (a) ->
      if isabsolute
      then num = d3.sum((data.get(j) for j in a))
      else num = d3.sum((data.get(j) * area.get(j) for j in a))
      den = d3.sum((area.get(j) for j in a))
      if den then num / den else 0

    dataGrid = ( { value: density(k.keys), x: k.x, y: k.y } for k in grid.values() when k.keys.length)
    dots = map.selectAll(".gridmap")
        .data(dataGrid)
    #enter
    radius.domain([0, d3.max(dataGrid, (d) -> Math.sqrt(d.value))])
    dots.enter().append("circle")
        .attr("class","gridmap")
        .attr("cx", (d) -> d.x)
        .attr("cy", (d) -> d.y)
        .attr("r", (d) -> radius(Math.sqrt(d.value)))
        .style("fill","#131313")

    #update


    selection.style(backup)



  # ---- Getter/Setter Methods -----------------------------------------

  chart.width = (_) ->
    if not arguments.length
      width
    else
      width = _
      chart

  chart.height = (_) ->
    if not arguments.length
      height
    else
      height = _
      chart

  chart.side = (_) ->
    if not arguments.length
      side
    else
      side = _
      chart

  chart.key = (_) ->
    if not arguments.length
      key
    else
      key = _
      chart

  chart.data = (_) ->
      data = _
      chart

  chart.isabsolute = (_) ->
      isabsolute = _
      chart

  chart.features = (_) ->
      features = _
      chart

  chart.projection = (_) ->
      projection = _
      chart 

  # --------------------------------------------------------------------
  
  chart