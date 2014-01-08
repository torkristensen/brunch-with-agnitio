(function(){
	'use strict';
	var directions = {
			left: -1,
			right: 1
		},
		CoverScroll;

	CoverScroll = function(parentSelector, options){
		var parentElement, 
			options = options || {},
			that = this;

		if(typeof parentSelector === 'string'){
			parentElement = document.querySelector(parentSelector);
		}else if(parentSelector instanceof HTMLElement){
			parentElement = parentSelector;
		}
		if(parentElement){
			['swipeleft', 'swiperight'].forEach(function(eventName){
				parentElement.addEventListener(eventName, that);
			});
			this.container = parentElement;
			this.items = parentElement.getElementsByClassName('cover-item');
			this.currentIndex = options.startIndex || 0;
			this.onstart = options.onstart;
			this.rebuild();
		}
	}

	CoverScroll.prototype.handleEvent = function(event){
		var direction = directions[event.type.replace('swipe', '')]
		this.currentIndex -= direction;
		if(this.currentIndex < 0){
			this.currentIndex = this.items.length - 1;
		}
		if(this.currentIndex === this.items.length){
			this.currentIndex = 0;
		}
		if(this.onstart){
			this.onstart(direction);
		}
		this.rebuild();
	};

	CoverScroll.prototype.rebuild = function(){
		var that = this,
			invisibleLeftIndex,
			visibleLeftIndex,
			invisibleRightIndex,
			visibleRightIndex,
			itemsLength = this.items.length;

		this.items.forEach(function(item){
			item.className = item.className.replace(/(current|visible-left|visible-right|invisible-left|invisible-right)/g, '');
		});

		invisibleLeftIndex = this.currentIndex - 2;
		if(invisibleLeftIndex < 0){
			invisibleLeftIndex = itemsLength + invisibleLeftIndex;
		}

		visibleLeftIndex = this.currentIndex - 1;
		if(visibleLeftIndex < 0){
			visibleLeftIndex = itemsLength + visibleLeftIndex;
		}

		visibleRightIndex = this.currentIndex + 1;
		if(visibleRightIndex > itemsLength - 1){
			visibleRightIndex = visibleRightIndex - itemsLength;
		}

		invisibleRightIndex = this.currentIndex + 2;
		if(invisibleRightIndex > itemsLength - 1){
			invisibleRightIndex = invisibleRightIndex - itemsLength;
		}

		this.items[invisibleLeftIndex].classList.add('invisible-left');
		this.items[visibleLeftIndex].classList.add('visible-left');
		this.items[this.currentIndex].classList.add('current');
		this.items[visibleRightIndex].classList.add('visible-right');
		this.items[invisibleRightIndex].classList.add('invisible-right');
	}

	window.CoverScroll = CoverScroll;
})();