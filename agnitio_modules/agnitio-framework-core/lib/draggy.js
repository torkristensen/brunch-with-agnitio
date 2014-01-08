/**
 * draggy.js
 *
 * A JavaScript/CSS3 microlibrary for moving elements in Webkit browsers.
 *
 * BROWSER SUPPORT: Safari, Chrome, Firefox, Opera, IE9
 *
 * @author     Stefan Liden
 * @version    0.9
 * @copyright  Copyright 2012 Stefan Liden (Jofan)
 * @license    Dual licensed under MIT and GPL
 */

(function() {
	'use strict';

	// PPK script for getting position of element
	// http://www.quirksmode.org/js/findpos.html
	function getPosition(ele) {
		var curleft = 0;
		var curtop = 0;
		if (ele.offsetParent) {
			do {
				curleft += ele.offsetLeft;
				curtop += ele.offsetTop;
			} while (ele = ele.offsetParent);
		}
		return [curleft,curtop];
	}

	// Browser compatibility
	var transform = {};
	(function() {
		var ele = document.createElement('div');
		if ('WebkitTransform' in ele.style) {
			transform.pre = '-webkit-transform:translate(';
			transform.post = ');';
			transform.pre3d = '-webkit-transform:translate3d(';
			transform.post3d = ', 0px);';
		}
		else if ('MozTransform' in ele.style) {
			transform.pre = '-moz-transform:translate(';
			transform.post = ');';
		}
		else if ('msTransform' in ele.style) {
			transform.pre = '-ms-transform:translate(';
			transform.post = ');';
		}
		else if ('OTransform' in ele.style) {
			transform.pre = '-o-transform:translate(';
			transform.post = ');';
		}
		else {
			transform.pre = 'transform:translate(';
			transform.post = ');';
		}
	}());

	var d = document,
		isTouch = 'ontouchstart' in window,
		mouseEvents = {
			start: 'mousedown',
			move: 'mousemove',
			end: 'mouseup'
		},
		touchEvents = {
			start: 'touchstart',
			move: 'touchmove',
			end: 'touchend'
		},
		events = isTouch ? touchEvents : mouseEvents;

	window.onDrag = d.createEvent('UIEvents');
	window.onDrop = d.createEvent('UIEvents');
	onDrag.initEvent('onDrag', true, true);
	onDrop.initEvent('onDrop', true, true);

	window.Draggy = function(attachTo, config) {
		this.attachTo = attachTo;
		this.config   = config || {};
		this.onChange = this.config.onChange || function() {};
		this.position = [0,0];
		this.bindTo   = this.config.bindTo || null;
		this.init();
	};

	Draggy.prototype = {
		init: function() {
			this.ele           = (typeof this.attachTo === 'string' ? d.getElementById(this.attachTo) : this.attachTo);
			this.ele.draggy    = this;
			this.ele.onChange  = this.onChange;
			this.ele.position  = this.position || [0, 0];
			this.ele.restrictX = this.config.restrictX || false;
			this.ele.restrictY = this.config.restrictY || false;
			this.ele.limitsX   = this.config.limitsX || [-9999, 9999];
			this.ele.limitsY   = this.config.limitsY || [-9999, 9999];
			this.ele.snapBack  = this.config.snapBack || false;
			this.ele.stopPropagation = this.config.stopPropagation || false;
			this.ele.transformStringStart = this.config.transform3d ? transform.pre3d : transform.pre;
			this.ele.transformStringEnd = this.config.transform3d ? transform.post3d : transform.post;

			if (this.bindTo) {
				this.bind(this.bindTo);
			}
			this.enable();
		},
		// Reinitialize draggy object and move to saved position
		reInit: function() {
			this.init();
			this.setTo(this.ele.position[0], this.ele.position[1]);
		},
		// Disable the draggy object so that it can't be moved
		disable: function() {
			this.ele.removeEventListener(events.start, this.dragStart);
		},
		// Enable the draggy object so that it can be moved
		enable: function() {
			this.ele.addEventListener(events.start, this.dragStart);
		},
		// Get current state and prepare for moving object
		dragStart: function(e) {
			var restrictX = this.restrictX,
				restrictY = this.restrictY,
				limitsX = this.limitsX,
				limitsY = this.limitsY,
				relativeX = this.position[0],
				relativeY = this.position[1],
				posX = isTouch ? e.touches[0].pageX : e.clientX,
				posY = isTouch ? e.touches[0].pageY : e.clientY,
				newX, newY,
				self = this; // The DOM element

			this.classList.add('active-drag');

			if(this.stopPropagation){
				e.stopPropagation();
			}

			d.addEventListener(events.move, dragMove);
			d.addEventListener(events.end, dragEnd);

			// Move draggy object using CSS3 translate3d
			function dragMove (e) {
				e.preventDefault();
				var movedX, movedY, relX, relY,
					clientX = isTouch ? e.touches[0].pageX : e.clientX,
					clientY = isTouch ? e.touches[0].pageY : e.clientY;
				if (!restrictX) {
					// Mouse movement (x axis) in px
					movedX = clientX - posX;
					// New pixel value (x axis) of element
					newX = relativeX + movedX;
					if (newX >= limitsX[0] && newX <= limitsX[1]) {
						posX = clientX;
						relativeX = newX;
					}
					else if (newX < limitsX[0]) {
						posX = clientX;
						relativeX = limitsX[0];
					}
					else if (newX > limitsX[1]) {
						posX = clientX;
						relativeX = limitsX[1];
					}
				}
				if (!restrictY) {
					movedY = clientY - posY;
					newY = relativeY + movedY;
					if (newY >= limitsY[0] && newY <= limitsY[1]) {
						posY = clientY;
						relativeY = newY;
					}
					else if (newY < limitsY[0]) {
						posY = clientY;
						relativeY = limitsY[0];
					}
					else if (newY > limitsY[1]) {
						posY = clientY;
						relativeY = limitsY[1];
					}
				}
				self.pointerPosition = [posX, posY];
				self.position = [relativeX, relativeY];
				self.style.cssText = self.transformStringStart + relativeX + 'px,' + relativeY + 'px' + self.transformStringEnd;
				self.onChange(relativeX, relativeY);
				self.dispatchEvent(onDrag);
			}
			// Stop moving draggy object, save position and dispatch onDrop event
			function dragEnd (e) {
				self.pointerPosition = [posX, posY];
				self.draggy.position = self.position;
				self.draggy.ele.classList.remove('active-drag');
				self.dispatchEvent(onDrop);
				d.removeEventListener(events.move, dragMove);
				d.removeEventListener(events.end, dragEnd);
			}

		},
		// API method for moving the draggy object
		// Position is updated
		// Limits and restrictions are adhered to
		// Callback is NOT called
		// onDrop event is NOT dispatched
		moveTo: function(x,y) {
			x = this.ele.restrictX ? 0 : x;
			y = this.ele.restrictY ? 0 : y;
			if (x < this.ele.limitsX[0] || x > this.ele.limitsX[1]) { return; }
			if (y < this.ele.limitsY[0] || y > this.ele.limitsY[1]) { return; }
			this.ele.style.cssText = transform.pre + x + 'px,' + y + 'px' + transform.post;
			this.ele.position = this.position = [x,y];
		},
		// API method for setting the draggy object at a certain point
		// Limits and restrictions are adhered to
		// Callback is called
		// onDrop event is dispatched
		setTo: function(x,y) {
			x = this.ele.restrictX ? 0 : x;
			y = this.ele.restrictY ? 0 : y;
			if (x < this.ele.limitsX[0] || x > this.ele.limitsX[1]) { return; }
			if (y < this.ele.limitsY[0] || y > this.ele.limitsY[1]) { return; }
			this.ele.style.cssText = transform.pre + x + 'px,' + y + 'px' + transform.post;
			this.ele.onChange(x, y);
			this.ele.dispatchEvent(onDrop);
			this.ele.position = this.position = [x,y];
		},
		// API method for resetting position of draggy object
		reset: function() {
			this.ele.style.cssText = transform.pre + '0, 0' + transform.post;
			this.ele.position = [0,0];
		},
		// API method for restricting draggy object to boundaries of an element
		// Sets x and y limits
		// Used internally of config option "bindTo" is used
		bind: function(element) {
			var ele = (typeof element === 'string' ? d.getElementById(element) : element),
					draggyPos, elePos, draggyWidth, eleWidth, draggyHeight, eleHeight,
					xLimit1, xLimit2, yLimit1, yLimit2;

			if (ele) {
				draggyPos    = getPosition(this.ele),
				elePos       = getPosition(ele),
				draggyWidth  = this.ele.offsetWidth,
				eleWidth     = ele.offsetWidth,
				draggyHeight = this.ele.offsetHeight,
				eleHeight    = ele.offsetHeight,
				xLimit1      = elePos[0] - draggyPos[0],
				yLimit1      = elePos[1] - draggyPos[1],
				xLimit2      = (eleWidth - draggyWidth) - Math.abs(xLimit1),
				yLimit2      = (eleHeight - draggyHeight) - Math.abs(yLimit1);

				this.ele.limitsX = [xLimit1, xLimit2];
				this.ele.limitsY = [yLimit1, yLimit2];

			}
		}
	};

	window.DropZones = function(ids) {
		this.ids = ids;
		this.init();
	}

	DropZones.prototype = {
		zones: {},
		init: function() {
			var self = this;
			this.ids.forEach(function(id) {
				self.zones[id] = {};
				self.zones[id].ele = document.getElementById(id);
			});
		}
	}

}());