(function(){
	'use strict';
	var lastActiveSlide,
		monitoringPageEnter = function(options){
			var slideName, chapterName, inlineSlide;
			if(app.slideshow.embedded[0]){
				inlineSlide = app.json.structures[app.slideshow.embedded[0].slideshow].content.indexOf(options.slideId);
			}
			if(lastActiveSlide !== options.slideId){
				lastActiveSlide = options.slideId;
				if(app.json.slides[options.slideId]){
					slideName = app.json.slides[options.slideId].name;
				}
				chapterName = app.json.structures[options.chapterId].title.replace(/<sup>&reg;<\/sup>/g, "® ").replace(/<br\/>/g, " ");
				console.log(slideName + "  -   " + chapterName);
				ag.submit.slide({
					id: slideName.replace(/\s+/g, "_"),
					name: slideName,
					chapter: chapterName,
					chapterId: chapterName.toLowerCase().trim().replace(/\s+|\-/g, "_"),
					slideIndex: app.slideshow.currentIndex,
					path: '/' + options.chapterId + '/' + options.slideId
				});
			}
		};
	document.addEventListener("presentationInit", function(){
		document.addEventListener('slideEnter', function(event){
			var slideshow = app.slideshow,
				chapterId = slideshow.id,
				slideId, slideElement;
			slideElement = event.target;
			slideId = slideElement.id;
			monitoringPageEnter({
				slideshow: slideshow,
				chapterId: chapterId,
				slideId: slideId,
				slideElement: slideElement
			});
		});
		document.addEventListener('slidePopupEnter', function(event){
			var slideshow = app.slideshow,
				chapterId = slideshow.id,
				slideId,
				slideElement = event.target;
			slideId = slideElement.id;
			monitoringPageEnter({
				slideshow: slideshow,
				chapterId: chapterId,
				slideId: slideId,
				slideElement: slideElement
			});
		});
	});
	window.monitoringPageEnter = monitoringPageEnter;
})();