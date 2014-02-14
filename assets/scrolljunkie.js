(function() {
  $(document).ready(function() {
    return $.fn.scrollJunkie = function(opts) {
      var activeSelector, checkMediaQuery, computeOffset, debugOutput, i, io, log, newCollection, processEachEffect, sjBehaviors, sjCollection, v, vo;
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
        var effect, elementBehavior, elementBehaviors, nb, that, _i, _j, _len, _len1, _ref, _ref1, _results;
        elementBehaviors = [];
        that = $(this);
        $(this).data('elementBehaviors', elementBehaviors);
        _ref = $(this).attr('data-scrolljunkie').split(',');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elementBehavior = _ref[_i];
          if (sjBehaviors[elementBehavior] != null) {
            nb = $.extend({}, sjBehaviors[elementBehavior]);
            _ref1 = nb.effects;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              effect = _ref1[_j];
              effect.elements = {};
              effect.host = that;
              effect.data = {};
            }
            _results.push(elementBehaviors.push(nb));
          } else {
            _results.push(log("the behavior " + elementBehavior + " could not been initialized"));
          }
        }
        return _results;
      });
      processEachEffect = function(callback) {
        return sjCollection.each(function() {
          var effect, elementBehavior, that, _i, _len, _ref, _results;
          that = $(this);
          _ref = $(this).data('elementBehaviors');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            elementBehavior = _ref[_i];
            if ((callback != null) && checkMediaQuery(elementBehavior.mediaQuery)) {
              _results.push((function() {
                var _j, _len1, _ref1, _results1;
                _ref1 = elementBehavior.effects;
                _results1 = [];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  effect = _ref1[_j];
                  _results1.push(callback.call(effect));
                }
                return _results1;
              })());
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
      };
      computeOffset = function(eh, vh, value) {};
      checkMediaQuery = function(mq) {
        return true;
      };
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
