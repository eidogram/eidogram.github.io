// Generated by CoffeeScript 1.6.3
(function() {
    if (typeof exports !== "undefined" && exports !== null) {
    exports;
  } else {
    this;
  };

  this.flubud = {
    manipulate: function(t) {
      var fix, format, getInfo, infos, lines, sequences;
      infos = [];
      sequences = [];
      format = d3.time.format("%Y-%m-%d");
      getInfo = function(s) {
        s = s.slice(1).split('|');
        return {
          'date': format.parse(s[0].trim()),
          'strain': s[1].trim()
        };
      };
      fix = function(s, index, array) {
        if (s[0] === '>') {
          sequences.push('');
          return infos.push(getInfo(s));
        } else {
          return sequences[sequences.length - 1] += s;
        }
      };
      lines = t.split('\n');
      lines.forEach(fix);
      return [infos, sequences];
    },
    mkPart: function(s) {
      var i, res, _i, _ref;
      res = '1';
      for (i = _i = 1, _ref = s.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        res += s[i] === s[i - 1] ? '0' : '1';
      }
      return res;
    },
    eqClasses: function(partitions) {
      var index, part, res, _i, _len;
      res = {};
      for (index = _i = 0, _len = partitions.length; _i < _len; index = ++_i) {
        part = partitions[index];
        (res[part] || (res[part] = [])).push(index);
      }
      return res;
    },
    entropy: function(p) {
      var count, i, res, _fn, _i, _len;
      res = 0;
      count = 1;
      _fn = function(i) {
        if (i === '0') {
          return count += 1;
        } else if (count > 1) {
          res -= count * Math.log(count);
          return count = 1;
        }
      };
      for (_i = 0, _len = p.length; _i < _len; _i++) {
        i = p[_i];
        _fn(i);
      }
      if (count > 1) {
        res -= count * Math.log(count);
      }
      return res / p.length + Math.log(p.length);
    },
    mcf: function(p, q) {
      var _i, _ref, _results;
      return (function() {
        _results = [];
        for (var _i = 0, _ref = p.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).reduce((function(previous, j) {
        return previous + (+p[j] && +q[j]);
      }), '');
    },
    mcr: function(p, q) {
      var _i, _ref, _results;
      return (function() {
        _results = [];
        for (var _i = 0, _ref = p.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).reduce((function(previous, j) {
        return previous + (+p[j] || +q[j]);
      }), '');
    },
    rohlin: function(p, q) {
      return 2 * this.entropy(this.mcr(p, q)) - this.entropy(p) - this.entropy(q);
    },
    reduction: function(p, q) {
      var p_r, q_r, sigma, _i, _j, _ref, _ref1, _results, _results1;
      sigma = this.mcf(p, q);
      p_r = '1' + (function() {
        _results = [];
        for (var _i = 1, _ref = p.length - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).reduce((function(previous, j) {
        return previous + (+p[j] && +(!+sigma[j]));
      }), '');
      q_r = '1' + (function() {
        _results1 = [];
        for (var _j = 1, _ref1 = q.length - 1; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; 1 <= _ref1 ? _j++ : _j--){ _results1.push(_j); }
        return _results1;
      }).apply(this).reduce((function(previous, j) {
        return previous + (+q[j] && +(!+sigma[j]));
      }), '');
      return [p_r, q_r];
    },
    rohlin_reduced: function(p, q) {
      var p_r, q_r, _ref;
      _ref = this.reduction(p, q), p_r = _ref[0], q_r = _ref[1];
      return this.rohlin(p_r, q_r);
    }
  };

}).call(this);
