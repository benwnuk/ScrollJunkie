$(document).ready ()->
	$.fn.scrollJunkie = (opts)->

		activeSelector = '[data-scrolljunkie]'
		debugOutput = true

		sj = {}

		log = (output)->
			console.log(output) if debugOutput

		$.data(document.body, 'sjBehaviors', {}) unless $.data(document.body, 'sjBehaviors') 
		sjBehaviors = $.data(document.body, 'sjBehaviors')
		if $.isPlainObject(opts)
			for io, vo of opts
				sjBehaviors[io] =
					mediaQuery : vo.mediaQuery || ''
					effects : for i, v of vo.effects
						start : v.start || '-100vh'
						end : v.end || '100%'
						easing : v.easing || 'linear'
						init : v.init || ()->
						resize : v.resize || ()->
						perform : v.perform || ()->
						transform : 
							scale : if v.transform and v.transform.scale then v.transform.scale else false
							overflow : if v.transform and v.transform.overflow then v.transform.overflow else 'hide'
							align : if v.transform and v.transform.align then v.transform.align else 50
							ratioX : if v.transform and v.transform.ratioX then v.transform.ratioX else 0
							ratioY : if v.transform and v.transform.ratioY then v.transform.ratioY else 0

		newCollection = this.find(activeSelector)
		if $.data(document.body, 'sjCollection') 
			sjCollection = $.data(document.body, 'sjCollection').add(newCollection)
		else
			sjCollection = $.data(document.body, 'sjCollection', newCollection)
		
		# bind actual behaviors to the elements
		#  and bind element-specific data
		newCollection.each ()->
			elementEffects = []
			that = $(this)
			for elementBehavior in $(this).attr('data-scrolljunkie').split(',')
				if sjBehaviors[elementBehavior]?
					elementEffects = for e in sjBehaviors[elementBehavior].effects
						f = $.extend({}, e)
						f.behavior = elementBehavior
						f.mediaQuery = sjBehaviors[elementBehavior].mediaQuery
						f.host = that
						f.elements = {} # used to store custom elements that will be acted upon
						f.data = {} # used to store custom data that will be used to perform actions
						f.startOffset = null
						f.endOffset = null
						f.sj = sj
						f
					log "the behavior '#{elementBehavior}' was innitialized"
					#log elementEffects
				else
					log "the behavior '#{elementBehavior}' could not be initialized" 
			$(this).data 'elementEffects', elementEffects

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
				value = "#{offset} - #{value}"
			return eval(value)

		checkMediaQuery = (mq)->
			#check if the media query currently applies, return true or false
			return true

		performTransform = (effect)->
			# TODO

		# now initilize each objects effect
		processEachEffect ()->
			this.init()

		$(window).on 'resize', (e)->
			sj.documentHeight = $(document).height()
			sj.windowHeight = $(window).height()
			sj.topOffset = $(window).scrollTop()
			sj.maxOffset = sj.documentHeight - sj.windowHeight

			processEachEffect ()->
				# TODO 
				#  calculate start and end points for each element/effect
				#  calculate the width and height of each element/effect
				#  set the global viewport height
				this.resize()

		$(window).on 'scroll', (e)->
			# TODO
			#  set the global offset position, compensate for bounce
			#  go through all effects and act on the ones within range
			#   perform should be called with easing applied
			#   transform should be processed with easing applied

		if debugOutput
			window.sjBehaviors = sjBehaviors
			window.sjCollection = sjCollection
			window.computeOffset = computeOffset
			window.processEachEffect = processEachEffect
			window.sj = sj

		