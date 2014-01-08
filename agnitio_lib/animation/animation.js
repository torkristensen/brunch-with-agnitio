(function(){
	'use strict';
	document.addEventListener('slideEnter', function(event){
		setTimeout(function(){
			event.target.classList.add('animated');
		}, 400);
	}, false);
	document.addEventListener('slideExit', function(event){
		event.target.classList.remove('animated');
	}, false);
})();
