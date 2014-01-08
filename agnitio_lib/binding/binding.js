(function(){
	'use strict';
	var handlers = {
			'popup': function(element, attribute){
				var attrs = attribute.replace(/\s+/g, '').split(','),
					popup = app[attrs[0]],
					slide = attrs[1];

				element.addEventListener('tap', function(event){
                    if(app.slideshow.current !== 'references'){
                        touchy.stop(event);
                        popup.show(slide);
                    }
				});
			},
			'switch-on': function(element, attribute){
				classController(element, attribute, function(event, target, className){
					target.classList.add(className);
				});
			},
			'switch-off': function(element, attribute){
				classController(element, attribute, function(event, target, className){
					target.classList.remove(className);
				});
			},
			'toggle': function(element, attribute){
				classController(element, attribute, function(event, target, className){
					target.classList.toggle(className);
				});
			},
			'href': function(element, attribute){
				element.addEventListener('tap', function(event){
					touchy.stop(event);
					app.goTo.apply(app, attribute.split('/'));
				});
			},
			'ag-pdf': function(element){
                element.addEventListener('tap', function(event){
                    touchy.stop(event);
                    util.openPDF(element.getAttribute('data-ag-pdf'));
                });
			},
			'menu': function(element){
				var active = element.querySelector('.active');

				element.addEventListener('tap', function(event){
					var child = event.target;

					if(child.parentNode === element){
						if(active){
							active.classList.remove('active');
						}

						active = child;
						child.classList.add('active');
					}
				});
			},
			'remove-on-delay': function(element, attribute){
				var timer;
				element.addEventListener('tap', function(){
					timer = setTimeout(function(){
						document.getElementById(attribute.split(' ')[0]).classList.remove(attribute.split(' ')[1]);
					}, 5000);
				});
			},
			'blur': function(element){
				element.addEventListener('tap', function(){
					var focused = document.querySelector('input:focus');

					if(focused){
						focused.blur();
					}
				});
			}
		};

	function classController(element, attribute, tapHandler){
		var target, className;

		attribute = attribute.split(' ');
		target = document.getElementById(attribute[0]);
		className = attribute[1];

		element.addEventListener('tap', function(event){
			setTimeout(function(){
				tapHandler(event, target, className);
			}, 0);
		});
	}

	function applyBindings(element){
		if(!element){
			element = document;
		}

		Object.keys(handlers).forEach(function(bindKey){
			var attribute = 'data-' + bindKey,
				handler = handlers[bindKey];
			element.querySelectorAll('[' + attribute + ']').forEach(function(element){
				var bindingFlag = 'wasBinded' + bindKey;

				if(!element[bindingFlag]){
					handler(element, element.getAttribute(attribute));
					element[bindingFlag] = true;
				}
			});
		});
	}

	document.addEventListener('presentationInit', function(){
		app.binding = {
			handlers: handlers,
			apply: applyBindings
		};
	});

	document.addEventListener('contentLoad', function(){
		applyBindings();
	});

	document.addEventListener('slidePopupEnter', function(){
		applyBindings();
	});
})();