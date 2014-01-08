/**
 * agnitio.js
 *
 * The Agnitio Content API
 * Documentation can be found at:
 * http://wiki.agnitio.com/index.php/Agnitio_Content_API_(iPad)
 *
 * @author     Stefan Liden
 * @copyright  Copyright 2012 Agnitio
 */

(function () {


	var api_version = '1.0',
		ua = navigator.userAgent,

		isiPad = /iPad/i.test(ua) || /iPhone OS 3_1_2/i.test(ua) || /iPhone OS 3_2_2/i.test(ua),
		isSafari = ua.match(/Safari/i) != null,
		isiPlanner = isiPad && !isSafari;


	function calliPlanner (api, params) {
		var invokeString, iFrame;
		if (isiPlanner) {
			invokeString = "objc://iplanner/" + api + "?" + encodeURIComponent(params),
			iFrame = document.createElement("IFRAME");
			iFrame.setAttribute("src", invokeString);
			document.body.appendChild(iFrame);
			iFrame.parentNode.removeChild(iFrame);
			iFrame = null;
		}
	}

	window.ag = window.ag || {};

	ag.captureImage = function (options) {
		var params = {
			directCall: options.directCall || true,
			imageData: options.imageData || '',
			imageDescription: options.imageDescription || null,
			signatory: options.signatory || null,
			signatoryEmail: options.signatoryEmail || null,
			emailRecipients: options.emailRecipients || null,
			emailSubject: options.emailSubject || null,
			emailBody: options.emailBody || null
		},
		args;
		if (isiPlanner) {
			args = JSON.stringify(params);
			calliPlanner('sigCapture', args);
		}
	}

	ag.openPDF = function (path, name) {
		var log = log || false,
				fileName;
		if (isiPlanner) {
			calliPlanner('openPDF', path);
		}

		if (name) {
			fileName = path.replace(/^.*[\\\/]/, '');
			ag.submit.document(fileName, name);
		}
	}


	ag.sendMail = function (address, subject, body, fileName) {
		var args, invokeString, iFrame;
		if (isiPlanner) {
			args = JSON.stringify({'address': address, 'subject': subject, 'body':body, 'fileName': fileName});
			calliPlanner('sendMail', args);
		}
	}

	ag.data = (function() {

		var call_contacts = null;


		function saveContacts (data) {
			var contacts = JSON.parse(data);
			ag.data.call_contacts = contacts;
		}


		function getCallContacts () {
			if (isiPlanner) {
				calliPlanner('getCallContacts', 'ag.data._saveContacts');
			}
		}


		return {
			call_contacts: call_contacts,
			getCallContacts: getCallContacts,
			_saveContacts: saveContacts
		}

	}());

	ag.submit = (function() {

		var currentSlideId = null,
				currentData = null,
				enabled = true;

		function isEnabled () {
			return enabled;
		}

		function disable () {
			enabled = false;
		}

		function enable () {
			enabled = true;
		}


		function save (data) {
			var formattedData, beacon, url;
			if (isEnabled) {
				formattedData = JSON.stringify(data);

			}
		}


		function saveForiPlanner (data) {
			var formattedData;
			if (isEnabled) {
				formattedData = JSON.stringify(data);
				calliPlanner('monitoringEvent', formattedData);
			}
		}


		function timestamp () {
			return Math.floor((new Date().getTime()) / 1000);
		}


		function slide (data) {

			var monitoringData,
				now            = timestamp(),
				chapterName    = data.chapter || null,
				chapterId      = data.chapterId || null,
				subChapterName = data.subChapter || null,
				subChapterId   = data.subChapterId || null,
				slideIndex     = data.slideIndex || null,
				slidePath      = data.path || null,
				parent         = data.parent || null,
				grandParent    = data.grandParent || null;



			if (chapterName) {
				if (subChapterName) {
					grandParent = grandParent || chapterName;
					parent = parent || subChapterName;
				}
				else {
					parent = parent || chapterName;
				}
			}
			else if (subChapterName) {

			}


			if (currentSlideId) { slideExit(); }


			monitoringData = {
				type: "system",
				categoryId: null,
				category: "slideEnter",
				labelId: "id",
				label: "name",
				valueId: data.id,
				value: data.name,
				valueType: null,
				time: now,
				slideIndex: slideIndex,
				slidePath: slidePath,
				chapterName: chapterName,
				chapterId: chapterId,
				subChapterName: subChapterName,
				subChapterId: subChapterId,
				parentSlideName: parent,
				parentOfParentSlideName: grandParent
			};


			currentSlideId = data.id;
			currentData = data;

			save(monitoringData);
		}


		function slideExit () {

			var data, now;

			if (!currentSlideId) { return; }

			now = timestamp();

			data = {
				type: "system",
				categoryId: null,
				category: "slideExit",
				labelId: "id",
				label: "name",
				valueId: currentSlideId,
				value: undefined,
				valueType: undefined,
				time: now,
				slidePath: undefined,
				chapterName:undefined,
				chapterId: undefined,
				subChapterName: undefined,
				subChapterId: undefined
			};


			currentSlideId = null;


			save(data);
		}


		function resume () {
			ag.submit.slide(currentData);
		}


		function documentOpen (id, name) {

			var data, now;

			now = timestamp();


			data = {
				type: "system",
				categoryId: null,
				category: "documentOpen",
				labelId: "id",
				label: "name",
				valueId: id,
				value: name,
				valueType: null,
				time: now
			};


			currentDocument = id;

			save(data);
		}


		function documentClose () {

			var data, now;

			if (!currentDocument) { return; }

			now = timestamp();


			data = {
				type: "system",
				categoryId: null,
				category: "documentClose",
				labelId: "id",
				label: "name",
				valueId: currentDocument,
				value: undefined,
				valueType: undefined,
				time: now
			};


			currentDocument = null;

			save(data);
		}


		function referenceOpen (id, name) {

			var data, now;

			now = timestamp();


			data = {
				type: "system",
				categoryId: null,
				category: "referenceOpen",
				labelId: "id",
				label: "name",
				valueId: id,
				value: name,
				valueType: null,
				time: now
			};


			currentDocument = id;

			save(data);
		}


		function mediaOpen (id, name) {

			var data, now;

			now = timestamp();


			data = {
				type: "system",
				categoryId: null,
				category: "mediaOpen",
				labelId: "id",
				label: "name",
				valueId: id,
				value: name,
				valueType: null,
				time: now
			};

			save(data);
		}


		function structure (name, structure) {

			var monitorData,
					now = timestamp();

			monitorData = {
				isUnique: true,
				type: "custom",
				category: "Presentation structure",
				categoryId: "ag-002",
				label: name,
				labelId: "",
				value: structure,
				valueId: "",
				valueType: "text",
				time: now
			}

			save(monitorData);
		}


		function customEvent (data) {

			var monitorData,
					now = timestamp(),
					category = data.category || 'Uncategorized',
					categoryId = data.categoryId || null,
					labelId = data.labelId || null,
					valueId = data.valueId || null,
					valueType = data.valueType || 'text',
					path = data.path || null;
					isUnique = data.unique || false;

			monitorData = {
				isUnique: isUnique,
				type: "custom",
				category: category,
				categoryId: categoryId,
				label: data.label,
				labelId: labelId,
				value: data.value,
				valueId: valueId,
				valueType: valueType,
				slidePath: path,
				time: now
			}

			save(monitorData);
		}


		if (isiPlanner) {
			save = saveForiPlanner;
		}
		else {
			//TODO: Create the necessary objects that are normally created by iPlanner
		}


		return {
			isEnabled: isEnabled,
			disable: disable,
			enable: enable,
			slide: slide,
			resume: resume,
			document: documentOpen,
			reference: referenceOpen,
			media: mediaOpen,
			structure: structure,
			data: customEvent,
			event: customEvent,
			_slideExit: slideExit
		}

	}());

	if (!isiPad && !window.JSON) {
		var script  = document.createElement('script');
		script.src  = file;
		script.type = 'text/javascript';
		script.defer = true;
		document.getElementsByTagName('head').item(0).appendChild('lib/json2.js');

	}

	ag.submit.data({
		unique: true,
		categoryId: "ag-001",
		category: "Versions",
		labelId: "ag-001-001",
		label: "Agnitio API version",
		value: api_version
	});

	if (!window.openPDF) {
		window.openPDF = ag.openPDF;
	}
	if (!window.sendMail) {
		window.sendMail = ag.sendMail;
	}
	if (!window.closePresentation) {
		window.closePresentation = function() {
			//ag.closePresentation;
		};
	}


	if (!window.submitSlideEnter) {
		window.isMonitoringEnabled = ag.submit.isEnabled;
		window.monitorSayHello = function() {};
		window.submitSlideEnter = function(slideId, slideName, slideIndex, parent, grandparent) {
			var gp = grandparent || null,
					p = parent || null,
					i = slideIndex || null;
			ag.submit.slide({
				grandParent: gp,
				parent: p,
				slideIndex: i,
				id: slideId,
				name: slideName
			});
		};
		window.submitSlideExit = function() {
			ag.submit._slideExit();
		}
		window.submitSlideReEnter = function() {
			ag.submit.resume();
		}
		window.submitDocumentOpen = function(id, name) {
			ag.submit.document(id, name);
		}
		window.submitReferenceOpen = function(id, name) {
			ag.submit.reference(id, name);
		}
		window.submitCustomEvent = function(category, label, value, valueType) {
			var vt = valueType || 'text';
			ag.submit.event({
				category: category,
				label: label,
				value: value,
				valueType: vt
			});
		}
		window.submitUniqueCustomEvent = function(category, label, value, valueType) {
			var vt = valueType || 'text';
			ag.submit.event({
				unique: true,
				category: category,
				label: label,
				value: value,
				valueType: vt
			});
		}
	}

}());