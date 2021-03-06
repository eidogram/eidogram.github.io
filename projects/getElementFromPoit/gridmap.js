// Generated by CoffeeScript 1.6.3
(function() {
  var root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.gridmap = function() {
    var chart, data, features, grid, gridclass, height, isquantity, key, mapclass, projection, side, width;
    projection = void 0;
    side = 10;
    key = "id";
    data = void 0;
    features = void 0;
    width = 500;
    height = 500;
    isquantity = void 0;
    gridclass = "gridclass";
    mapclass = "mapclass";
    grid = d3.map();
    chart = function(selection) {
      var area, attr, backup, c, centroid, dataGrid, density, dots, dx, dy, element, f, h, i, j, k, map, matrix, nx, ny, path, radius, svg, value, w, x, y, _i, _j, _k, _len, _ref, _ref1;
      w = width;
      h = height;
      backup = {
        "position": selection.style("position"),
        "top": selection.style("top"),
        "left": selection.style("left"),
        "opacity": selection.style("opacity")
      };
      selection.style({
        "position": "fixed",
        "top": 0,
        "left": 0,
        "opacity": 0
      });
      path = d3.geo.path().projection(projection);
      area = d3.map();
      centroid = d3.map();
      for (_i = 0, _len = features.length; _i < _len; _i++) {
        f = features[_i];
        area.set(f[key], path.area(f) / (w * h));
        c = path.centroid(f);
        if (c) {
          centroid.set(f[key], c);
        }
      }
      radius = d3.scale.linear().range([0, side / 2 * 0.9]);
      svg = selection.append("svg").attr("width", w).attr("height", h).attr("viewBox", "0 0 " + w + " " + h);
      map = svg.append("g");
      map.selectAll("path").data(features).enter().append("path").attr("class", mapclass).attr("data-key", function(d) {
        return d[key];
      }).attr("d", path);
      matrix = map.node().getScreenCTM();
      dy = matrix.f;
      dx = matrix.e;
      nx = Math.floor(w / side);
      ny = Math.floor(h / side);
      for (i = _j = 0, _ref = nx - 1; 0 <= _ref ? _j <= _ref : _j >= _ref; i = 0 <= _ref ? ++_j : --_j) {
        for (j = _k = 0, _ref1 = ny - 1; 0 <= _ref1 ? _k <= _ref1 : _k >= _ref1; j = 0 <= _ref1 ? ++_k : --_k) {
          x = side * i + side / 2;
          y = side * j + side / 2;
          element = document.elementFromPoint(x + dx, y + dy);
          if (element) {
            attr = element.getAttribute("data-key");
            if (attr) {
              centroid.remove(attr);
              value = [attr];
            } else {
              value = [];
            }
          } else {
            value = [];
          }
          grid.set(i + "," + j, {
            keys: value,
            x: x,
            y: y
          });
        }
      }
      centroid.forEach(function(k, v) {
        i = Math.floor(v[0] / side);
        j = Math.floor(v[1] / side);
        try {
          return grid.get(i + "," + j).keys.push(k);
        } catch (_error) {}
      });
      density = function(a) {
        var den, num;
        if (isquantity) {
          num = d3.sum((function() {
            var _l, _len1, _results;
            _results = [];
            for (_l = 0, _len1 = a.length; _l < _len1; _l++) {
              j = a[_l];
              _results.push(data.get(j));
            }
            return _results;
          })());
        } else {
          num = d3.sum((function() {
            var _l, _len1, _results;
            _results = [];
            for (_l = 0, _len1 = a.length; _l < _len1; _l++) {
              j = a[_l];
              _results.push(data.get(j) * area.get(j));
            }
            return _results;
          })());
        }
        den = d3.sum((function() {
          var _l, _len1, _results;
          _results = [];
          for (_l = 0, _len1 = a.length; _l < _len1; _l++) {
            j = a[_l];
            _results.push(area.get(j));
          }
          return _results;
        })());
        if (den) {
          return num / den;
        } else {
          return 0;
        }
      };
      dataGrid = (function() {
        var _l, _len1, _ref2, _results;
        _ref2 = grid.values();
        _results = [];
        for (_l = 0, _len1 = _ref2.length; _l < _len1; _l++) {
          k = _ref2[_l];
          if (k.keys.length) {
            _results.push({
              value: density(k.keys),
              x: k.x,
              y: k.y
            });
          }
        }
        return _results;
      })();
      dots = map.selectAll(gridclass).data(dataGrid);
      radius.domain([
        0, d3.max(dataGrid, function(d) {
          return Math.sqrt(d.value);
        })
      ]);
      dots.enter().append("circle").attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      }).attr("r", function(d) {
        return radius(Math.sqrt(d.value));
      }).attr("class", gridclass);
      return selection.style(backup);
    };
    chart.width = function(_) {
      width = _;
      return chart;
    };
    chart.height = function(_) {
      height = _;
      return chart;
    };
    chart.side = function(_) {
      side = _;
      return chart;
    };
    chart.key = function(_) {
      key = _;
      return chart;
    };
    chart.data = function(_) {
      data = _;
      return chart;
    };
    chart.isquantity = function(_) {
      isquantity = _;
      return chart;
    };
    chart.features = function(_) {
      features = _;
      return chart;
    };
    chart.projection = function(_) {
      projection = _;
      return chart;
    };
    chart.gridclass = function(_) {
      gridclass = _;
      return chart;
    };
    chart.mapclass = function(_) {
      mapclass = _;
      return chart;
    };
    return chart;
  };

}).call(this);
