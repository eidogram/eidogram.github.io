// Generated by CoffeeScript 1.9.0
(function() {
  var fix;

  d3.csv("data1.csv", function(d) {
    return {
      "codice": d["Cod_provincia"],
      "provincia": d["Provincia"],
      "decessi_osservati": +d["Numero decessi osservati"],
      "decessi_attribuibili": +d["Numero decessi attribuibili"],
      "tasso": +d["Tasso di mortalità attribuibile all'inquinante (per 100.000)"],
      "inquinante": d["Inquinante"],
      "anno": d["Anno"],
      "scenario": d["Scenario"],
      "etichetta": (function(e) {
        if (/SHORT/.test(e)) {
          return "short";
        } else if (/LONG/.test(e)) {
          return "long";
        } else {
          return "base";
        }
      })(d["Etichetta"])
    };
  }, function(error, data) {
    var colorScale, drawMap;
    drawMap = function(f, c, id, bg) {
      var chart, dat;
      if (bg == null) {
        bg = false;
      }
      dat = data.filter(f);
      chart = K.italyProv().width(250).height(300).scale(1300).topoJsonFile("itx.json").cssclass("minimap-chart").colorScale(c).data(d3.map(dat, function(d) {
        return d.codice;
      })).future(bg);
      return d3.select(id).call(chart);
    };
    colorScale = d3.scale.quantize().domain(d3.extent(data.filter(function(v) {
      return v.inquinante === "Pm2,5";
    }), function(d) {
      return d.tasso;
    })).range(d3.range(9).map(function(i) {
      return "q" + i + "-9";
    }));
    drawMap(function(v) {
      return v.anno === "2005" && v.inquinante === "Pm2,5";
    }, colorScale, "#mm11");
    drawMap(function(v) {
      return v.anno === "2010" && v.inquinante === "Pm2,5";
    }, colorScale, "#mm12");
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "Pm2,5" && v.scenario === "cle";
    }, colorScale, "#mm13", true);
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "Pm2,5" && v.scenario === "target 1";
    }, colorScale, "#mm14", true);
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "Pm2,5" && v.scenario === "target 2";
    }, colorScale, "#mm15", true);
    colorScale = d3.scale.quantize().domain(d3.extent(data.filter(function(v) {
      return v.inquinante === "NO2";
    }), function(d) {
      return d.tasso;
    })).range(d3.range(9).map(function(i) {
      return "p" + i + "-9";
    }));
    drawMap(function(v) {
      return v.anno === "2005" && v.inquinante === "NO2";
    }, colorScale, "#mm21");
    drawMap(function(v) {
      return v.anno === "2010" && v.inquinante === "NO2";
    }, colorScale, "#mm22");
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "NO2" && v.scenario === "cle";
    }, colorScale, "#mm23", true);
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "NO2" && v.scenario === "target 1";
    }, colorScale, "#mm24", true);
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "NO2" && v.scenario === "target 2";
    }, colorScale, "#mm25", true);
    colorScale = d3.scale.quantize().domain(d3.extent(data.filter(function(v) {
      return v.inquinante === "O3";
    }), function(d) {
      return d.tasso;
    })).range(d3.range(9).map(function(i) {
      return "r" + i + "-9";
    }));
    drawMap(function(v) {
      return v.anno === "2005" && v.inquinante === "O3" && v.etichetta === "short";
    }, colorScale, "#mm31");
    drawMap(function(v) {
      return v.anno === "2010" && v.inquinante === "O3" && v.etichetta === "short";
    }, colorScale, "#mm32");
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "O3" && v.scenario === "cle" && v.etichetta === "short";
    }, colorScale, "#mm33", true);
    drawMap(function(v) {
      return v.anno === "2005" && v.inquinante === "O3" && v.etichetta === "long";
    }, colorScale, "#mm41");
    drawMap(function(v) {
      return v.anno === "2010" && v.inquinante === "O3" && v.etichetta === "long";
    }, colorScale, "#mm42");
    return drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "O3" && v.scenario === "cle" && v.etichetta === "long";
    }, colorScale, "#mm43", true);
  });

  fix = function(x) {
    x = x + "";
    return +x.replace(/,/, ".");
  };

  d3.csv("data2.csv", function(d) {
    return {
      "area": d["Area"],
      "decessi_osservati": +d["Numero decessi osservati"],
      "decessi_attribuibili": +d["Decessi attribuilbili all'inquinante"],
      "tasso": +d["Tasso di mortalità attribuibile all'inquinante (per 100.000)"],
      "mesi": fix(d["Mesi di vita persi"]),
      "inquinante": d["Inquinante"],
      "anno": d["Anno"],
      "scenario": d["Scenario"]
    };
  }, function(error, data) {
    var anno, area, bas, baseline_2005, baseline_cle, draw, r, scenario, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
    baseline_2005 = data.filter(function(v) {
      return v.anno === "2005" && v.area === "Italia" && v.scenario === "baseline";
    })[0];
    draw = function(f, r, id, cle) {
      var chart, sel;
      if (cle == null) {
        cle = void 0;
      }
      chart = K.circle().datum(data.filter(f)[0]).radiusScale(r).baseline(baseline_2005).baselinecle(cle);
      sel = d3.select(id).append("figure").attr("class", "minimap small");
      return sel.call(chart);
    };
    r = d3.scale.sqrt().domain([
      0, d3.max(data, function(d) {
        return d.mesi;
      })
    ]).range([0, 60]);
    baseline_cle = data.filter(function(v) {
      return v.anno === "2020" && v.area === "Italia" && v.scenario === "cle";
    })[0];
    _ref = ["2005 baseline", "2010 baseline", "2020 cle", "2020 target 1", "2020 target 2"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      y = _ref[_i];
      anno = y.slice(0, 4);
      scenario = y.slice(5);
      area = "Italia";
      bas = scenario === "target 1" || scenario === "target 2" ? baseline_cle : void 0;
      draw(function(v) {
        return v.anno === anno && v.area === area && v.scenario === scenario;
      }, r, "#pm25-italia", bas);
    }
    baseline_cle = data.filter(function(v) {
      return v.anno === "2020" && v.area === "Nord" && v.scenario === "cle";
    })[0];
    _ref1 = ["2005 baseline", "2010 baseline", "2020 cle", "2020 target 1", "2020 target 2"];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      y = _ref1[_j];
      anno = y.slice(0, 4);
      scenario = y.slice(5);
      area = "Nord";
      bas = scenario === "target 1" || scenario === "target 2" ? baseline_cle : void 0;
      draw(function(v) {
        return v.anno === anno && v.area === area && v.scenario === scenario;
      }, r, "#pm25-nord", bas);
    }
    baseline_cle = data.filter(function(v) {
      return v.anno === "2020" && v.area === "Centro" && v.scenario === "cle";
    })[0];
    _ref2 = ["2005 baseline", "2010 baseline", "2020 cle", "2020 target 1", "2020 target 2"];
    for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
      y = _ref2[_k];
      anno = y.slice(0, 4);
      scenario = y.slice(5);
      area = "Centro";
      bas = scenario === "target 1" || scenario === "target 2" ? baseline_cle : void 0;
      draw(function(v) {
        return v.anno === anno && v.area === area && v.scenario === scenario;
      }, r, "#pm25-centro", bas);
    }
    baseline_cle = data.filter(function(v) {
      return v.anno === "2020" && v.area === "Sud e Isole" && v.scenario === "cle";
    })[0];
    _ref3 = ["2005 baseline", "2010 baseline", "2020 cle", "2020 target 1", "2020 target 2"];
    for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
      y = _ref3[_l];
      anno = y.slice(0, 4);
      scenario = y.slice(5);
      area = "Sud e Isole";
      bas = scenario === "target 1" || scenario === "target 2" ? baseline_cle : void 0;
      draw(function(v) {
        return v.anno === anno && v.area === area && v.scenario === scenario;
      }, r, "#pm25-sud", bas);
    }
    baseline_cle = data.filter(function(v) {
      return v.anno === "2020" && v.area === "Urbano" && v.scenario === "cle";
    })[0];
    _ref4 = ["2005 baseline", "2010 baseline", "2020 cle", "2020 target 1", "2020 target 2"];
    for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
      y = _ref4[_m];
      anno = y.slice(0, 4);
      scenario = y.slice(5);
      area = "Urbano";
      bas = scenario === "target 1" || scenario === "target 2" ? baseline_cle : void 0;
      draw(function(v) {
        return v.anno === anno && v.area === area && v.scenario === scenario;
      }, r, "#pm25-urbano", bas);
    }
    baseline_cle = data.filter(function(v) {
      return v.anno === "2020" && v.area === "Non Urbano" && v.scenario === "cle";
    })[0];
    _ref5 = ["2005 baseline", "2010 baseline", "2020 cle", "2020 target 1", "2020 target 2"];
    _results = [];
    for (_n = 0, _len5 = _ref5.length; _n < _len5; _n++) {
      y = _ref5[_n];
      anno = y.slice(0, 4);
      scenario = y.slice(5);
      area = "Non Urbano";
      bas = scenario === "target 1" || scenario === "target 2" ? baseline_cle : void 0;
      _results.push(draw(function(v) {
        return v.anno === anno && v.area === area && v.scenario === scenario;
      }, r, "#pm25-nonurbano", bas));
    }
    return _results;
  });

  d3.csv("data3.csv", function(d) {
    return {
      "area": d["Area"],
      "decessi_osservati": +d["Numero decessi osservati"],
      "decessi_attribuibili": +d["Decessi attribuilbili all'inquinante"],
      "tasso": +d["Tasso di mortalità attribuibile all'inquinante (per 100.000)"],
      "inquinante": d["Inquinante"],
      "anno": d["Anno"],
      "scenario": d["Scenario"],
      "etichetta": (function(e) {
        if (/SHORT/.test(e)) {
          return "short";
        } else if (/LONG/.test(e)) {
          return "long";
        } else {
          return "base";
        }
      })(d["Etichetta"])
    };
  }, function(error, data) {
    var chart, dat, hbar, mdata, yScale;
    hbar = 50;
    mdata = data.filter(function(v) {
      return v.inquinante === "Pm2,5" || v.inquinante === "NO2";
    });
    yScale = d3.scale.linear().domain([
      0, d3.max(mdata, function(d) {
        return d.tasso;
      })
    ]).range([0, hbar]);
    dat = data.filter(function(v) {
      return v.inquinante === "Pm2,5";
    });
    chart = K.bars().width(300).height(420).data(dat).hbar(hbar).yScale(yScale);
    d3.select("#ma-pm25").call(chart);
    dat = data.filter(function(v) {
      return v.inquinante === "NO2";
    });
    chart = K.bars().width(300).height(420).data(dat).hbar(hbar).yScale(yScale);
    d3.select("#ma-no2").call(chart);
    mdata = data.filter(function(v) {
      return v.inquinante === "O3";
    });
    yScale = d3.scale.linear().domain([
      0, d3.max(mdata, function(d) {
        return d.tasso;
      })
    ]).range([0, hbar]);
    dat = data.filter(function(v) {
      return v.inquinante === "O3" && v.etichetta === "short";
    });
    chart = K.bars().width(300).height(550).data(dat).hbar(hbar).yScale(yScale);
    d3.select("#ma-o3s").call(chart);
    dat = data.filter(function(v) {
      return v.inquinante === "O3" && v.etichetta === "long";
    });
    chart = K.bars().width(300).height(550).data(dat).hbar(hbar).yScale(yScale);
    return d3.select("#ma-o3l").call(chart);
  });

  d3.csv("data4.csv", function(d) {
    return {
      "codice": d["Cod_reg"],
      "regione": d["Regione"],
      "decessi_osservati": +d["Numero decessi osservati"],
      "decessi_attribuibili": +d["Numero decessi attribuibili all'inquinante"],
      "tasso": +d["Tasso di mortalità attribuibile all'inquinante (per 100.000)"],
      "inquinante": d["Inquinante"],
      "anno": d["Anno"],
      "scenario": d["Scenario"],
      "etichetta": (function(e) {
        if (/SHORT/.test(e)) {
          return "short";
        } else if (/LONG/.test(e)) {
          return "long";
        } else {
          return "base";
        }
      })(d["Etichetta"]),
      "anno_e": d["Anno"] + " " + d["Scenario"]
    };
  }, function(error, data) {
    var code, drawChart, yScale, _i, _results;
    yScale = d3.scale.linear().domain([
      0, d3.max(data, function(d) {
        return d.tasso;
      })
    ]).range([0, 150]);
    drawChart = function(code) {
      var chart;
      chart = K.lines().width(150).height(170).yScale(yScale).data(data).code(code);
      return d3.select("#line-figures").call(chart);
    };
    _results = [];
    for (code = _i = 1; _i <= 20; code = ++_i) {
      _results.push(drawChart(code));
    }
    return _results;
  });

  d3.csv("data5.csv", function(d) {
    return {
      "codice": d["Cod_provincia"],
      "provincia": d["Provincia"],
      "valore": fix(d["Valore"]),
      "inquinante": d["Inquinante"],
      "anno": d["Anno"],
      "scenario": d["Scenario"],
      "etichetta": (function(e) {
        if (/annua/.test(e)) {
          return "short";
        } else if (/estiva/.test(e)) {
          return "long";
        }
      })(d["Etichetta"])
    };
  }, function(error, data) {
    var cutoff, drawMap;
    drawMap = function(f, c, id) {
      var chart, dat;
      dat = data.filter(f);
      chart = K.italyProvGrid().width(250).height(300).scale(1300).topoJsonFile("itx.json").cssclass("minimap-chart").cutoff(c).data(d3.map(dat, function(d) {
        return d.codice;
      }));
      return d3.select(id).call(chart);
    };
    cutoff = 25;
    drawMap(function(v) {
      return v.anno === "2005" && v.inquinante === "Pm2,5";
    }, cutoff, "#dg11");
    drawMap(function(v) {
      return v.anno === "2010" && v.inquinante === "Pm2,5";
    }, cutoff, "#dg12");
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "Pm2,5" && v.scenario === "cle";
    }, cutoff, "#dg13");
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "Pm2,5" && v.scenario === "target 1";
    }, cutoff, "#dg14");
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "Pm2,5" && v.scenario === "target 2";
    }, cutoff, "#dg15");
    cutoff = 40;
    drawMap(function(v) {
      return v.anno === "2005" && v.inquinante === "NO2";
    }, cutoff, "#dg21");
    drawMap(function(v) {
      return v.anno === "2010" && v.inquinante === "NO2";
    }, cutoff, "#dg22");
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "NO2" && v.scenario === "cle";
    }, cutoff, "#dg23");
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "NO2" && v.scenario === "target 1";
    }, cutoff, "#dg24");
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "NO2" && v.scenario === "target 2";
    }, cutoff, "#dg25");
    cutoff = 120;
    drawMap(function(v) {
      return v.anno === "2005" && v.inquinante === "O3" && v.etichetta === "short";
    }, cutoff, "#dg31");
    drawMap(function(v) {
      return v.anno === "2010" && v.inquinante === "O3" && v.etichetta === "short";
    }, cutoff, "#dg32");
    drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "O3" && v.scenario === "cle" && v.etichetta === "short";
    }, cutoff, "#dg33");
    drawMap(function(v) {
      return v.anno === "2005" && v.inquinante === "O3" && v.etichetta === "long";
    }, cutoff, "#dg41");
    drawMap(function(v) {
      return v.anno === "2010" && v.inquinante === "O3" && v.etichetta === "long";
    }, cutoff, "#dg42");
    return drawMap(function(v) {
      return v.anno === "2020" && v.inquinante === "O3" && v.scenario === "cle" && v.etichetta === "long";
    }, cutoff, "#dg43");
  });

}).call(this);