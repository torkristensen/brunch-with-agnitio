(function(){
	'use strict';
	var slideshow;

	document.addEventListener('presentationInit', function(){
		var toolbar = document.getElementById('toolbar'),
			activeSlideshow, activeButton;
		window.toolBarOpen = document.createEvent('UIEvents');
		toolBarOpen.initEvent('toolBarOpen', true, false);
		slideshow = document.getElementById('toolbarSlideshow');

		toolbar.children[0].addEventListener('tap', function(){
			if(toolbar.classList.contains('expanded')){
				app.indicators.clear();
				app.toolbar.clear();
			}
		});

		app.binding.handlers['toolbar-open'] = function(element, attribute){
			element.addEventListener('tap', function(){
				app.toolbar.open(attribute);
			});
		};

		app.toolbar = {
			clear: function(){
				var activeButton = toolbar.querySelector('.toolbar-navigation .active');

				if(activeButton){
					activeButton.classList.remove('active')
				}
			},
			hide: function(){
				toolbar.className = toolbar.className.replace(/(visible|expanded)/g, '');
				this.removeEmbedded();
			},
			removeEmbedded: function(){
				if(activeSlideshow){
					app.slideshow.removeEmbedded();
				}
			},
			open: function(path){
				path = path.split('/');

				this.removeEmbedded();

				activeSlideshow = app.slideshow.embed(path[0], slideshow);

				if(path[1]){
					activeSlideshow.scrollTo(path[1]);
				}
				toolbar.classList.add('expanded');

			}
		};

		toolbar.addEventListener('swipeup', touchy.stop);
		toolbar.addEventListener('swipedown', touchy.stop);
		toolbar.addEventListener('swipeleft', touchy.stop);
		toolbar.addEventListener('swiperight', touchy.stop);
	});

	document.addEventListener('slideExit', function(event){
		if(event.target.parentNode.parentNode.parentNode !== slideshow){
			app.toolbar.clear();
			app.toolbar.hide();
		}
	})
})();