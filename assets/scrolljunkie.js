(function() {
  $(document).ready(function() {
    return $.fn.scrollJunkie = function(opts) {
      var activeSelector, checkMediaQuery, computeOffset, debugDisplay, debugOutput, doTransforms, i, initTransforms, io, log, newCollection, performTransform, processEachEffect, sj, sjBehaviors, sjCollection, updateDebug, v, vo, _ref;
      activeSelector = '[data-scrolljunkie]';
      debugOutput = opts.debug || false;
      debugDisplay = $('<div style="position:fixed;bottom:10px;right:10px;background:black;color:white;padding:3px;font-size:12px">test</div');
      if (debugOutput) {
        $('body').append(debugDisplay);
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
                  init: v.init || function() {},
                  resize: v.resize || function() {},
                  perform: v.perform || function() {},
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
      newCollection = this.find(activeSelector);
      if ($.data(document.body, 'sjCollection')) {
        sjCollection = $.data(document.body, 'sjCollection').add(newCollection);
      } else {
        sjCollection = $.data(document.body, 'sjCollection', newCollection);
      }
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
                f.behavior = elementBehavior;
                f.mediaQuery = sjBehaviors[elementBehavior].mediaQuery;
                f.host = that;
                f.elements = {};
                f.data = {};
                f.startOffset = null;
                f.endOffset = null;
                f.sj = sj;
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
      checkMediaQuery = function(mq) {
        return true;
      };
      performTransform = function(effect) {};
      processEachEffect(function() {
        return this.init();
      });
      updateDebug = function() {
        return debugDisplay.html("" + sj.topOffset + "px scroll offset<br> " + sj.windowHeight + "px window height<br> " + sj.documentHeight + "px doc height");
      };
      $(window).on('resize', function(e) {
        sj.documentHeight = $(document).height();
        sj.windowHeight = $(window).height();
        sj.maxOffset = sj.documentHeight - sj.windowHeight;
        processEachEffect(function() {
          this.width = this.host.outerWidth();
          this.height = this.host.outerHeight();
          this.topOffset = this.host.offset().top;
          this.startOffset = computeOffset(this.height, sj.windowHeight, this.topOffset, sj.maxOffset, this.start);
          this.endOffset = computeOffset(this.height, sj.windowHeight, this.topOffset, sj.maxOffset, this.end);
          return this.resize();
        });
        if (debugOutput) {
          return updateDebug();
        }
      });
      $(window).on('scroll', function(e) {
        sj.topOffset = $(window).scrollTop();
        if (sj.topOffset < 1) {
          sj.topOffset = 0;
        }
        if (sj.topOffset > sj.maxOffset) {
          sj.topOffset = sj.maxOffset;
        }
        processEachEffect(function() {
          var _ref1;
          if ((this.startOffset < (_ref1 = sj.topOffset) && _ref1 < this.endOffset)) {
            this.perform();
            if (this.transform.ratioY !== "0") {
              return doTransforms(this);
            }
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
