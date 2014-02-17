$(document).ready ()->
	$.fn.scrollJunkie = (opts)->


		easingFunc =
			linear: (t)-> t
			easeInQuad: (t)-> t*t
			easeOutQuad: (t)-> t*(2-t)
			easeInOutQuad: (t)-> t<.5 ? 2*t*t : -1+(4-2*t)*t
			easeInCubic: (t)-> t*t*t
			easeOutCubic: (t)-> (--t)*t*t+1
			easeInOutCubic: (t)-> t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
			easeInQuart: (t)-> t*t*t*t
			easeOutQuart: (t)-> 1-(--t)*t*t*t
			easeInOutQuart: (t)-> t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t
			easeInQuint: (t)-> t*t*t*t*t
			easeOutQuint: (t)-> 1+(--t)*t*t*t*t
			easeInOutQuint: (t)-> t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t

		body = $('body')
		activeSelector = opts.dataAttribute || 'data-scrolljunkie'
		debugOutput = opts.debug || false
		debugDisplay = $('<div style="position:fixed;bottom:10px;right:10px;background:black;color:white;padding:3px;font-size:12px">test</div')

		if debugOutput
			body.append(debugDisplay)

		sj = {} # used to store global variables like scroll position 

		log = (output)->
			console.log(output) if debugOutput

		$.data(document.body, 'sjBehaviors', {}) unless $.data(document.body, 'sjBehaviors') 
		sjBehaviors = $.data(document.body, 'sjBehaviors')
		if $.isPlainObject(opts.behaviors)
			for io, vo of opts.behaviors
				sjBehaviors[io] =
					mediaQuery : vo.mediaQuery || ''
					effects : for i, v of vo.effects
						start : v.start || '-100vh'
						end : v.end || '100%'
						easing : v.easing || 'linear'
						clone : v.clone || (v.transform and v.transform.ratioY != 0) || false
						init : v.init || ()->
						onResize : v.onResize || ()->
						onScroll : v.onScroll || ()->
						transform : 
							scale : if v.transform and v.transform.scale then v.transform.scale else false
							overflow : if v.transform and v.transform.overflow then v.transform.overflow else 'hide'
							align : if v.transform and v.transform.align then v.transform.align else 50
							#ratioX : if v.transform and v.transform.ratioX then v.transform.ratioX else 0
							ratioY : if v.transform and v.transform.ratioY then v.transform.ratioY else 0

		newCollection = this.find("[#{activeSelector}]")
		if $.data(document.body, 'sjCollection') 
			sjCollection = $.data(document.body, 'sjCollection').add(newCollection)
		else
			sjCollection = $.data(document.body, 'sjCollection', newCollection)
		
		checkMediaQuery = (mq)->
			#check if the media query currently applies, return true or false
			return true

		processEachEffect = (callback)->
			# provide a callback, will be passed the effect in the context of the element as this
			sjCollection.each ()->
				that = $(this)
				for effect in $(this).data('elementEffects')
					if callback? and checkMediaQuery(effect.mediaQuery)
						# callback will consider the effect itself to be "this"
						callback.call(effect)
						# log effect
			return false

		# later used to determine if a fixed clone container will need to be created or not
		anyClones = false

		# bind actual behaviors to the elements
		#  and bind element-specific data
		newCollection.each ()->
			elementEffects = []
			that = $(this)
			for elementBehavior in $(this).attr('data-scrolljunkie').split(',')
				if sjBehaviors[elementBehavior]?
					elementEffects = for e in sjBehaviors[elementBehavior].effects
						f = $.extend({}, e)
						f.behaviorName = elementBehavior
						f.mediaQuery = sjBehaviors[elementBehavior].mediaQuery
						f.host = that
						f.elements = {} # used to store custom elements that will be acted upon
						f.data = {} # used to store custom data that will be used to perform actions
						f.sj = sj
						# keep an eye for effects that will use clone
						anyClones = true if that.clone

						f
					log "the behavior '#{elementBehavior}' was innitialized"
					#log elementEffects
				else
					log "the behavior '#{elementBehavior}' could not be initialized" 
			$(this).data 'elementEffects', elementEffects

		# if clones are in play, create a cloneDiv and make some copies
		if anyClones
			sj.cloneDiv = $('<div style="position:fixed;top:0;width:100%;background:green;height:0"></div>')
			body.append(sj.cloneDiv)
			# TODO
			#  if the element is a transition, it will need to be placed in wrapper

			processEachEffect ()->
				if this.clone
					this.clone = this.host.clone()
					sj.cloneDiv.append(this.clone)
					# TODO
					#  if the element will use transforms, then put cloned element in a
					#   set child container to show or hide overflow as directed




		computeOffset = (eh, vh, offset, endOffset, value)->
			# eh : elements height
			# vh : the viewports height
			# offset : the elements distance from the top of the page
			# endOffset : the full offset for the whole page, docHeight - vh
			# value : the string that will be interpretted
			# valid units are:
			#	###px, ###%, ###vh, start, end
			# valid math is:
			#	+, -, *, /, (, )

			# strip out all non-acceptable chars
			value = value.replace(/[^0-9vVhH\-\+\*\/\%()(start)(end)]+/g, '') # TODO - make this filter better
			# wrap vh or % with paranthesis
			value = value.replace(/\d+(vh|%)/g, "($&)")
			# replace vh with math
			value = value.replace(/vh/g, "*(#{vh}/100)")
			# replace % with math
			value = value.replace(/%/g, "*(#{eh}/100)")
			# evaluate and return

			if value.match('start')
				value = value.replace(/start/g, 0)
			else if value.match('end')
				value = value.replace(/end/g, endOffset)
			else
				value = "#{offset} + #{value}"
			return eval(value)

		positionClone = (effect)->
			# TODO
			#  keep clone over host element, used for both simple clones and transforms


		performTransform = (effect)->
			# TODO
			#  do lots of math, scoot things around


		# now initilize each objects effect
		processEachEffect ()->
			this.init()

		updateDebug = ()->
			debugDisplay.html(
				"#{sj.topOffset}px scroll offset<br>
				#{sj.windowHeight}px window height<br>
				#{sj.documentHeight}px doc height")

		$(window).on 'resize', (event)->
			sj.documentHeight = $(document).height()
			sj.windowHeight = $(window).height()
			sj.maxOffset = sj.documentHeight - sj.windowHeight
			processEachEffect ()->
				this.resize = {}
				this.resize.width = this.host.outerWidth()
				this.resize.height = this.host.outerHeight()
				this.resize.topOffset = this.host.offset().top
				this.resize.startOffset = computeOffset(
					this.resize.height, 
					sj.windowHeight, 
					this.resize.topOffset, 
					sj.maxOffset, 
					this.start)
				this.resize.endOffset = computeOffset(
					this.resize.height, 
					sj.windowHeight, 
					this.resize.topOffset, 
					sj.maxOffset, 
					this.end)
				this.resize.rangeOffset = this.resize.endOffset - this.resize.startOffset
				this.onResize.call(this)

			if debugOutput
				updateDebug()

		$(window).on 'scroll', (event)->
			# TODO
			#  set the global offset position, compensate for bounce DONE
			#  go through all effects and act on the ones within range DONE
			#   perform should be called with easing applied
			#   transform should be processed with easing applied
			sj.topOffset = $(window).scrollTop()
			sj.topOffset = 0 if sj.topOffset < 1
			sj.topOffset = sj.maxOffset if sj.topOffset > sj.maxOffset

			processEachEffect ()->
				this.scroll = {}
				this.scroll.pixelsFromStart = sj.topOffset - this.resize.startOffset
				this.scroll.percentFromStart = this.scroll.pixelsFromStart / this.resize.rangeOffset
				this.scroll.percentFromStartEased = easingFunc[this.easing](this.scroll.percentFromStart)
				this.scroll.pixelsFromStartEased = easingFunc[this.easing](this.scroll.percentFromStart) * this.scroll.pixelsFromStart
				this.onScroll.call(this)

				if this.clone
					positionClone(this)


				if this.transform.ratioY != "0"
					doTransforms(this)

			if debugOutput
				updateDebug()

		initTransforms = (effect)->
			# TODO
			#  create overlay element, bind into effect, etc

		doTransforms = (effect)->
			# TODO
			#  process transforms for this effect

		$(window).trigger('resize')
		$(window).trigger('scroll')

		if debugOutput
			window.sjBehaviors = sjBehaviors
			window.sjCollection = sjCollection
			window.computeOffset = computeOffset
			window.processEachEffect = processEachEffect
			window.sj = sj



		