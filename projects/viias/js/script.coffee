# Multiple chart

d3.csv "data1.csv",
  (d) -> {
    "codice": d["Cod_provincia"]
    "provincia": d["Provincia"]
    "decessi_osservati": +d["Numero decessi osservati"]
    "decessi_attribuibili": +d["Numero decessi attribuibili"]
    "tasso": +d["Tasso di mortalità attribuibile all'inquinante (per 100.000)"]
    "inquinante": d["Inquinante"]
    "anno": d["Anno"]
    "scenario": d["Scenario"]
    "etichetta": do (e=d["Etichetta"]) ->
      if /SHORT/.test(e)
        "short"
      else if /LONG/.test(e)
        "long"
      else "base"
  },
  (error, data) ->

    drawMap = (f, c, id, bg=false) ->
      dat = data.filter f
      chart = K.italyProv()
        .width 250
        .height 300
        .scale 1300
        .topoJsonFile "itx.json"
        .cssclass "minimap-chart"
        .colorScale c
        .data  d3.map( dat, (d) -> d.codice )
        .future bg
      d3.select(id).call(chart)

    # Pm2,5

    colorScale = d3.scale.quantize()
      .domain d3.extent(data.filter((v) -> v.inquinante == "Pm2,5"),
        (d) -> d.tasso )
      .range d3.range(9).map( (i) -> "q" + i + "-9" )

    # mappa 1
    drawMap(
      (v) -> v.anno  == "2005" and
             v.inquinante == "Pm2,5",
      colorScale,
      "#mm11")

    # mappa 2
    drawMap(
      (v) -> v.anno  == "2010" and
             v.inquinante == "Pm2,5",
      colorScale,
      "#mm12")

    # mappa 3
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "Pm2,5" and
             v.scenario == "cle",
      colorScale,
      "#mm13",
      true)

    # mappa 4
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "Pm2,5" and
             v.scenario == "target 1",
      colorScale,
      "#mm14",
      true)

    # mappa 5
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "Pm2,5" and
             v.scenario == "target 2",
      colorScale,
      "#mm15",
      true)

    # NO2

    colorScale = d3.scale.quantize()
      .domain d3.extent(data.filter((v) -> v.inquinante == "NO2"),
        (d) -> d.tasso )
      .range d3.range(9).map( (i) -> "p" + i + "-9" )

    # mappa 1
    drawMap(
      (v) -> v.anno  == "2005" and
             v.inquinante == "NO2",
      colorScale,
      "#mm21")

    # mappa 2
    drawMap(
      (v) -> v.anno  == "2010" and
             v.inquinante == "NO2",
      colorScale,
      "#mm22")

    # mappa 3
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "NO2" and
             v.scenario == "cle",
      colorScale,
      "#mm23",
      true)

    # mappa 4
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "NO2" and
             v.scenario == "target 1",
      colorScale,
      "#mm24",
      true)

    # mappa 5
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "NO2" and
             v.scenario == "target 2",
      colorScale,
      "#mm25",
      true)

    # O3 SHORT

    colorScale = d3.scale.quantize()
      .domain d3.extent(data.filter((v) -> v.inquinante == "O3"),
        (d) -> d.tasso )
      .range d3.range(9).map( (i) -> "r" + i + "-9" )

    # mappa 1
    drawMap(
      (v) -> v.anno  == "2005" and
             v.inquinante == "O3" and
             v.etichetta == "short",
      colorScale,
      "#mm31")

    # mappa 2
    drawMap(
      (v) -> v.anno  == "2010" and
             v.inquinante == "O3" and
             v.etichetta == "short",
      colorScale,
      "#mm32")

    # mappa 3
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "O3" and
             v.scenario == "cle" and
             v.etichetta == "short",
      colorScale,
      "#mm33",
      true)

    # O3 LONG

    # mappa 1
    drawMap(
      (v) -> v.anno  == "2005" and
             v.inquinante == "O3" and
             v.etichetta == "long",
      colorScale,
      "#mm41")

    # mappa 2
    drawMap(
      (v) -> v.anno  == "2010" and
             v.inquinante == "O3" and
             v.etichetta == "long",
      colorScale,
      "#mm42")

    # mappa 3
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "O3" and
             v.scenario == "cle" and
             v.etichetta == "long",
      colorScale,
      "#mm43",
      true)

# ---------------------------------------------------------------------------
# PM2,5 Circles

fix = (x) ->
  x = x + ""
  +x.replace /,/, "."

d3.csv "data2.csv",
  (d) -> {
    "area": d["Area"]
    "decessi_osservati": +d["Numero decessi osservati"]
    "decessi_attribuibili": +d["Decessi attribuilbili all'inquinante"]
    "tasso": +d["Tasso di mortalità attribuibile all'inquinante (per 100.000)"]
    "mesi": fix d["Mesi di vita persi"]
    "inquinante": d["Inquinante"]
    "anno": d["Anno"]
    "scenario": d["Scenario"]
  },
  (error, data) ->

    baseline_2005 = data.filter(
      (v) -> v.anno == "2005" and
             v.area == "Italia" and
             v.scenario == "baseline"
    )[0]

    draw = (f, r, id, cle=undefined) ->
      chart = K.circle()
        .datum data.filter(f)[0]
        .radiusScale r
        .baseline baseline_2005
        .baselinecle cle
      sel = d3.select(id)
        .append "figure"
        .attr "class", "minimap small"
      sel.call(chart)

    r = d3.scale.sqrt()
      .domain [0,d3.max( data, (d) -> d.mesi )]
      .range [0,60]

    # Italia
    baseline_cle = data.filter(
      (v) -> v.anno == "2020" and
             v.area == "Italia" and
             v.scenario == "cle"
    )[0]
    for y in ["2005 baseline", "2010 baseline",
              "2020 cle", "2020 target 1", "2020 target 2"]
      anno = y[..3]
      scenario = y[5..]
      area = "Italia"
      bas = if scenario in ["target 1", "target 2"] then baseline_cle else
        undefined
      draw(
        (v) -> v.anno == anno and
               v.area == area and
               v.scenario == scenario
        r,
        "#pm25-italia",
        bas
      )

    # Nord
    baseline_cle = data.filter(
      (v) -> v.anno == "2020" and
             v.area == "Nord" and
             v.scenario == "cle"
    )[0]
    for y in ["2005 baseline", "2010 baseline",
              "2020 cle", "2020 target 1", "2020 target 2"]
      anno = y[..3]
      scenario = y[5..]
      area = "Nord"
      bas = if scenario in ["target 1", "target 2"] then baseline_cle else
        undefined
      draw(
        (v) -> v.anno == anno and
               v.area == area and
               v.scenario == scenario
        r,
        "#pm25-nord",
        bas
      )

    # Centro
    baseline_cle = data.filter(
      (v) -> v.anno == "2020" and
             v.area == "Centro" and
             v.scenario == "cle"
    )[0]
    for y in ["2005 baseline", "2010 baseline",
              "2020 cle", "2020 target 1", "2020 target 2"]
      anno = y[..3]
      scenario = y[5..]
      area = "Centro"
      bas = if scenario in ["target 1", "target 2"] then baseline_cle else
        undefined
      draw(
        (v) -> v.anno == anno and
               v.area == area and
               v.scenario == scenario
        r,
        "#pm25-centro",
        bas
      )

    # Sud
    baseline_cle = data.filter(
      (v) -> v.anno == "2020" and
             v.area == "Sud e Isole" and
             v.scenario == "cle"
    )[0]
    for y in ["2005 baseline", "2010 baseline",
              "2020 cle", "2020 target 1", "2020 target 2"]
      anno = y[..3]
      scenario = y[5..]
      area = "Sud e Isole"
      bas = if scenario in ["target 1", "target 2"] then baseline_cle else
        undefined
      draw(
        (v) -> v.anno == anno and
               v.area == area and
               v.scenario == scenario
        r,
        "#pm25-sud",
        bas
      )

    # Urbano
    baseline_cle = data.filter(
      (v) -> v.anno == "2020" and
             v.area == "Urbano" and
             v.scenario == "cle"
    )[0]
    for y in ["2005 baseline", "2010 baseline",
              "2020 cle", "2020 target 1", "2020 target 2"]
      anno = y[..3]
      scenario = y[5..]
      area = "Urbano"
      bas = if scenario in ["target 1", "target 2"] then baseline_cle else
        undefined
      draw(
        (v) -> v.anno == anno and
               v.area == area and
               v.scenario == scenario
        r,
        "#pm25-urbano",
        bas
      )

    # Non Urbano
    baseline_cle = data.filter(
      (v) -> v.anno == "2020" and
             v.area == "Non Urbano" and
             v.scenario == "cle"
    )[0]
    for y in ["2005 baseline", "2010 baseline",
              "2020 cle", "2020 target 1", "2020 target 2"]
      anno = y[..3]
      scenario = y[5..]
      area = "Non Urbano"
      bas = if scenario in ["target 1", "target 2"] then baseline_cle else
        undefined
      draw(
        (v) -> v.anno == anno and
               v.area == area and
               v.scenario == scenario
        r,
        "#pm25-nonurbano",
        bas
      )

# ---------------------------------------------------------------------------
# Mortalità Area

d3.csv "data3.csv",
  (d) -> {
    "area": d["Area"]
    "decessi_osservati": +d["Numero decessi osservati"]
    "decessi_attribuibili": +d["Decessi attribuilbili all'inquinante"]
    "tasso": +d["Tasso di mortalità attribuibile all'inquinante (per 100.000)"]
    "inquinante": d["Inquinante"]
    "anno": d["Anno"]
    "scenario": d["Scenario"]
    "etichetta": do (e=d["Etichetta"]) ->
      if /SHORT/.test(e)
        "short"
      else if /LONG/.test(e)
        "long"
      else "base"
  },
  (error, data) ->

    hbar = 50

    mdata = data.filter (v) ->
      v.inquinante == "Pm2,5" or
      v.inquinante == "NO2"
    yScale = d3.scale.linear()
      .domain [0, d3.max( mdata, (d) -> d.tasso )]
      .range [0, hbar]

    # Pm25
    dat = data.filter (v) ->
      v.inquinante == "Pm2,5"
    chart = K.bars()
      .width 300
      .height 420
      .data dat
      .hbar hbar
      .yScale yScale
    d3.select("#ma-pm25").call(chart)

    # NO2
    dat = data.filter (v) ->
      v.inquinante == "NO2"
    chart = K.bars()
      .width 300
      .height 420
      .data dat
      .hbar hbar
      .yScale yScale
    d3.select("#ma-no2").call(chart)

    mdata = data.filter (v) ->
      v.inquinante == "O3"
    yScale = d3.scale.linear()
      .domain [0, d3.max( mdata, (d) -> d.tasso )]
      .range [0, hbar]

    # O3 short
    dat = data.filter (v) ->
      v.inquinante == "O3" and
      v.etichetta == "short"
    chart = K.bars()
      .width 300
      .height 550
      .data dat
      .hbar hbar
      .yScale yScale
    d3.select("#ma-o3s").call(chart)

    # O3 long
    dat = data.filter (v) ->
      v.inquinante == "O3" and
      v.etichetta == "long"
    chart = K.bars()
      .width 300
      .height 550
      .data dat
      .hbar hbar
      .yScale yScale
    d3.select("#ma-o3l").call(chart)

# Multiple lines

d3.csv "data4.csv",
  (d) -> {
    "codice": d["Cod_reg"]
    "regione": d["Regione"]
    "decessi_osservati": +d["Numero decessi osservati"]
    "decessi_attribuibili": +d["Numero decessi attribuibili all'inquinante"]
    "tasso": +d["Tasso di mortalità attribuibile all'inquinante (per 100.000)"]
    "inquinante": d["Inquinante"]
    "anno": d["Anno"]
    "scenario": d["Scenario"]
    "etichetta": do (e=d["Etichetta"]) ->
      if /SHORT/.test(e)
        "short"
      else if /LONG/.test(e)
        "long"
      else "base"
    "anno_e": d["Anno"] + " " + d["Scenario"]
  },
  (error, data) ->

    yScale = d3.scale.linear()
      .domain [0, d3.max( data, (d) -> d.tasso )]
      .range [0, 150]

    drawChart = (code) ->
      chart = K.lines()
        .width 150
        .height 170
        .yScale yScale
        .data data
        .code code
      d3.select("#line-figures").call(chart)

    for code in [1..20]
      drawChart code

# Multiple chart grids

d3.csv "data5.csv",
  (d) -> {
    "codice": d["Cod_provincia"]
    "provincia": d["Provincia"]
    "valore": fix d["Valore"]
    "inquinante": d["Inquinante"]
    "anno": d["Anno"]
    "scenario": d["Scenario"]
    "etichetta": do (e=d["Etichetta"]) ->
      if /annua/.test(e)
        "short"
      else if /estiva/.test(e)
        "long"
  },
  (error, data) ->

    drawMap = (f, c, id) ->
      dat = data.filter f
      chart = K.italyProvGrid()
        .width 250
        .height 300
        .scale 1300
        .topoJsonFile "itx.json"
        .cssclass "minimap-chart"
        .cutoff c
        .data  d3.map( dat, (d) -> d.codice )
      d3.select(id).call(chart)

    # Pm2,5
    # Limite di legge per Pm2,5 in µg su metro cubo
    cutoff = 25

    # mappa 1
    drawMap(
      (v) -> v.anno  == "2005" and
             v.inquinante == "Pm2,5",
      cutoff,
      "#dg11")

    # mappa 2
    drawMap(
      (v) -> v.anno  == "2010" and
             v.inquinante == "Pm2,5",
      cutoff,
      "#dg12")

    # mappa 3
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "Pm2,5" and
             v.scenario == "cle",
      cutoff,
      "#dg13")

    # mappa 4
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "Pm2,5" and
             v.scenario == "target 1",
      cutoff,
      "#dg14")

    # mappa 5
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "Pm2,5" and
             v.scenario == "target 2",
      cutoff,
      "#dg15")

    # NO2

    # Limite di legge per NO2 in µg su metro cubo
    cutoff = 40

    # mappa 1
    drawMap(
      (v) -> v.anno  == "2005" and
             v.inquinante == "NO2",
      cutoff,
      "#dg21")

    # mappa 2
    drawMap(
      (v) -> v.anno  == "2010" and
             v.inquinante == "NO2",
      cutoff,
      "#dg22")

    # mappa 3
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "NO2" and
             v.scenario == "cle",
      cutoff,
      "#dg23")

    # mappa 4
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "NO2" and
             v.scenario == "target 1",
      cutoff,
      "#dg24")

    # mappa 5
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "NO2" and
             v.scenario == "target 2",
      cutoff,
      "#dg25")

    # O3 SHORT

    # Limite di legge per Ozono in µg su metro cubo
    cutoff = 120

    # mappa 1
    drawMap(
      (v) -> v.anno  == "2005" and
             v.inquinante == "O3" and
             v.etichetta == "short",
      cutoff,
      "#dg31")

    # mappa 2
    drawMap(
      (v) -> v.anno  == "2010" and
             v.inquinante == "O3" and
             v.etichetta == "short",
      cutoff,
      "#dg32")

    # mappa 3
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "O3" and
             v.scenario == "cle" and
             v.etichetta == "short",
      cutoff,
      "#dg33")

    # O3 LONG

    # mappa 1
    drawMap(
      (v) -> v.anno  == "2005" and
             v.inquinante == "O3" and
             v.etichetta == "long",
      cutoff,
      "#dg41")

    # mappa 2
    drawMap(
      (v) -> v.anno  == "2010" and
             v.inquinante == "O3" and
             v.etichetta == "long",
      cutoff,
      "#dg42")

    # mappa 3
    drawMap(
      (v) -> v.anno  == "2020" and
             v.inquinante == "O3" and
             v.scenario == "cle" and
             v.etichetta == "long",
      cutoff,
      "#dg43")

# # GRIDMAP
#
# fix1 = (x) ->
#   x = x + ""
#   +x.replace(/\./g, '')
#
# d3.csv "data5.csv",
#   (d) -> {
#     "codice": d["Cod_provincia"]
#     "provincia": d["Provincia"]
#     "valore": fix d["Valore"]
#     "inquinante": d["Inquinante"]
#     "anno": d["Anno"]
#     "scenario": d["Scenario"]
#     "etichetta": do (e=d["Etichetta"]) ->
#       if /annua/.test(e)
#         "short"
#       else if /estiva/.test(e)
#         "long"
#   },
#   (error, data) ->
#
#     d3.csv "data1.csv",
#       (d) -> {
#         "codice": d["Cod_provincia"]
#         "pop": fix1 d["Popolazione >30"]
#       },
#       (error, pop) ->
#
#         w = 760
#         h = 900
#
#         projection = d3.geo.albers()
#             .center [0, 42]
#             .rotate [347, 0]
#             .parallels [35, 45]
#             .scale 4500
#             .translate [w / 2, h / 2]
#
#         path = d3.geo.path()
#           .projection projection
#
#         # categories on population
#         dat = d3.map pop, (d) -> d.codice
#         data1 = d3.map()
#         for k in dat.keys()
#           data1.set k, dat.get(k).pop
#           # data1.set k, do () ->
#           #   soglia = 100000
#           #   x = dat.get(k).pop
#           #   if x < soglia then x else soglia
#
#         ready = (error, it) ->
#
#           features =  topojson.feature(it, it.objects.sub).features
#
#           gridchart = gridmap()
#             .data data1
#             .width w
#             .height h
#             .key "id"
#             .side 5
#             .isDensity false
#             .projection projection
#             .features features
#             .fill "whitesmoke"
#
#           sel = d3.select("#gridmap")
#           sel.call(gridchart)
#           svg = sel.select("svg")
#           console.log svg
#
#           f = (v) -> v.anno  == "2005" and
#              v.inquinante == "Pm2,5"
#           dat = data.filter f
#
#           c = 20
#           chart = K.italyProvGrid1()
#             .width w
#             .height h
#             .scale 4500
#             .features features
#             .cssclass "grid-chart"
#             .cutoff c
#             .data  d3.map( dat, (d) -> d.codice )
#           svg.call(chart)
#
#         queue()
#             .defer(d3.json, "itx.json")
#             .await(ready)
