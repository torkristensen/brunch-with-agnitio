(function(){
	"use strict";

	var thumbsContainer, scrollContainer, thumbs, thumbsDraggy, menuButton, mainMenu,
		activeSlideshowColumn, activeSlideButton, columnScrolls = [];

	function buildThumbnails(){
		thumbsContainer = document.getElementById("thumbs");
		scrollContainer = document.createElement("div");
		
		scrollContainer.className = "scroll-container";

		thumbsContainer.appendChild(scrollContainer);

		app.slideshowIds.forEach(function(slideshowId){
			var structure = app.json.structures[slideshowId],
				slidesIds, slideshowColumn, columnScrollContainer,
				columnScroll;

			if(!structure.ignore || structure.ignore.indexOf('thumbs') === -1){
				slideshowColumn = document.createElement("div");
				columnScrollContainer = document.createElement("div");

				columnScrollContainer.className = "column-scroll-container";

				slideshowColumn.setAttribute("data-slideshow", slideshowId);

				slidesIds = app.slideshows[slideshowId].content;

				columnScroll = new ContentScroller(columnScrollContainer);

				columnScroll.onscroll = function(){
					if(this.translateY > this.maxScrollY){
						slideshowColumn.classList.add("overflow-down");
					}else{
						slideshowColumn.classList.remove("overflow-down");
					}

					if(this.translateY !== 0){
						slideshowColumn.classList.add("overflow-up");
					}else{
						slideshowColumn.classList.remove("overflow-up");
					}
				};

				columnScrolls.push(columnScroll);

				slidesIds.forEach(function(slideId){
					var button = document.createElement("button"),
						image = new Image();

					button.setAttribute("data-slide", slideId);
					image.src = "content/img/thumbs/" + slideId + ".jpg";

					button.addEventListener("tap", function(){
						if(app.slideshow.current !== slideId){
							setTimeout(function(){
								app.goTo("jaydess_collection", slideshowId, slideId);
								columnScroll.scrollToElement(button, "200ms");
							}, 0);
						}
					});

					button.appendChild(image);

					columnScrollContainer.appendChild(button);
					slideshowColumn.appendChild(columnScrollContainer);

				});

				scrollContainer.appendChild(slideshowColumn);
			}
		});
		thumbsContainer.addEventListener(touchy.events.start, touchy.stop);
	}

	function moveThumbs(position){
		var cssText = "-webkit-transition: 0.5s ease-out; -webkit-transform: translate3d(0, " + position + "px, 0);";

		thumbsContainer.style.cssText = cssText;
		thumbsDraggy.ele.style.cssText = cssText;

		setTimeout(function(){
			thumbsDraggy.moveTo(0, position);
		}, 500);
	}

	function checkDraggyPosition(){
		var deltaLimits = thumbsDraggy.config.limitsY[1] - thumbsDraggy.config.limitsY[0],
			position, cssText;

		if(thumbsDraggy.position[1] >= deltaLimits / 2){
			position = thumbsDraggy.config.limitsY[1];
			mainMenu.classList.add("thumbs-opened");
		}else{
			position = 0;
			mainMenu.classList.remove("thumbs-opened");
		}

		moveThumbs(position);
	}

	function initializeDragging(){
		mainMenu = document.getElementById("mainmenu");
		menuButton = mainMenu.children[0];

		thumbsDraggy = new Draggy(menuButton, {
			restrictX: true,
			limitsY: [0, 683],
			onChange: function(x, y){
				thumbsContainer.style.cssText = "-webkit-transform: translate3d(0, " + y + "px, 0);";
			}
		});

		thumbsDraggy.disable();

		document.addEventListener("onDrop", function(event){
			checkDraggyPosition();
			app.scroller.enableAll();
		});

		document.addEventListener("onDrag", function(event){
			app.scroller.disableAll();
		});

		menuButton.addEventListener("tap", function(){
			if(mainMenu.classList.contains("visible")){
				thumbs.disable();

				setTimeout(function(){
					thumbs.hide();
				}, 0);
			}else{
				thumbs.enable();

				columnScrolls.forEach(function(columnScroll){
					columnScroll.refresh();
					columnScroll.onscroll();
				});
			}
		});

		app.menu.scroller.onscroll = function(){
			setTimeout(function(){
				scrollContainer.style.cssText = "-webkit-transform: translate3d(" + app.menu.scroller.translateX + "px, 0, 0);";
			}, 0);
		};
	}

	thumbs = {
		hide: function(){
			mainMenu.classList.remove("thumbs-opened");
			moveThumbs(0);
		},
		enable: function(){
			thumbsDraggy.enable();
		},
		disable: function(){
			thumbsDraggy.disable();
		}
	};

	document.addEventListener("slideEnter", function(){
		var slideButton = scrollContainer.querySelector("[data-slide=" + app.slideshow.current + "]");

		if(activeSlideButton){
			activeSlideButton.classList.remove("active");
		}

		if(slideButton){	
			slideButton.classList.add("active");
			activeSlideButton = slideButton;
		}
	});

	document.addEventListener("sectionEnter", function(){
		var slideshowColumn = scrollContainer.querySelector("[data-slideshow=" + app.slideshow.id + "]");

		if(activeSlideshowColumn){
			activeSlideshowColumn.classList.remove("active");
		}

		if(slideshowColumn){
			slideshowColumn.classList.add("active");

			activeSlideshowColumn = slideshowColumn;
		}


		app.menu.scroller.onscroll();
	});
	
	document.addEventListener("presentationInit", function(){
		buildThumbnails();
		initializeDragging();

		app.thumbs = thumbs;
	});
})();