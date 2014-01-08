/**
* AGNITIO FRAMEWORK MODULE - SlidePopup
* This module will dynamically load a slide and
* display it on top of the presentation.
* CSS is used to customize the look of the popup window.
* REQUIREMENTS: touchy.js, util.js
* @author - Stefan Liden, sli@agnitio.com
*/
(function() {
	/**
	* Custom events for the Slide popup module
	* The SlidePopup module will dispatch events letting
	* the presentation now when a popup has been opened and closed,
	* and that a slide has been entered and exited.
	*/
	window.slidePopupLoad = document.createEvent('UIEvents');
	window.slidePopupUnload = document.createEvent('UIEvents');
	window.slidePopupEnter= document.createEvent('UIEvents');
	window.slidePopupExit= document.createEvent('UIEvents');
	slidePopupLoad.initEvent('slidePopupLoad', true, false);
	slidePopupUnload.initEvent('slidePopupUnload', true, false);
	slidePopupEnter.initEvent('slidePopupEnter', true, false);
	slidePopupExit.initEvent('slidePopupExit', true, false);

	var d = document;

	// TODO: Create backButton element on show, remove on hide

	window.SlidePopup = function(id, backButtonId) {
		var that=this;
		this.version = '1.2';
		this.requirements = 'touchy.js, util.js',
		this.id = id;
		this.ele = app.elements.popup = d.getElementById(id);
		this.backButton = d.getElementById(backButtonId);
		this.markup = '';
		this.isVisible = false;
		d.addEventListener("slideEnter",function(){that.hide();});
	};

	SlidePopup.prototype = {
		// TODO: add doc comment
		show: function(slide) {
			var self = this;
			var markup, closeButton;

			// If changing content without hiding, call onExit for previous slide
			if (this.isVisible) {
				if (app.slide[this.slide]) {
					app.slide[this.slide].onExit(this.slideEle);
				}
			}

			this.isVisible = true;

			// Close the popup if jumping to another slideshow/collection
			document.addEventListener('contentUnload', function(e) {
				self.hide();
				document.removeEventListener('contentUnload', arguments.callee);
			});

			this.slide = slide;
			this.slideEle;
			// Make sure the slide is not already part of active slideshow
			if (app.slideshow.content.indexOf(slide) === -1) {
				app.getHtml(slide, app.pathToSlides, function(data) { markup = data; });
				this.ele.innerHTML = markup;
				this.slideEle = this.ele.querySelector('.slide');
				util.addClass(this.ele, 'displaying');
				this.slideEle.dispatchEvent(slidePopupLoad);

				// Call the slide's onEnter method if available
				if (app.slide[slide]) {
					app.getSlideElements(slide, this.slideEle);
					app.slide[slide].onEnter(this.slideEle);
				}

				// Disable presentation scrolling while popup is displayed
				if (app.scroller) {
					app.scroller.disableAll();
				}

				// Make sure backbutton is visible and working
				// TODO: remove inline CSS, replace with class
				if(this.backButton){
					closeButton = this.backButton.cloneNode();


					this.ele.appendChild(closeButton);
					closeButton.classList.add('visible');

					closeButton.addEventListener('tap', function(e) {
						closeButton.classList.remove('visible');
						closeButton.removeEventListener('tap', arguments.callee);
						closeButton.parentNode.appendChild(closeButton);
						self.hide(slide);
					});
				}

				// Let the presentation know that a slide has been loaded
				self.slideEle.dispatchEvent(slidePopupEnter);
			}
			else {
				console.log('Content is already part of slideshow');
			}
		},

		// TODO: add doc comment
		hide: function() {
			var self = this;
			if (this.isVisible) {
				this.isVisible = false;
				util.removeClass(this.ele, 'displaying');
				setTimeout(function() {
					if (app.slide[self.slide]) {
						app.slide[self.slide].onExit(self.slideEle);
					}
					self.ele.innerHTML = '';
					if (app.scroller) {
						app.scroller.enableAll();
					}
				}, 400);
				this.slideEle.dispatchEvent(slidePopupUnload);
				this.slideEle.dispatchEvent(slidePopupExit);
			}
		}

	};
})();