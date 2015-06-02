window.K = {}

# MAP

K.italyProv = () ->

  width = 250
  height = 400
  topoJsonFile = ""
  scale = 4000
  data = d3.map()
  cssclass = ""
  colorScale = () ->
  future = false

  chart = (selection) ->

    w = width
    h = height

    projection = d3.geo.albers()
        .center [0, 42]
        .rotate [347, 0]
        .parallels [35, 45]
        .scale scale
        .translate [w / 2, h / 2]

    path = d3.geo.path()
        .projection projection

    d3.json topoJsonFile, (error, it) ->

      subunits = topojson.feature it, it.objects.sub

      svg = selection.insert("svg", ":first-child")
          .attr "viewBox", "0 0 " + w + " " + h
          .attr "preserveAspectRatio", "xMidYMid"
          .attr "width", w
          .attr "height", h

      tt = textures.lines()
        .size 4
        .strokeWidth 1
        .stroke "#ccc"
        .background "whitesmoke"
      svg.call tt

      ttfut = textures.lines()
        .size 4
        .strokeWidth 1
        .stroke "#ccc"
      svg.call ttfut

      svg.append("path")
        .datum(topojson.mesh(it, it.objects.sub, (a, b) -> a is b ))
        .attr "d", path
        .style
          "stroke-width": "10px"
          "stroke": do () -> if future then ttfut.url() else tt.url()

      map = svg
          .append "g"

      map.selectAll("path")
          .data topojson.feature(it, it.objects.sub).features
        .enter().append "path"
          .attr "d", path
          .attr "class", (d) ->
            cssclass + " " + colorScale(
              try data.get(d.id)["tasso"]
              catch e then d3.select(this).style "fill", tt.url()
            )
          .on "mouseover", (d) ->
            selection.select(".tasso").text( try data.get(d.id)["tasso"] )
            selection.select(".provincia").text(try data.get(d.id)["provincia"])
            d3.select(this).classed("focus", true)
          .on "mouseout", try (d) ->
            d3.select(this).classed("focus", false)

      selection.select(".anno").text( data.get("1")["anno"] )
      selection.select(".scenario").text( do () ->
        s = data.get("1")["scenario"]
        if s != "baseline" then (" " + s) else ""
      )
      selection.select(".etichetta").text( do () ->
        s = data.get("1")["etichetta"]
        if s == "short"
          "(short term)"
        else if s == "long"
          "(long term)"
      )
      selection.select(".inquinante").text( data.get("1")["inquinante"] )
      m = data.values().reduce ((p, v) -> if v.tasso > p.tasso then v else p)
      selection.select(".provincia").text( m.provincia )
      selection.select(".tasso").text( m.tasso )

  # ---- Getter/Setter Methods -----------------------------------------

  chart.width = (_) ->
    width = _
    chart

  chart.height = (_) ->
    height = _
    chart

  chart.topoJsonFile = (_) ->
    topoJsonFile = _
    chart

  chart.scale = (_) ->
    scale = _
    chart

  chart.data = (_) ->
    data = _
    chart

  chart.cssclass = (_) ->
    cssclass = _
    chart

  chart.colorScale = (_) ->
    colorScale = _
    chart

  chart.future = (_) ->
    future = _
    chart

  chart

# CIRLCES MATRIX

K.circle = () ->

  datum = 0
  width = 150
  height = 150
  radiusScale = undefined
  baseline = undefined
  baselinecle = undefined

  chart = (selection) ->

    d = datum

    w = width
    h = height

    svg = selection.append("svg")
        .attr "viewBox", "0 0 " + w + " " + h
        .attr "preserveAspectRatio", "xMidYMid"
        .attr "width", w
        .attr "height", h

    col = (a) ->
      if a == "Italia"
        "whitesmoke"
      else if a in ["Nord", "Centro", "Sud e Isole"]
        "orangered"
      else if a in ["Urbano", "Non Urbano"]
        "darkorange"
    tt = textures.lines()
      .size 4
      .strokeWidth 1
      .stroke col(d.area)
      .background "#2f2f2f"
    svg.call tt

    delta = 10
    svg.append("line")
      .attr
        "x1": 0 + delta
        "x2": h - delta
        "y1": w / 2
        "y2": w / 2
      .attr "class", "single-circle-line"
      .style
        "stroke-dasharray": "3, 3"
        "shape-rendering": "crispEdges"
    svg.append("line")
      .attr
        "x1": h / 2
        "x2": h / 2
        "y1": 0 + delta
        "y2": w - delta
      .attr "class", "single-circle-line"
      .style
        "stroke-dasharray": "3, 3"
        "shape-rendering": "crispEdges"

    if baselinecle
      svg.append("circle")
        .attr
          "r": radiusScale(baselinecle.mesi)
          "cx": w / 2
          "cy": h / 2
        .attr "class", "single-circle cle"
        .style
          #"fill": col(d.area)
          "fill": tt.url()

    svg.append("circle")
      .attr
        "r": radiusScale(d.mesi)
        "cx": w / 2
        "cy": h / 2
      .attr "class", "single-circle"
      .style
        "fill": tt.url()

    svg.append("circle")
      .attr
        "r": radiusScale(baseline.mesi)
        "cx": w / 2
        "cy": h / 2
      .attr "class", "single-circle-baseline"

    figcaption = selection.append("figcaption")

    figcaption.append("span").attr("class", "anno").text(d.anno)
    figcaption.append("span").attr("class", "scenario").text( do () ->
      s = d["scenario"]
      if s == "baseline"
        ""
      else if s == "cle"
        " " + s
      else if s == "target 1"
        " t1"
      else if s == "target 2"
        " t2"
    )
    #figcaption.append("span").attr("class", "testo").text(", Area: ")
    figcaption.append("span").attr("class", "testo").text(", ")
    figcaption.append("span").attr("class","dato").text(d.area)
    figcaption.append("br")
    figcaption.append("span").attr("class","testo").text("Mesi di vita persi: ")
    figcaption.append("span").attr("class","dato").text(d.mesi)
    figcaption.append("br")
    figcaption.append("span").attr("class","testo")
      .text("Tasso di m. (100K): ")
    figcaption.append("span").attr("class","dato").text(d.tasso)

  chart.baseline = (_) ->
    baseline = _
    chart

  chart.baselinecle = (_) ->
    baselinecle = _
    chart

  chart.datum = (_) ->
    datum = _
    chart

  chart.width = (_) ->
    width = _
    chart

  chart.height = (_) ->
    height = _
    chart

  chart.radiusScale = (_) ->
    radiusScale = _
    chart

  chart

# bars

K.bars = () ->

  data = undefined
  width = 300
  height = 1000
  hbar = 100
  yScale = undefined

  chart = (selection) ->

    if not yScale
      yScale = d3.scale.linear()
        .domain [0, d3.max( data, (d) -> d.tasso )]
        .range [0, hbar]

    w = width
    h = height
    dx = (w - 0) / 5

    o = {
      "Pm2,5": "#41ab5d",
      "NO2": "#ef3b2c",
      "O3": "#4292c6"
    }

    svg = selection.append("svg")
        .attr "viewBox", "0 0 " + w + " " + h
        .attr "preserveAspectRatio", "xMidYMid"
        .attr "width", w
        .attr "height", h

    tt1 = textures.lines()
      .size 7
      .strokeWidth 1
      .stroke "#41ab5d"
    svg.call tt1

    tt2 = textures.lines()
      #.orientation("3/8", "7/8")
      .size 7
      .strokeWidth 1
      .stroke "#ef3b2c"
    svg.call tt2

    tt3 = textures.lines()
      .size 7
      .strokeWidth 1
      .stroke "#4292c6"
    svg.call tt3

    tt = {
      "Pm2,5": tt1,
      "NO2": tt2,
      "O3": tt3
    }

    c = {
      "Italia": "Italia"
      "Nord": "Nord"
      "Centro": "Centro"
      "Sud e Isole": "Sud e Isole"
      "Urbano": "Urbano"
      "Non Urbano": "Non Urbano"
      "Suburbano ad alta densità": "Suburbano"
      "Non urbano a media densità": "> Non Urbano"
    }

    delta = 1.3
    singleLine = (data, area, sel) ->

      dataArea = data

      if dataArea.length
        l = sel.append "g"
          .attr "transform", do () ->
            switch area
              when "Italia" then "translate(0,0)"
              when "Nord" then "translate(0," +
                (hbar * 1 * delta) + ")"
              when "Centro" then "translate(0," +
                (hbar * 2 * delta) + ")"
              when "Sud e Isole" then "translate(0," +
                (hbar*3 * delta) + ")"
              when "Urbano" then "translate(0," +
                (hbar * 4 * delta) + ")"
              when "Non Urbano" then "translate(0," +
                (hbar * 5 * delta) + ")"
              when "Suburbano ad alta densità" then "translate(0," +
                (hbar * 6 * delta) + ")"
              when "Non urbano a media densità" then "translate(0," +
                (hbar * 7 * delta) + ")"

        value = l.append "text"
          .attr "dy", -2
          .attr "class", "ma-text"
          .style "opacity", 0

        bar = l.selectAll "g"
          .data dataArea
          .enter()

        bar.append "rect"
          .attr "width", dx
          .attr "x", (d) ->
            switch (d.anno + " " + d.scenario)
              when "2005 baseline" then dx * 0
              when "2010 baseline" then dx * 1
              when "2020 cle" then dx * 2
              when "2020 target 1" then dx * 3
              when "2020 target 2" then dx * 4
          .attr "y", (d) ->
            hbar - yScale(d.tasso)
          .attr "height", (d) -> yScale(d.tasso)
          .attr "class", "bars"
          .style "fill", (d) ->
            if d.anno in ["2005", "2010"]
              o[d.inquinante]
            else
              tt[d.inquinante].url()

        bar.append "rect"
          .attr "width", dx
          .attr "x", (d) ->
            switch (d.anno + " " + d.scenario)
              when "2005 baseline" then dx * 0
              when "2010 baseline" then dx * 1
              when "2020 cle" then dx * 2
              when "2020 target 1" then dx * 3
              when "2020 target 2" then dx * 4
          .attr "y", 0
          .attr "height", hbar
          .style "opacity", 0
          .on "mouseover", (d) ->
            value.transition().duration(0)
              .text d.tasso
              .attr "x", do () ->
                switch (d.anno + " " + d.scenario)
                  when "2005 baseline" then dx * 0 + dx / 2
                  when "2010 baseline" then dx * 1 + dx / 2
                  when "2020 cle" then dx * 2 + dx / 2
                  when "2020 target 1" then dx * 3 + dx / 2
                  when "2020 target 2" then dx * 4 + dx / 2
              .attr "y", hbar - yScale(d.tasso)
              .style "opacity", 1
          .on "mouseout", () ->
            value.transition()
              .style "opacity", 0

        l.append "text"
          .text c[area]
          .attr "x", 0
          .attr "dy", hbar + 12
          .attr "dx", 0
          .attr "class", "ma-text-y"

    for area in ["Italia", "Nord", "Centro", "Sud e Isole", "Urbano",
                  "Non Urbano", "Suburbano ad alta densità",
                  "Non urbano a media densità"]
      dat = data.filter (v) -> v.area == area
      singleLine dat, area, svg

    lgx = svg.append "g"
      .attr "transform", "translate(" + ( dx / 2) + "," +
      (hbar * (() -> if data[0].inquinante == "O3" then 8 else 6)() *
      delta + 20)+")"
    lgx.append "text"
      .text "05"
      .attr "class", "ma-text"
      .attr "x", dx * 0
    lgx.append "text"
      .text "10"
      .attr "class", "ma-text"
      .attr "x", dx * 1
    lgx.append "text"
      .text "20 cle"
      .attr "class", "ma-text"
      .attr "x", dx * 2
    if data[0].inquinante != "O3"
      lgx.append "text"
        .text "20 t1"
        .attr "class", "ma-text"
        .attr "x", dx * 3
      lgx.append "text"
        .text "20 t2"
        .attr "class", "ma-text"
        .attr "x", dx * 4

  # ---- Getter/Setter Methods -----------------------------------------

  chart.data = (_) ->
    data = _
    chart

  chart.width = (_) ->
    width = _
    chart

  chart.height = (_) ->
    height = _
    chart

  chart.hbar = (_) ->
    hbar = _
    chart

  chart.yScale = (_) ->
    yScale = _
    chart

  chart

# LINES

K.lines = () ->

  width = 150
  height = 200
  code = undefined
  data = undefined
  yScale = undefined

  chart = (selection) ->

    dat = data.filter (v) ->
      v.codice == "" + code
    dat1 = d3.map(
      dat.filter((v) ->
        v.inquinante == "Pm2,5")
      , (d) -> d.anno_e)
    dat2 = d3.map(
      dat.filter((v) ->
        v.inquinante == "NO2")
      , (d) -> d.anno_e)
    dat3 = d3.map(
      dat.filter((v) ->
        v.inquinante == "O3" and
        v.etichetta == "short")
      , (d) -> d.anno_e)
    dat4 = d3.map(
      dat.filter((v) ->
        v.inquinante == "O3" and
        v.etichetta == "long")
      , (d) -> d.anno_e)

    w = width
    he = height
    m = 15
    dx = 40
    r = 3
    h = 150

    figure = selection.append "figure"

    svg = figure.append "svg"
        .attr "viewBox", "0 0 " + w + " " + he
        .attr "preserveAspectRatio", "xMidYMid"
        .attr "width", w
        .attr "height", he

    figcaption = figure.append "figcaption"
    figcaption.append "span"
      .text dat[0].regione
      .attr "class", "cap dato"

    lines = svg.append "g"
      .attr "transform", "translate(0,15)"

    value = svg.append "text"
      .attr "transform", "translate(0,15)"
      .text ""
      .attr "class", "line-text"
      .attr "dy", -7
      .style "opacity", 0

    drawSegment = (cl, x1, y1, x2, y2, d1, d2, sc=undefined) ->
      lines.append "line"
        .attr "class", cl
        .attr
          "x1": x1
          "x2": x2
          "y1": y1
          "y2": y2
      lines.append "circle"
        .attr "class", cl
        .attr
          "cx": x1
          "cy": y1
          "r": r
        .on "mouseover", () ->
          value.transition().duration(0)
            .text d1
            .attr
              "x": x1
              "y": y1
            .style "opacity", 1
        .on "mouseout", () ->
          value.transition().duration(0)
            .style "opacity", 0
            .text ""

      lines.append "circle"
        .attr "class", cl
        .attr
          "cx": x2
          "cy": y2
          "r": r
        .on "mouseover", () ->
          value.transition().duration(0)
            .text d2 + do () -> if sc then " " + sc else ""
            .attr
              "x": x2
              "y": y2
            .style "opacity", 1
        .on "mouseout", () ->
          value.transition().duration(0)
            .style "opacity", 0
            .text ""

    # Pm25
    drawSegment(
      "line-pm25",
      m,
      h - yScale(dat1.get("2005 baseline").tasso),
      m + dx,
      h - yScale(dat1.get("2010 baseline").tasso),
      dat1.get("2005 baseline").tasso,
      dat1.get("2010 baseline").tasso
    )

    drawSegment(
      "line-pm25 line-cle",
      m + dx,
      h - yScale(dat1.get("2010 baseline").tasso),
      m + 3 * dx,
      h - yScale(dat1.get("2020 cle").tasso),
      dat1.get("2010 baseline").tasso,
      dat1.get("2020 cle").tasso,
      "cle"
    )

    drawSegment(
      "line-pm25 line-t1",
      m + dx,
      h - yScale(dat1.get("2010 baseline").tasso),
      m + 3 * dx,
      h - yScale(dat1.get("2020 target 1").tasso),
      dat1.get("2010 baseline").tasso,
      dat1.get("2020 target 1").tasso,
      "t1"
    )

    drawSegment(
      "line-pm25 line-t2",
      m + dx,
      h - yScale(dat1.get("2010 baseline").tasso),
      m + 3 * dx,
      h - yScale(dat1.get("2020 target 2").tasso),
      dat1.get("2010 baseline").tasso,
      dat1.get("2020 target 2").tasso,
      "t2"
    )

    #NO2
    drawSegment(
      "line-no2",
      m,
      h - yScale(dat2.get("2005 baseline").tasso),
      m + dx,
      h - yScale(dat2.get("2010 baseline").tasso),
      dat2.get("2005 baseline").tasso,
      dat2.get("2010 baseline").tasso
    )

    drawSegment(
      "line-no2 line-cle",
      m + dx,
      h - yScale(dat2.get("2010 baseline").tasso),
      m + 3 * dx,
      h - yScale(dat2.get("2020 cle").tasso),
      dat2.get("2010 baseline").tasso,
      dat2.get("2020 cle").tasso,
      "cle"
    )

    drawSegment(
      "line-no2 line-t1",
      m + dx,
      h - yScale(dat2.get("2010 baseline").tasso),
      m + 3 * dx,
      h - yScale(dat2.get("2020 target 1").tasso),
      dat2.get("2010 baseline").tasso,
      dat2.get("2020 target 1").tasso,
      "t1"
    )

    drawSegment(
      "line-no2 line-t2",
      m + dx,
      h - yScale(dat2.get("2010 baseline").tasso),
      m + 3 * dx,
      h - yScale(dat2.get("2020 target 2").tasso),
      dat2.get("2010 baseline").tasso,
      dat2.get("2020 target 2").tasso,
      "t2"
    )

    #O3s
    drawSegment(
      "line-o3s",
      m,
      h - yScale(dat3.get("2005 baseline").tasso),
      m + dx,
      h - yScale(dat3.get("2010 baseline").tasso),
      dat3.get("2005 baseline").tasso,
      dat3.get("2010 baseline").tasso
    )

    drawSegment(
      "line-o3s line-cle",
      m + dx,
      h - yScale(dat3.get("2010 baseline").tasso),
      m + 3 * dx,
      h - yScale(dat3.get("2020 cle").tasso),
      dat3.get("2010 baseline").tasso,
      dat3.get("2020 cle").tasso,
      "cle"
    )

    #O3l
    drawSegment(
      "line-o3l",
      m,
      h - yScale(dat4.get("2005 baseline").tasso),
      m + dx,
      h - yScale(dat4.get("2010 baseline").tasso),
      dat4.get("2005 baseline").tasso,
      dat4.get("2010 baseline").tasso
    )

    drawSegment(
      "line-o3l line-cle",
      m + dx,
      h - yScale(dat4.get("2010 baseline").tasso),
      m + 3 * dx,
      h - yScale(dat4.get("2020 cle").tasso),
      dat4.get("2010 baseline").tasso,
      dat4.get("2020 cle").tasso,
      "cle"
    )


  # ---- Getter/Setter Methods -----------------------------------------

  chart.data = (_) ->
    data = _
    chart

  chart.width = (_) ->
    width = _
    chart

  chart.height = (_) ->
    height = _
    chart

  chart.code = (_) ->
    code = _
    chart

  chart.yScale = (_) ->
    yScale = _
    chart

  chart

# MAP

K.italyProvGrid = () ->

  width = 250
  height = 400
  topoJsonFile = ""
  scale = 4000
  data = d3.map()
  cssclass = ""
  cutoff = undefined

  chart = (selection) ->

    w = width
    h = height

    projection = d3.geo.albers()
        .center [0, 42]
        .rotate [347, 0]
        .parallels [35, 45]
        .scale scale
        .translate [w / 2, h / 2]

    path = d3.geo.path()
        .projection projection

    d3.json topoJsonFile, (error, it) ->

      svg = selection.insert("svg", ":first-child")
          .attr "viewBox", "0 0 " + w + " " + h
          .attr "preserveAspectRatio", "xMidYMid"
          .attr "width", w
          .attr "height", h

      tt = textures.lines()
        .size 8
        .strokeWidth 1
        .stroke "whitesmoke"
      svg.call tt

      #draw border with sea
      svg.append("path")
        .datum topojson.mesh(it, it.objects.sub,(a, b) -> a is b )
        .style "fill", tt.url()
        .style "fill-opacity", 0.5
        .attr "d", path

      map = svg
          .append "g"

      map.selectAll("path")
          .data topojson.feature(it, it.objects.sub).features
        .enter().append "path"
          .attr "d", path
          .style
            "stroke": "whitesmoke"
            "stroke-width": 1
            "fill": "darkred"
          .style "opacity", (d) ->
            if data.get(d.id)["valore"] > cutoff
              1
            else
              0
          .on "mouseover", (d) ->
            selection.select(".valore").text( try data.get(d.id)["valore"] )
            selection.select(".provincia").text(try data.get(d.id)["provincia"])
            d3.select(this).classed("focus", true)
          .on "mouseout", try (d) ->
            d3.select(this).classed("focus", false)

      selection.select(".anno").text( data.get("1")["anno"] )
      selection.select(".scenario").text( do () ->
        s = data.get("1")["scenario"]
        if (s != "Baseline" and s != "baseline") then (" " + s) else ""
      )
      selection.select(".etichetta").text( do () ->
        s = data.get("1")["etichetta"]
        if s == "short"
          "(short term)"
        else if s == "long"
          "(long term)"
      )
      selection.select(".inquinante").text( data.get("1")["inquinante"] )
      m = data.values().reduce ((p, v) -> if v.valore > p.valore then v else p)
      selection.select(".provincia").text( m.provincia )
      selection.select(".valore").text( m.valore )

  # ---- Getter/Setter Methods -----------------------------------------

  chart.width = (_) ->
    width = _
    chart

  chart.height = (_) ->
    height = _
    chart

  chart.topoJsonFile = (_) ->
    topoJsonFile = _
    chart

  chart.scale = (_) ->
    scale = _
    chart

  chart.data = (_) ->
    data = _
    chart

  chart.cssclass = (_) ->
    cssclass = _
    chart

  chart.cutoff = (_) ->
    cutoff = _
    chart

  chart


# # GRID MAP
#
# K.italyProvGrid1 = () ->
#
#   width = 250
#   height = 400
#   features = undefined
#   scale = 4000
#   data = d3.map()
#   cssclass = ""
#   cutoff = undefined
#
#   chart = (selection) ->
#
#     w = width
#     h = height
#
#     projection = d3.geo.albers()
#         .center [0, 42]
#         .rotate [347, 0]
#         .parallels [35, 45]
#         .scale scale
#         .translate [w / 2, h / 2]
#
#     path = d3.geo.path()
#         .projection projection
#
#     map = selection.insert "g", ":first-child"
#
#     tt = textures.lines()
#       .stroke "orange"
#     selection.call tt
#
#     # svg.append("path")
#     #   .datum(topojson.mesh(it, it.objects.sub, (a, b) -> a is b ))
#     #   .attr "d", path
#     #   .style
#     #     "stroke-width": "10px"
#     #     "stroke": do () -> if future then ttfut.url() else tt.url()
#
#     map.selectAll("path")
#         .data features
#       .enter().append "path"
#         .attr "class", cssclass
#         .attr "d", path
#         .style "fill", (d) ->
#           if data.get(d.id)["valore"] >= cutoff then "#ef3b2c" else "whitesmoke"
#         .style "fill-opacity", (d) ->
#           if data.get(d.id)["valore"] >= cutoff then 0 else 0
#         # .on "mouseover", (d) ->
#         #   selection.select(".tasso").text( try data.get(d.id)["tasso"] )
#         #   selection.select(".provincia").text(try data.get(d.id)["provincia"])
#         #   d3.select(this).classed("focus", true)
#         # .on "mouseout", try (d) ->
#         #   d3.select(this).classed("focus", false)
#
#     # selection.select(".anno").text( data.get("1")["anno"] )
#     # selection.select(".scenario").text( do () ->
#     #   s = data.get("1")["scenario"]
#     #   if s != "baseline" then (" " + s) else ""
#     # )
#     # selection.select(".etichetta").text( do () ->
#     #   s = data.get("1")["etichetta"]
#     #   if s == "short"
#     #     "(short term)"
#     #   else if s == "long"
#     #     "(long term)"
#     # )
#     # selection.select(".inquinante").text( data.get("1")["inquinante"] )
#     # m = data.values().reduce ((p, v) -> if v.tasso > p.tasso then v else p)
#     # selection.select(".provincia").text( m.provincia )
#     # selection.select(".tasso").text( m.tasso )
#
#   # ---- Getter/Setter Methods -----------------------------------------
#
#   chart.width = (_) ->
#     width = _
#     chart
#
#   chart.height = (_) ->
#     height = _
#     chart
#
#   chart.features = (_) ->
#     features = _
#     chart
#
#   chart.scale = (_) ->
#     scale = _
#     chart
#
#   chart.data = (_) ->
#     data = _
#     chart
#
#   chart.cssclass = (_) ->
#     cssclass = _
#     chart
#
#   chart.cutoff = (_) ->
#     cutoff = _
#     chart
#
#   chart
