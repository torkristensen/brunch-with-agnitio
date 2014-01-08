(function(){
	'use strict';
	document.addEventListener('contentLoad', function(event){
		var element = event.target,
			containers = element.getElementsByClassName('flip-container');
		containers.forEach(function(container){
			var frontFlipButton = document.createElement('button'),
				backFlipButton = document.createElement('button');
			frontFlipButton.className = backFlipButton.className = 'flip-button';
			frontFlipButton.addEventListener('tap', function(){
				container.classList.add('flipped');
			});
			backFlipButton.addEventListener('tap', function(){
				container.classList.remove('flipped');
			});
			container.getElementsByClassName('front')[0].appendChild(frontFlipButton);
			container.getElementsByClassName('back')[0].appendChild(backFlipButton);
		});
		/*document.addEventListener('slideEnter', function(){
			containers.forEach(function(container){
				container.classList.add('preserved');
			});
		});
		document.addEventListener('slideExit', function(){
			containers.forEach(function(container){
				container.classList.remove('preserved');
			});
		});*/
	});
})();