(function(){
	'use strict';
	var menuContainer, menuItems = {}, activeElement, scroller;

	document.addEventListener('presentationInit', function(){
		var menuScroller = document.createElement('div');

		menuScroller.className = 'scroll-container';
		menuContainer = document.getElementById('mainmenu');

		menuContainer.children[0].addEventListener('tap', function(){
			app.indicators.clear();
			app.toolbar.clear();
		});

		app.slideshowIds.forEach(function(slideshowId){
			var structure = app.json.structures[slideshowId],
				role = structure.role, button;

			if(!structure.ignore || structure.ignore.indexOf('menu') === -1){
				button = document.createElement('button');
				button.innerHTML = structure.title;
				button.setAttribute('data-slideshow', slideshowId);

				if(role){
					button.setAttribute('role', role);
				}

				button.addEventListener('tap', function(){
					app.popup.hide();
                    if(app.slideshow.id !== slideshowId){
						setTimeout(function(){
							app.goTo('jaydess_collection', slideshowId);
                            if(!app.menu.wasClicked){
                                window[app.slideshow.current].dispatchEvent(slideEnter);
                                app.menu.wasClicked = true;
                            }
                        }, 0);
					}

					// app.thumbs.hide();
				}, true);

				menuItems[slideshowId] = button;
				menuScroller.appendChild(button);
			}
		});

		menuContainer.addEventListener('swiperight', touchy.stop);
		menuContainer.addEventListener('swipeleft', touchy.stop);
		menuContainer.appendChild(menuScroller);

		scroller = new ContentScroller(menuScroller);

		setTimeout(function(){
			scroller.refresh();
			scroller.scrollTo(158, 0);
		}, 0);

		app.menu = {
			element: menuContainer,
			scroller: scroller,
            wasClicked: false,
			hide: function(){
				app.thumbs.hide();
				app.thumbs.disable();

				setTimeout(function(){
					menuContainer.classList.remove('visible');
				}, 0);
			},
			show: function(){
				menuContainer.classList.add('visible');
				scroller.refresh();
				scroller.scrollToElement(activeElement, '400ms');
			},
			refresh: function(){
				scroller.refresh();
				//scroller.scrollToElement(activeElement, '400ms');
			}
		};
	});

	document.addEventListener('sectionEnter', function(){
		var slideshowId = app.slideshow.id;

		if(activeElement){
			activeElement.classList.remove('active');
		}

		app.menu.refresh();

		if(menuItems.hasOwnProperty(slideshowId)){
			menuItems[slideshowId].classList.add('active');
			activeElement = menuItems[slideshowId];
			scroller.scrollToElement(activeElement, '400ms');
		}
	});

	document.addEventListener('slideExit', function(){
		app.menu.hide();
	});

	document.addEventListener('slidePopupEnter', function(){
		app.menu.hide();
	});
})();