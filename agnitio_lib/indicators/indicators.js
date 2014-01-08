(function(){
	'use strict';
	var indicatorsContainer, slideshowContainer, indicators;

	document.addEventListener('presentationInit', function(){
		indicatorsContainer = document.getElementById('indicators');
		slideshowContainer = document.getElementById('toolbarSlideshow');

		app.indicators = {
			hide: function(){
				indicatorsContainer.classList.add('hidden');
			},
			show: function(){
				indicatorsContainer.classList.remove('hidden');
			},
			clear: function(){
				utils.removeChildren(indicatorsContainer);
			}
		};
	});

	document.addEventListener('contentLoad', function(){
		var slides = slideshowContainer.querySelectorAll('article.slide.indicated');

		indicators = {};
		utils.removeChildren(indicatorsContainer);

		if(slides.length > 1){
			slides.forEach(function(slide){
				var indicator = indicators[slide.id] = document.createElement('input');

				indicator.type = 'radio';
				indicator.name = 'indicator';
				indicatorsContainer.appendChild(indicator);
			});
		}
	});

	document.addEventListener('slideEnter', function(){
		var slideId = event.target.id;

		if(indicators.hasOwnProperty(slideId)){
			indicators[slideId].checked = true;
		}
	});
})();