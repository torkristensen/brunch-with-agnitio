(function(){
	'use strict';
	var tooltip, closeButton, activeButton, isTooltipOpen = false;

	closeButton = document.createElement('button');
	closeButton.className = 'close-button';
	closeButton.addEventListener('click', function(){
		tooltip.classList.remove("active");
		if(activeButton){
			activeButton.classList.remove('active');
		}
	});

	document.addEventListener('presentationInit', function(){
		app.tooltip = {};
		app.tooltip.closeButton = closeButton;
		app.tooltip.create = function(element, link, callback){
			if(link){
				if(activeButton){
					activeButton.classList.remove('active');
					tooltip.classList.remove('active');
				}
				link.classList.add('active');
				activeButton = link;
			}

			isTooltipOpen = true;
			tooltip = element;

			element.appendChild(closeButton);
			element.classList.add('active');

			setTimeout(function(){
				callback(element);
			}, 0);
		};
	});

	document.addEventListener('contentLoad', function(){
		document.querySelectorAll('[data-tooltip]').forEach(function(element){
			var link = element.getAttribute('data-tooltip');

			element.addEventListener('click', function(){
				if(!element.classList.contains('active')){
					if(activeButton){
						activeButton.classList.remove('active');
						tooltip.classList.remove('active');
					}
					element.classList.add('active');
					activeButton = element;

					tooltip = document.getElementById(link);
					tooltip.appendChild(closeButton);
					tooltip.classList.add("active");

					isTooltipOpen = true;
				}
			});
		});
	});
	document.addEventListener('slideExit', function(event){
		if(isTooltipOpen){
			tooltip.classList.remove('active');
			if(activeButton){
				activeButton.classList.remove('active');
			}
			isTooltipOpen = false;
		}
	});
})();