$(document).ready ()->
	$.fn.scrollJunkie = (opts)->

		activeSelector = '[data-scrolljunkie]'
		debugOutput = true

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
			#log $(this)
			elementBehaviors = []
			that = $(this)
			$(this).data 'elementBehaviors', elementBehaviors
			for elementBehavior in $(this).attr('data-scrolljunkie').split(',')
				if sjBehaviors[elementBehavior]?
					nb = $.extend({}, sjBehaviors[elementBehavior])
					for effect in nb.effects
						effect.elements = {}
						effect.host = that
						effect.data = {}
					elementBehaviors.push(nb)
				else
					log "the behavior #{elementBehavior} could not been initialized" 

		processEachEffect = (callback)->
			# provide a callback, will be passed the effect in the context of the element as this
			sjCollection.each ()->
				that = $(this)
				for elementBehavior in $(this).data('elementBehaviors')
					if callback? and checkMediaQuery(elementBehavior.mediaQuery)
						for effect in elementBehavior.effects
							# callback will consider the effect itself to be "this"
							callback.call(effect)
			
		computeOffset = (eh, vh, value)->
			# provided the element height, vieport height, and the value string, return an offset in px used to compute start/end
			# strip out all non-acceptable chars
			# replace vh
			# replace %
			# evaluate and return

		checkMediaQuery = (mq)->
			#check if the media query currently applies, return true or false
			return true

		if debugOutput
			window.sjBehaviors = sjBehaviors
			window.sjCollection = sjCollection
			window.computeOffset = computeOffset
			window.processEachEffect = processEachEffect

		