/**
 * touchy.js
 *
 * A JavaScript microlibrary for UI interaction on Wekbit mobile and desktop.
 * Dispatches custom events to be used when normal events does not suffice.
 * NOTE: stopPropagation() will not work on these events, use touchy.stop(event) instead.
 *
 * @author     Stefan Liden
 * @version    0.3
 * @copyright  Copyright 2011 Stefan Liden
 * @license    Dual licensed under MIT and GPL
 */

(function() {
  var d = document,
      isTouch = 'ontouchstart' in window,
      doubleTap = false,
      touchEvents = {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend'
      },
      mouseEvents = {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
      },
      evts = isTouch ? touchEvents : mouseEvents,
      customEvents = {
        tap: '',
        doubleTap: '',
        twoFingerTap: '',
        longTouch: '',
        swipeleft: '',
        swiperight: '',
        swipeup: '',
        swipedown: ''
      },
      swipeEvents = ['tap', 'doubleTap', 'twoFingerTap', 'longTouch', 'swipeleft', 'swiperight', 'swipeup', 'swipedown'];

  // Create the custom events to be dispatched
  function createSwipeEvents () {
    swipeEvents.forEach(function(evt) {
      customEvents[evt] = d.createEvent('UIEvents');
      customEvents[evt].initEvent(evt, true, true);
    });
  }
  // Fix for stopPropagation not working in Webkit and Opera for custom events
  function stopBubbling (event) {
    event.cancelBubble = true;
    setTimeout(function() {
      event.cancelBubble = false;
    },0);
  }
  function onStart (event) {
    var startTime = new Date().getTime(),
        touch = isTouch ? event.touches[0] : event,
        nrOfFingers = isTouch ? event.touches.length : 1,
        startX, startY, hasMoved;

    startX = touch.clientX;
    startY = touch.clientY;
    hasMoved = false;

    d.addEventListener(evts.move, onMove, true);
    d.addEventListener(evts.end, onEnd, true);

    function onMove (event) {
      if(isTouch){
        event = event.touches[0];
      }
      hasMoved = Math.abs(startX - event.clientX) > 10 || Math.abs(startY - event.clientY) > 10;
      nrOfFingers = isTouch ? event.touches.length : 1;
    }
    function onEnd (event) {
      var endX, endY, diffX, diffY,
          ele = event.target,
          customEvent = '',
          endTime = new Date().getTime(),
          timeDiff = endTime - startTime;

      touch = isTouch ? touch : event;

      if (nrOfFingers === 1) {
        if (!hasMoved) {
          if (timeDiff <= 500) {
            if (doubleTap) {
              ele.dispatchEvent(customEvents.doubleTap);
              doubleTap = false;
            }
            else {
              ele.dispatchEvent(customEvents.tap);
              doubleTap = true;
            }
            resetDoubleTap();
          }
          else {
            ele.dispatchEvent(customEvents.longTouch);
          }
        }
        else {
          if (timeDiff < 500) {
            endX = touch.clientX;
            endY = touch.clientY;
            diffX = endX-startX;
            diffY = endY-startY;
            dirX = diffX > 0 ? 'right' : 'left';
            dirY = diffY > 0 ? 'down' : 'up';
            absDiffX = Math.abs(diffX);
            absDiffY = Math.abs(diffY);
	        if(absDiffX > 100 || absDiffY > 100){
		      if (absDiffX >= absDiffY) {
			    customEvent = 'swipe' + dirX;
		      }
		      else {
			    customEvent = 'swipe' + dirY;
		      }
		      ele.dispatchEvent(customEvents[customEvent]);
	        }
          }
        }
      }
      else if (nrOfFingers === 2) {
        ele.dispatchEvent(customEvents.twoFingerTap);
      }

      d.removeEventListener(evts.move, onMove, true);
      d.removeEventListener(evts.end, onEnd, true);
    }
  }

  function resetDoubleTap() {
    setTimeout(function() {doubleTap = false;}, 400);
  }


  createSwipeEvents();
  d.addEventListener(evts.start, onStart, true);

  // Return an object to access useful properties and methods
  return window.touchy = {
    isTouch: isTouch,
    stop: stopBubbling,
    events: evts
  }
}());