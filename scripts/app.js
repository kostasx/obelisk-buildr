/*!
 * obelisk-builder
 * Copyright (c) 2013 Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict';

// TODO: move this elsewhere
obelisk.Point3D.prototype.clone = function() {
	return new obelisk.Point3D(this.x, this.y, this.z);
};

/**
 * Module dependencies.
 */

var ui = require('./ui'),
	tool = require('./tool'),
	pointer = require('./pointer'),
	history = require('./history'),
	storage = require('./storage');

/**
 * Private variables
 */

var canvasEl = document.getElementById('scene');
var persistLock = false;
var autoSaveTimeout;
var resizeTimeout;
var fullCanvased = false;

/**
 * Module declaration.
 */

var app = {};

/**
 *  Shift Detect
 */
app.shiftHandler = false;

// Wow! What a bad, bad practice... Shame on me!
app.createPixelArray = function( imageDataArray, width, height ){

	var pixelArray = []; // Array( width * height )

	var initial = 0;
	var tetarto = 0;
	var x = 0;
	var y = 0;
	var z = 0;

	$.each( imageDataArray.data, function( index, value ){

		if ( index % 4 === 0 ){

			pixelArray[initial] = { "x" : x, "y" : y, "z" : z, "c" : value.toString()[0], "rgba": [value] };
			tetarto = 0;
			initial++;
			x++;

			if ( x % 20 === 0 && index !== 0 ){
				// console.log(index, y);
				x = 0;
				y = ( y + 1 );
			}


		} else {

			pixelArray[initial-1].rgba.push(value);
			tetarto++;

		}

	});

	return pixelArray;

};

app.getImageData = function( imageData, image, imageCtx ){

    var pixelArray = this.createPixelArray( imageData, imageData.width, imageData.height );

	pixelArray = { "colors":["0x333399","9999984","0xFFFFFF","15382272","15658734"], "data": pixelArray };

	// var statistics = { "colors":["7441408","9001384","13117481","15382272","15658734"], "data":[{"x":0,"y":0,"z":0,"c":2},{"x":0,"y":1,"z":0,"c":2},{"x":0,"y":1,"z":1,"c":2},{"x":0,"y":2,"z":0,"c":2},{"x":0,"y":2,"z":1,"c":2},{"x":0,"y":2,"z":2,"c":2},{"x":0,"y":2,"z":3,"c":2},{"x":0,"y":2,"z":4,"c":2},{"x":0,"y":2,"z":5,"c":2},{"x":0,"y":3,"z":0,"c":2},{"x":0,"y":3,"z":1,"c":2},{"x":0,"y":3,"z":2,"c":2},{"x":0,"y":3,"z":3,"c":2},{"x":0,"y":4,"z":0,"c":2},{"x":0,"y":4,"z":1,"c":2},{"x":0,"y":4,"z":2,"c":2},{"x":0,"y":5,"z":0,"c":2},{"x":0,"y":5,"z":1,"c":2},{"x":0,"y":5,"z":2,"c":2},{"x":0,"y":6,"z":0,"c":2},{"x":0,"y":6,"z":1,"c":2},{"x":0,"y":6,"z":2,"c":2},{"x":0,"y":6,"z":3,"c":2},{"x":0,"y":7,"z":0,"c":2},{"x":0,"y":7,"z":1,"c":2},{"x":0,"y":7,"z":2,"c":2},{"x":0,"y":7,"z":3,"c":2},{"x":0,"y":7,"z":4,"c":2},{"x":0,"y":7,"z":5,"c":2},{"x":0,"y":7,"z":6,"c":2},{"x":0,"y":8,"z":0,"c":2},{"x":0,"y":8,"z":1,"c":2},{"x":0,"y":8,"z":2,"c":2},{"x":0,"y":8,"z":3,"c":2},{"x":0,"y":8,"z":4,"c":2},{"x":0,"y":9,"z":0,"c":2},{"x":0,"y":9,"z":1,"c":2},{"x":0,"y":9,"z":2,"c":2},{"x":0,"y":9,"z":3,"c":2},{"x":0,"y":10,"z":0,"c":2},{"x":0,"y":10,"z":1,"c":2},{"x":0,"y":10,"z":2,"c":2},{"x":0,"y":11,"z":0,"c":2},{"x":0,"y":11,"z":1,"c":2},{"x":0,"y":12,"z":0,"c":2},{"x":0,"y":12,"z":1,"c":2},{"x":0,"y":12,"z":2,"c":2},{"x":0,"y":13,"z":0,"c":2},{"x":0,"y":13,"z":1,"c":2},{"x":0,"y":13,"z":2,"c":2},{"x":0,"y":13,"z":3,"c":2},{"x":0,"y":13,"z":4,"c":2},{"x":0,"y":14,"z":0,"c":2},{"x":0,"y":14,"z":1,"c":2},{"x":0,"y":14,"z":2,"c":2},{"x":0,"y":14,"z":3,"c":2},{"x":0,"y":14,"z":4,"c":2},{"x":0,"y":14,"z":5,"c":2},{"x":0,"y":15,"z":0,"c":2},{"x":0,"y":15,"z":1,"c":2},{"x":0,"y":15,"z":2,"c":2},{"x":0,"y":15,"z":3,"c":2},{"x":0,"y":15,"z":4,"c":2},{"x":0,"y":16,"z":0,"c":2},{"x":0,"y":16,"z":1,"c":2},{"x":0,"y":16,"z":2,"c":2},{"x":0,"y":16,"z":3,"c":2},{"x":0,"y":17,"z":0,"c":2},{"x":0,"y":17,"z":1,"c":2},{"x":0,"y":17,"z":2,"c":2},{"x":0,"y":18,"z":0,"c":2},{"x":0,"y":18,"z":1,"c":2},{"x":0,"y":19,"z":0,"c":2},{"x":4,"y":0,"z":0,"c":4},{"x":5,"y":0,"z":0,"c":0},{"x":5,"y":0,"z":1,"c":0},{"x":5,"y":0,"z":2,"c":0},{"x":5,"y":1,"z":0,"c":0},{"x":5,"y":1,"z":1,"c":0},{"x":5,"y":1,"z":2,"c":0},{"x":5,"y":1,"z":3,"c":0},{"x":5,"y":1,"z":4,"c":0},{"x":5,"y":2,"z":0,"c":0},{"x":5,"y":2,"z":1,"c":0},{"x":5,"y":2,"z":2,"c":0},{"x":5,"y":3,"z":0,"c":0},{"x":5,"y":3,"z":1,"c":0},{"x":5,"y":4,"z":0,"c":0},{"x":5,"y":5,"z":0,"c":0},{"x":5,"y":6,"z":0,"c":0},{"x":5,"y":7,"z":0,"c":0},{"x":5,"y":7,"z":1,"c":0},{"x":5,"y":8,"z":0,"c":0},{"x":5,"y":8,"z":1,"c":0},{"x":5,"y":9,"z":0,"c":0},{"x":5,"y":9,"z":1,"c":0},{"x":5,"y":9,"z":2,"c":0},{"x":5,"y":10,"z":0,"c":0},{"x":5,"y":10,"z":1,"c":0},{"x":5,"y":10,"z":2,"c":0},{"x":5,"y":10,"z":3,"c":0},{"x":5,"y":11,"z":0,"c":0},{"x":5,"y":11,"z":1,"c":0},{"x":5,"y":11,"z":2,"c":0},{"x":5,"y":11,"z":3,"c":0},{"x":5,"y":11,"z":4,"c":0},{"x":5,"y":11,"z":5,"c":0},{"x":5,"y":11,"z":6,"c":0},{"x":5,"y":11,"z":7,"c":0},{"x":5,"y":12,"z":0,"c":0},{"x":5,"y":12,"z":1,"c":0},{"x":5,"y":12,"z":2,"c":0},{"x":5,"y":12,"z":3,"c":0},{"x":5,"y":13,"z":0,"c":0},{"x":5,"y":13,"z":1,"c":0},{"x":5,"y":13,"z":2,"c":0},{"x":5,"y":14,"z":0,"c":0},{"x":5,"y":14,"z":1,"c":0},{"x":5,"y":14,"z":2,"c":0},{"x":5,"y":14,"z":3,"c":0},{"x":5,"y":15,"z":0,"c":0},{"x":5,"y":15,"z":1,"c":0},{"x":5,"y":15,"z":2,"c":0},{"x":5,"y":16,"z":0,"c":0},{"x":5,"y":16,"z":1,"c":0},{"x":5,"y":17,"z":0,"c":0},{"x":5,"y":17,"z":1,"c":0},{"x":5,"y":18,"z":0,"c":0},{"x":5,"y":18,"z":1,"c":0},{"x":5,"y":19,"z":0,"c":0},{"x":10,"y":1,"z":0,"c":3},{"x":10,"y":1,"z":1,"c":3},{"x":10,"y":1,"z":2,"c":3},{"x":10,"y":2,"z":0,"c":3},{"x":10,"y":2,"z":1,"c":3},{"x":10,"y":3,"z":0,"c":3},{"x":10,"y":3,"z":1,"c":3},{"x":10,"y":4,"z":0,"c":3},{"x":10,"y":4,"z":1,"c":3},{"x":10,"y":4,"z":2,"c":3},{"x":10,"y":4,"z":3,"c":3},{"x":10,"y":5,"z":0,"c":3},{"x":10,"y":5,"z":1,"c":3},{"x":10,"y":5,"z":2,"c":3},{"x":10,"y":6,"z":0,"c":3},{"x":10,"y":6,"z":1,"c":3},{"x":10,"y":6,"z":2,"c":3},{"x":10,"y":7,"z":0,"c":3},{"x":10,"y":7,"z":1,"c":3},{"x":10,"y":7,"z":2,"c":3},{"x":10,"y":8,"z":0,"c":3},{"x":10,"y":8,"z":1,"c":3},{"x":10,"y":8,"z":2,"c":3},{"x":10,"y":9,"z":0,"c":3},{"x":10,"y":9,"z":1,"c":3},{"x":10,"y":10,"z":0,"c":3},{"x":10,"y":11,"z":0,"c":3},{"x":10,"y":12,"z":0,"c":3},{"x":10,"y":12,"z":1,"c":3},{"x":10,"y":13,"z":0,"c":3},{"x":10,"y":13,"z":1,"c":3},{"x":10,"y":13,"z":2,"c":3},{"x":10,"y":14,"z":0,"c":3},{"x":10,"y":14,"z":1,"c":3},{"x":10,"y":14,"z":2,"c":3},{"x":10,"y":14,"z":3,"c":3},{"x":10,"y":15,"z":0,"c":3},{"x":10,"y":15,"z":1,"c":3},{"x":10,"y":15,"z":2,"c":3},{"x":10,"y":16,"z":0,"c":3},{"x":10,"y":16,"z":1,"c":3},{"x":10,"y":17,"z":0,"c":3},{"x":10,"y":18,"z":0,"c":3},{"x":10,"y":19,"z":0,"c":3},{"x":15,"y":0,"z":0,"c":1},{"x":15,"y":0,"z":1,"c":1},{"x":15,"y":0,"z":2,"c":1},{"x":15,"y":1,"z":0,"c":1},{"x":15,"y":1,"z":1,"c":1},{"x":15,"y":2,"z":0,"c":1},{"x":15,"y":3,"z":0,"c":1},{"x":15,"y":3,"z":1,"c":1},{"x":15,"y":3,"z":2,"c":1},{"x":15,"y":3,"z":3,"c":1},{"x":15,"y":4,"z":0,"c":1},{"x":15,"y":5,"z":0,"c":1},{"x":15,"y":6,"z":0,"c":1},{"x":15,"y":6,"z":1,"c":1},{"x":15,"y":7,"z":0,"c":1},{"x":15,"y":8,"z":0,"c":1},{"x":15,"y":9,"z":0,"c":1},{"x":15,"y":9,"z":1,"c":1},{"x":15,"y":9,"z":2,"c":1},{"x":15,"y":9,"z":3,"c":1},{"x":15,"y":9,"z":4,"c":1},{"x":15,"y":10,"z":0,"c":1},{"x":15,"y":10,"z":1,"c":1},{"x":15,"y":10,"z":2,"c":1},{"x":15,"y":11,"z":0,"c":1},{"x":15,"y":11,"z":1,"c":1},{"x":15,"y":12,"z":0,"c":1},{"x":15,"y":12,"z":1,"c":1},{"x":15,"y":13,"z":0,"c":1},{"x":15,"y":14,"z":0,"c":1},{"x":15,"y":15,"z":0,"c":1},{"x":15,"y":16,"z":0,"c":1},{"x":15,"y":16,"z":1,"c":1},{"x":15,"y":16,"z":2,"c":1},{"x":15,"y":16,"z":3,"c":1},{"x":15,"y":16,"z":4,"c":1},{"x":15,"y":16,"z":5,"c":1},{"x":15,"y":16,"z":6,"c":1},{"x":15,"y":17,"z":0,"c":1},{"x":15,"y":17,"z":1,"c":1},{"x":15,"y":17,"z":2,"c":1},{"x":15,"y":17,"z":3,"c":1},{"x":15,"y":18,"z":0,"c":1},{"x":15,"y":18,"z":1,"c":1},{"x":15,"y":18,"z":2,"c":1},{"x":15,"y":19,"z":0,"c":1}]};

    // console.log(pixelArray);

    return pixelArray;


};

/**
 *
 */
app.init = function() {

	ui.auth.init();
	ui.scene.init();

	ui.welcome.init(function() {
		ui.palette.init();

		tool.init(ui.scene)
			.use('brush');

		pointer.init(ui.scene)
			.click(tool.click)
			.drag(tool.drag);

		bindShortcuts();
		bindScroll();
		bindResize();

		touchDisclaimer();

		/*
		// fetches initial art
		storage.fetch(function(err, data, info) {
			if (err) return ui.notification.error(err);
			if (data) ui.scene.load(data);
			if (info) ui.notification.info(info);
			// auto save from now on
			ui.scene.changed(onAutoSave);
		});
		*/

	});

	// loadImage( "./img/cool.gif" );
	loadImage( "data:image/gif;base64,R0lGODlhFAAUANUAAAAAAP///+/3997e1tbWzv/nIf/eEP/eGPfWGO/OGPfOAP/WCNa1EM6tEKWMEOfGGOe9EN61EMalELWUEO/GGL2UCKWECKWce9alCLWMCK2ECJRzCN6tEJx7EGNSGHNjMZyUe86cCL2MCKV7CIxrCGtSCKWchIxjANacCJxzCHNjOXtrQmtKCGNKGGtSIZSEY3tjOaWUe9bOxufn5////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAADQALAAAAAAUABQAAAbRwIBwSCwaiQKCadVqrUwEwVE4i5UcjASlYSnFZkeCqpNAHA4IRAKyURGKA5cEUajb1Y+MazAUvCZ0dnZoayMvUgEAiouMjYtCMYpCjpOLMUIwDI51jhUwQh4PB4yCjBAhHqAPZoKtBgoRqJgNga11aA8cIp8BMQ5ltgWEEBgpIEIyJRDAggcGCbkhLDJCfhYPZYwL0BHFh0NxExDYCQkKDxAcGBoefEQEHyQcERAQEeohJx9vRlUsKSIwoBCRgsWXKQEEyLigoomKCzIQIZxIJAgAOw==" );

	// HANDLE THUMBNAIL CHANGE
	$(".thumbnails li").click(function(e){

		var imgSrc = $(this).find("img").attr("src");

		$(".thumbnails").find("li").removeClass('active');
		$(this).addClass("active");

		$("#myCanvas").show();
		$(".drop-image").hide();

		loadImage( imgSrc );

	});

	// HANDLE DRAG & DROP
	$('html').on('dragenter dragover', function(e) { e.stopPropagation(); });

	$('.drop-image').on('load', function() {
		if ( this.naturalWidth > 20 || this.naturalHeight > 20 ) {
		  console.log("IMAGE TOO LARGE");
		} else {
			$("#myCanvas").hide();
			$(".thumbnails li").removeClass("active");
			loadImage( this.src );
	  		$(this).show();
			$('.drop-placeholder').hide();
		}
	});

	$('.drop-zone')
	.on('dragover', function() {
	  $(this).addClass('drop-over');
	  return false;
	})
	.on('dragleave', function() {
	  $(this).removeClass('drop-over');
	  return false;
	})
	.on('drop', function(e) {

		if(e.originalEvent.dataTransfer){

			if(e.originalEvent.dataTransfer.files.length) {

				// $('.drop-image').hide();
				$(this).removeClass('drop-over');

			  	var file = e.originalEvent.dataTransfer.files[0];

				if (!file || file.type.indexOf('image/') !== 0) {
					console.log("NOT AN IMAGE");
				} else {
					if ( true ){
						var reader = new FileReader();
						reader.onload = function(e) {
						  $('.drop-image').attr('src', e.target.result );
						};
						reader.readAsDataURL(file);
					}
				}
			  e.preventDefault();
			  return false;

			}
		}
	});

	$('.drop-image, .drop-samples img').on('dragstart', function(e) {
		e.preventDefault();
	});

	// logCurious();
};

/**
 * @private
 */
function loadImage(imgSrc){

	var imageData;
	var imageCanvas = document.getElementById("myCanvas");
	var imageCtx    = imageCanvas.getContext("2d");
	var image       = new Image();
		image.src = imgSrc;

	$(image).load(function() {

	    imageCtx.drawImage(image, 0, 0, 20, 20);
	    imageData = imageCtx.getImageData(0, 0, 20, 20);
		var output = app.getImageData( imageData, image, imageCtx );
		storage.fetch(function(err, output, info) {
			if (err) return ui.notification.error(err);
		 // if (output) ui.scene.load(output);
			if (output) ui.scene.load( output, "rgba" );
			if (info) ui.notification.info(info);
			ui.scene.changed(onAutoSave); // auto save from now on
		}, output );

	});	

}


/**
 * @private
 */
function logCurious() {
	console.log('Hey! Curious or having bugs?');
	console.log('Please post ideas or issues here: https://github.com/ngryman/obelisk-buildr/issues.');
	console.log('You can play with the window.scene object.');
	if (console.table) {
		var methods = {
			snapshot: { description: 'Returns a base64 image of the current scene.' },
			load: { description: 'Loads a scene. Same format as the art.json file in gists.' },
			save: { description: 'Returns data associated with the current scene. Same format as the art.json file in gists.' }
		};
		console.table(methods);
	}
}

/**
 * @private
 */
function bindShortcuts() {
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
}

/**
 * @private
 */
function bindScroll() {
	var isFirefox = /Firefox/i.test(navigator.userAgent);
	document.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', onScroll);
}

/**
 * @private
 */
function bindResize() {
	window.addEventListener('resize', onResize);
}

/**
 * @private
 */
function touchDisclaimer() {
	var isChrome = /chrome/i.exec(navigator.userAgent),
		isAndroid = /android/i.exec(navigator.userAgent),
		hasTouch = 'ontouchstart' in window && !(isChrome && !isAndroid);

	if (hasTouch)
		ui.notification.error('Hey! For now, there is no real support for touch devices. Yeah i know...');
}

/**
 * @param {boolean} silent
 * @returns {object}
 * @private
 */
function save(silent) {
	var data = ui.scene.save(silent);
	storage.local(data);
	return data;
}

/**
 * @private
 */
function persist( local ) {
	if (persistLock) return;
	persistLock = true;

	// nothing to persist
	if (!ui.scene.changed() && !storage.orphan()) {
		persistLock = false;
		return ui.notification.error('nothing to save');
	}

	// saves locally
	var data = save();

	if ( local ) {
		console.log(JSON.stringify(data));
		persistLock = false;
		return;		
	}

	// persist to a gist
	storage.persist(data, function(err, info) {
		persistLock = false;
		if (err) return ui.notification.error(err);

		var anchor = '<a target="_blank" href="' + info.url + '">' + info.id + '</a>';
		ui.notification.info(info.action + ' gist ' + anchor);
	});
}

/**
 * @private
 */
function create() {
	storage.flush();
	ui.scene.clear();
	ui.notification.info('new craft!');
}

/**
 * @private
 */
function fullCanvas() {
	var display = fullCanvased ? 'block' : 'none';
	document.querySelector('header').style.display = display;
	document.querySelector('footer').style.display = display;

	var padding = fullCanvased ? '70px' : '0px';
	document.querySelector('main').style.paddingTop = padding;
	document.querySelector('main').style.paddingBottom = padding;

	ui.scene.resize();

	fullCanvased = !fullCanvased;
}

/**
 * @param {event} e
 * @private
 */
function onKeyDown(e) {
	switch (e.keyCode) {
		// +
		case 107:
			ui.scene.adjustFloor(+1);
			break;

		// -
		case 109:
			ui.scene.adjustFloor(-1);
			break;

		// left
		case 37:
			ui.scene.rotate(+1);
			break;

		// right
		case 39:
			ui.scene.rotate(-1);
			break;

		// b
		case 66:
			tool.use('brush');
			break;

		// e
		case 69:
			tool.use('erase');
			break;

		// space bar
		case 32:
			ui.palette.toggle();
			break;

		// ctrl + z
		case 90:
			if (e.ctrlKey) history.back();
			break;

		// ctrl + s
		case 83:
			e.preventDefault();
			if (e.ctrlKey) {

				if (e.shiftKey){

					persist( true );

				} else {
	
					persist();

				}

			}
			break;

		// n
		case 78:
			create();
			break;

		// f
		case 70:
			fullCanvas();
			break;

		// h
		case 72:
			e.preventDefault();
			ui.help.toggle();
			break;
	}

	// 123456789
	if (e.keyCode >= 49 && e.keyCode <= 57)
		tool.use('brush').set(ui.palette.color(e.keyCode - 49));

	// Shift Button Pressed
	if ( e.keyIdentifier === "Shift" )
		app.shiftHandler = true;

}

/**
 * @param {event} e
 * @private
 */
function onKeyUp(e) {

	if ( e.keyIdentifier === "Shift" )
		// Shift Button Unpressed
		app.shiftHandler = false;

}

/**
 * @param {event} e
 * @private
 */
function onScroll(e) {
	var delta = e.detail ? -e.detail : e.wheelDelta;
	ui.scene.adjustFloor(delta > 0 ? -1 : +1);
}

/**
 * @param {event} e
 * @private
 */
function onResize(e) {
	// hide on first event
	if (null == resizeTimeout)
		canvasEl.style.visibility = 'hidden';

	// debounce scene resize
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(function() {
		ui.scene.resize();
		canvasEl.style.visibility = 'visible';
		resizeTimeout = null;
	}, 100);
}

/**
 * @private
 */
function onAutoSave() {
	// debounce auto save
	clearTimeout(autoSaveTimeout);
	autoSaveTimeout = setTimeout(save.bind(null, true), 1000);
}

/**
 * Global export.
 */
window.app = app;

/**
 * Exports for hackers
 */

window.scene = ui.scene;