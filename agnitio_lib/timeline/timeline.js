(function(){
	'use strict';
	document.addEventListener('presentationInit', function(){
		var timeline = document.getElementById('timelineNavigation'),
			switchButtons = timeline.getElementsByTagName('button'),
			activeButton = switchButtons[0],
			buttons = {},
			targetSlides = app.slides.placement_and_counselling,
			setActiveButton = function(button){
				activeButton.classList.remove('active');
				button.classList.add('active');
				activeButton = button;
			};

		switchButtons.forEach(function(button, index){
			buttons[targetSlides[index]] = switchButtons[index];
		});

		app.timeline = {
			hide: function(){
				timeline.classList.remove('open');
			},
			show: function(){
				timeline.classList.add('open');
			}
		};

		document.addEventListener('slideEnter', function(){
			var slideId = app.slideshow.current;
			if(buttons.hasOwnProperty(slideId)){
				setActiveButton(buttons[slideId]);
			}
		});
	});

	document.addEventListener('sectionEnter', function(){
		if(app.slideshow.id === "placement_and_counselling"){
			app.timeline.show();
		}
	});

	document.addEventListener('sectionExit', function(){
		app.timeline.hide();
	});
})();