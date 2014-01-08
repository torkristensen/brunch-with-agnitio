(function(){
	"use strict"
	document.addEventListener("slideEnter", function(){
		app.scroller.disableAll();
	});
	document.addEventListener("slideEnter", function(){
		setTimeout(function(){
			app.scroller.enableAll();
		}, 600)
	});
})();