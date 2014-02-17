(function() {
  $(document).ready(function() {
    return $.fn.scrollJunkie = function(opts) {
      var activeSelector, anyClones, body, checkMediaQuery, computeOffset, debugDisplay, debugOutput, doTransforms, easingFunc, i, initTransforms, io, log, newCollection, performTransform, positionClone, processEachEffect, sj, sjBehaviors, sjCollection, updateDebug, v, vo, _ref;
      easingFunc = {
        linear: function(t) {
          return t;
        },
        easeInQuad: function(t) {
          return t * t;
        },
        easeOutQuad: function(t) {
          return t * (2 - t);
        },
        easeInOutQuad: function(t) {
          var _ref;
          return (_ref = t < .5) != null ? _ref : 2 * t * {
            t: -1 + (4 - 2 * t) * t
          };
        },
        easeInCubic: function(t) {
          return t * t * t;
        },
        easeOutCubic: function(t) {
          return (--t) * t * t + 1;
        },
        easeInOutCubic: function(t) {
          var _ref;
          return (_ref = t < .5) != null ? _ref : 4 * t * t * {
            t: (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
          };
        },
        easeInQuart: function(t) {
          return t * t * t * t;
        },
        easeOutQuart: function(t) {
          return 1 - (--t) * t * t * t;
        },
        easeInOutQuart: function(t) {
          var _ref;
          return (_ref = t < .5) != null ? _ref : 8 * t * t * t * {
            t: 1 - 8 * (--t) * t * t * t
          };
        },
        easeInQuint: function(t) {
          return t * t * t * t * t;
        },
        easeOutQuint: function(t) {
          return 1 + (--t) * t * t * t * t;
        },
        easeInOutQuint: function(t) {
          var _ref;
          return (_ref = t < .5) != null ? _ref : 16 * t * t * t * t * {
            t: 1 + 16 * (--t) * t * t * t * t
          };
        }
      };
      body = $('body');
      activeSelector = opts.dataAttribute || 'data-scrolljunkie';
      debugOutput = opts.debug || false;
      debugDisplay = $('<div style="position:fixed;bottom:10px;right:10px;background:black;color:white;padding:3px;font-size:12px">test</div');
      if (debugOutput) {
        body.append(debugDisplay);
      }
      sj = {};
      log = function(output) {
        if (debugOutput) {
          return console.log(output);
        }
      };
      if (!$.data(document.body, 'sjBehaviors')) {
        $.data(document.body, 'sjBehaviors', {});
      }
      sjBehaviors = $.data(document.body, 'sjBehaviors');
      if ($.isPlainObject(opts.behaviors)) {
        _ref = opts.behaviors;
        for (io in _ref) {
          vo = _ref[io];
          sjBehaviors[io] = {
            mediaQuery: vo.mediaQuery || '',
            effects: (function() {
              var _ref1, _results;
              _ref1 = vo.effects;
              _results = [];
              for (i in _ref1) {
                v = _ref1[i];
                _results.push({
                  start: v.start || '-100vh',
                  end: v.end || '100%',
                  easing: v.easing || 'linear',
                  clone: v.clone || (v.transform && v.transform.ratioY !== 0) || false,
                  init: v.init || function() {},
                  onResize: v.onResize || function() {},
                  onScroll: v.onScroll || function() {},
                  transform: {
                    scale: v.transform && v.transform.scale ? v.transform.scale : false,
                    overflow: v.transform && v.transform.overflow ? v.transform.overflow : 'hide',
                    align: v.transform && v.transform.align ? v.transform.align : 50,
                    ratioY: v.transform && v.transform.ratioY ? v.transform.ratioY : 0
                  }
                });
              }
              return _results;
            })()
          };
        }
      }
      newCollection = this.find("[" + activeSelector + "]");
      if ($.data(document.body, 'sjCollection')) {
        sjCollection = $.data(document.body, 'sjCollection').add(newCollection);
      } else {
        sjCollection = $.data(document.body, 'sjCollection', newCollection);
      }
      checkMediaQuery = function(mq) {
        return true;
      };
      processEachEffect = function(callback) {
        sjCollection.each(function() {
          var effect, that, _i, _len, _ref1, _results;
          that = $(this);
          _ref1 = $(this).data('elementEffects');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            effect = _ref1[_i];
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
      anyClones = false;
      newCollection.each(function() {
        var e, elementBehavior, elementEffects, f, that, _i, _len, _ref1;
        elementEffects = [];
        that = $(this);
        _ref1 = $(this).attr('data-scrolljunkie').split(',');
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          elementBehavior = _ref1[_i];
          if (sjBehaviors[elementBehavior] != null) {
            elementEffects = (function() {
              var _j, _len1, _ref2, _results;
              _ref2 = sjBehaviors[elementBehavior].effects;
              _results = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                e = _ref2[_j];
                f = $.extend({}, e);
                f.behaviorName = elementBehavior;
                f.mediaQuery = sjBehaviors[elementBehavior].mediaQuery;
                f.host = that;
                f.elements = {};
                f.data = {};
                f.sj = sj;
                if (that.clone) {
                  anyClones = true;
                }
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
      if (anyClones) {
        sj.cloneDiv = $('<div style="position:fixed;top:0;width:100%;background:green;height:0"></div>');
        body.append(sj.cloneDiv);
        processEachEffect(function() {
          if (this.clone) {
            this.clone = this.host.clone();
            return sj.cloneDiv.append(this.clone);
          }
        });
      }
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
          value = "" + offset + " + " + value;
        }
        return eval(value);
      };
      positionClone = function(effect) {};
      performTransform = function(effect) {};
      processEachEffect(function() {
        return this.init();
      });
      updateDebug = function() {
        return debugDisplay.html("" + sj.topOffset + "px scroll offset<br> " + sj.windowHeight + "px window height<br> " + sj.documentHeight + "px doc height");
      };
      $(window).on('resize', function(event) {
        sj.documentHeight = $(document).height();
        sj.windowHeight = $(window).height();
        sj.maxOffset = sj.documentHeight - sj.windowHeight;
        processEachEffect(function() {
          this.resize = {};
          this.resize.width = this.host.outerWidth();
          this.resize.height = this.host.outerHeight();
          this.resize.topOffset = this.host.offset().top;
          this.resize.startOffset = computeOffset(this.resize.height, sj.windowHeight, this.resize.topOffset, sj.maxOffset, this.start);
          this.resize.endOffset = computeOffset(this.resize.height, sj.windowHeight, this.resize.topOffset, sj.maxOffset, this.end);
          this.resize.rangeOffset = this.resize.endOffset - this.resize.startOffset;
          return this.onResize.call(this);
        });
        if (debugOutput) {
          return updateDebug();
        }
      });
      $(window).on('scroll', function(event) {
        sj.topOffset = $(window).scrollTop();
        if (sj.topOffset < 1) {
          sj.topOffset = 0;
        }
        if (sj.topOffset > sj.maxOffset) {
          sj.topOffset = sj.maxOffset;
        }
        processEachEffect(function() {
          this.scroll = {};
          this.scroll.pixelsFromStart = sj.topOffset - this.resize.startOffset;
          this.scroll.percentFromStart = this.scroll.pixelsFromStart / this.resize.rangeOffset;
          this.scroll.percentFromStartEased = easingFunc[this.easing](this.scroll.percentFromStart);
          this.scroll.pixelsFromStartEased = easingFunc[this.easing](this.scroll.percentFromStart) * this.scroll.pixelsFromStart;
          this.onScroll.call(this);
          if (this.clone) {
            positionClone(this);
          }
          if (this.transform.ratioY !== "0") {
            return doTransforms(this);
          }
        });
        if (debugOutput) {
          return updateDebug();
        }
      });
      initTransforms = function(effect) {};
      doTransforms = function(effect) {};
      $(window).trigger('resize');
      $(window).trigger('scroll');
      if (debugOutput) {
        window.sjBehaviors = sjBehaviors;
        window.sjCollection = sjCollection;
        window.computeOffset = computeOffset;
        window.processEachEffect = processEachEffect;
        return window.sj = sj;
      }
    };
  });

}).call(this);

//# sourceMappingURL=../assets/scrolljunkie.js.map
