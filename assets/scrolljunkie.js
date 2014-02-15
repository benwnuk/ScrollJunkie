(function() {
  $(document).ready(function() {
    return $.fn.scrollJunkie = function(opts) {
      var activeSelector, checkMediaQuery, computeOffset, debugOutput, i, io, log, newCollection, performTransform, processEachEffect, sjBehaviors, sjCollection, v, vo;
      activeSelector = '[data-scrolljunkie]';
      debugOutput = true;
      log = function(output) {
        if (debugOutput) {
          return console.log(output);
        }
      };
      if (!$.data(document.body, 'sjBehaviors')) {
        $.data(document.body, 'sjBehaviors', {});
      }
      sjBehaviors = $.data(document.body, 'sjBehaviors');
      if ($.isPlainObject(opts)) {
        for (io in opts) {
          vo = opts[io];
          sjBehaviors[io] = {
            mediaQuery: vo.mediaQuery || '',
            effects: (function() {
              var _ref, _results;
              _ref = vo.effects;
              _results = [];
              for (i in _ref) {
                v = _ref[i];
                _results.push({
                  start: v.start || '-100vh',
                  end: v.end || '100%',
                  easing: v.easing || 'linear',
                  init: v.init || function() {},
                  resize: v.resize || function() {},
                  perform: v.perform || function() {},
                  transform: {
                    scale: v.transform && v.transform.scale ? v.transform.scale : false,
                    overflow: v.transform && v.transform.overflow ? v.transform.overflow : 'hide',
                    align: v.transform && v.transform.align ? v.transform.align : 50,
                    ratioX: v.transform && v.transform.ratioX ? v.transform.ratioX : 0,
                    ratioY: v.transform && v.transform.ratioY ? v.transform.ratioY : 0
                  }
                });
              }
              return _results;
            })()
          };
        }
      }
      newCollection = this.find(activeSelector);
      if ($.data(document.body, 'sjCollection')) {
        sjCollection = $.data(document.body, 'sjCollection').add(newCollection);
      } else {
        sjCollection = $.data(document.body, 'sjCollection', newCollection);
      }
      newCollection.each(function() {
        var e, elementBehavior, elementEffects, f, that, _i, _len, _ref;
        elementEffects = [];
        that = $(this);
        _ref = $(this).attr('data-scrolljunkie').split(',');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elementBehavior = _ref[_i];
          if (sjBehaviors[elementBehavior] != null) {
            elementEffects = (function() {
              var _j, _len1, _ref1, _results;
              _ref1 = sjBehaviors[elementBehavior].effects;
              _results = [];
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                e = _ref1[_j];
                f = $.extend({}, e);
                f.behavior = elementBehavior;
                f.mediaQuery = sjBehaviors[elementBehavior].mediaQuery;
                f.host = that;
                f.elements = {};
                f.data = {};
                f.startOffset = null;
                f.endOffset = null;
                _results.push(f);
              }
              return _results;
            })();
            log("the behavior '" + elementBehavior + "' was innitialized");
          } else {
            log("the behavior '" + elementBehavior + "' could not be initialized");
          }
        }
        return $(this).data('elementEffects', elementEffects);
      });
      processEachEffect = function(callback) {
        sjCollection.each(function() {
          var effect, that, _i, _len, _ref, _results;
          that = $(this);
          _ref = $(this).data('elementEffects');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            effect = _ref[_i];
            if ((callback != null) && checkMediaQuery(effect.mediaQuery)) {
              _results.push(callback.call(effect));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
        return false;
      };
      computeOffset = function(eh, vh, offset, endOffset, value) {
        value = value.replace(/[^0-9vVhH\-\+\*\/\%()(start)(end)]+/g, '');
        value = value.replace(/\d+(vh|%)/g, "($&)");
        value = value.replace(/vh/g, "*(" + vh + "/100)");
        value = value.replace(/%/g, "*(" + eh + "/100)");
        if (value.match('start')) {
          value = value.replace(/start/g, 0);
        } else if (value.match('end')) {
          value = value.replace(/end/g, endOffset);
        } else {
          value = "" + offset + " - " + value;
        }
        return eval(value);
      };
      checkMediaQuery = function(mq) {
        return true;
      };
      performTransform = function(effect) {};
      processEachEffect(function() {
        return this.init();
      });
      $(window).on('resize', function(e) {
        return processEachEffect(function() {
          return this.resize();
        });
      });
      $(window).on('scroll', function(e) {});
      if (debugOutput) {
        window.sjBehaviors = sjBehaviors;
        window.sjCollection = sjCollection;
        window.computeOffset = computeOffset;
        return window.processEachEffect = processEachEffect;
      }
    };
  });

}).call(this);

//# sourceMappingURL=../assets/scrolljunkie.js.map
