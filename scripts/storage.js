/*!
 * obelisk-builder
 * Copyright (c) 2013 Nicolas Gryman <ngryman@gmail.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var github = require('./github');

/**
 * Private variables
 */

var errors = {
	sadSave: "could not save your awesome art on the cloud :(",
	unknownGist: "it seems this gist does not exist anymore :(",
	invalidGist: "this gist does not behaves well, loading failed :(",
	forkFailed: "fork failed :(<br>does this gist still exists?"
};
var gist;

/**
 * Module declaration.
 */

var storage = {};

/**
 *
 * @param data
 */
storage.local = function(data) {
	localStorage.setItem(gist ? gist : 'orphan', JSON.stringify(data));
};

/**
 *
 * @returns {boolean}
 */
storage.orphan = function() {
	return (null == gist);
};

/**
 *
 * @param {object} data
 * @param {function} callback
 */
storage.persist = function(data, callback) {
	var content = JSON.stringify(data, null, 2),
		action = 'created';

	// working on an existing gist?
	if (gist) {
		// edit it
		github.editGist(gist, content, function(err, res) {
			// tried to edit a gist that is not ours
			if (err) {
				if (401 == err.status || 404 == err.status) {
					// fork it if we are authenticated
					// anonymous gist can't be edited after being forked
					if (github.authenticated()) {
						github.forkGist(gist, function(err, res) {
							if (err) return callback(errors.forkFailed);

							// then add changes
							action = 'forked gist ' + gist + ' to';
							github.editGist(res.id, content, onData);
						});
					}
					// if not, well, simply create it :p
					else
						github.newGist(content, onData);
				}
				else
					callback(errors.sadSave);

				return;
			}

			action = 'saved to';
			onData(err, res);
		});

		return;
	}

	// create a new one
	github.newGist(content, onData);

	function onData(err, res) {
		if (err) return callback(errors.sadSave);

		// remove orphan data
		if (storage.orphan())
			localStorage.removeItem('orphan');

		// set this gist as the current one
		gist = res.id;
		// and the last one we worked on
		localStorage.setItem('last', gist);
		// make sure the hash is up to date
		if (gist != location.hash.slice(1))
			location.hash = gist;

		// save it locally too
		storage.local(data);

		var info = {
			id: res.id,
			url: res.html_url,
			action: action
		};

		callback(null, info);
	}
};

/**
 *
 * @param {function} callback
 */
storage.fetch = function(callback, data) {

	// LOAD LOCAL DATA ( STATISTICS )
	// var data = { "colors":["7441408","9001384","13117481","15382272","15658734"], "data":[{"x":0,"y":0,"z":0,"c":2},{"x":0,"y":1,"z":0,"c":2},{"x":0,"y":1,"z":1,"c":2},{"x":0,"y":2,"z":0,"c":2},{"x":0,"y":2,"z":1,"c":2},{"x":0,"y":2,"z":2,"c":2},{"x":0,"y":2,"z":3,"c":2},{"x":0,"y":2,"z":4,"c":2},{"x":0,"y":2,"z":5,"c":2},{"x":0,"y":3,"z":0,"c":2},{"x":0,"y":3,"z":1,"c":2},{"x":0,"y":3,"z":2,"c":2},{"x":0,"y":3,"z":3,"c":2},{"x":0,"y":4,"z":0,"c":2},{"x":0,"y":4,"z":1,"c":2},{"x":0,"y":4,"z":2,"c":2},{"x":0,"y":5,"z":0,"c":2},{"x":0,"y":5,"z":1,"c":2},{"x":0,"y":5,"z":2,"c":2},{"x":0,"y":6,"z":0,"c":2},{"x":0,"y":6,"z":1,"c":2},{"x":0,"y":6,"z":2,"c":2},{"x":0,"y":6,"z":3,"c":2},{"x":0,"y":7,"z":0,"c":2},{"x":0,"y":7,"z":1,"c":2},{"x":0,"y":7,"z":2,"c":2},{"x":0,"y":7,"z":3,"c":2},{"x":0,"y":7,"z":4,"c":2},{"x":0,"y":7,"z":5,"c":2},{"x":0,"y":7,"z":6,"c":2},{"x":0,"y":8,"z":0,"c":2},{"x":0,"y":8,"z":1,"c":2},{"x":0,"y":8,"z":2,"c":2},{"x":0,"y":8,"z":3,"c":2},{"x":0,"y":8,"z":4,"c":2},{"x":0,"y":9,"z":0,"c":2},{"x":0,"y":9,"z":1,"c":2},{"x":0,"y":9,"z":2,"c":2},{"x":0,"y":9,"z":3,"c":2},{"x":0,"y":10,"z":0,"c":2},{"x":0,"y":10,"z":1,"c":2},{"x":0,"y":10,"z":2,"c":2},{"x":0,"y":11,"z":0,"c":2},{"x":0,"y":11,"z":1,"c":2},{"x":0,"y":12,"z":0,"c":2},{"x":0,"y":12,"z":1,"c":2},{"x":0,"y":12,"z":2,"c":2},{"x":0,"y":13,"z":0,"c":2},{"x":0,"y":13,"z":1,"c":2},{"x":0,"y":13,"z":2,"c":2},{"x":0,"y":13,"z":3,"c":2},{"x":0,"y":13,"z":4,"c":2},{"x":0,"y":14,"z":0,"c":2},{"x":0,"y":14,"z":1,"c":2},{"x":0,"y":14,"z":2,"c":2},{"x":0,"y":14,"z":3,"c":2},{"x":0,"y":14,"z":4,"c":2},{"x":0,"y":14,"z":5,"c":2},{"x":0,"y":15,"z":0,"c":2},{"x":0,"y":15,"z":1,"c":2},{"x":0,"y":15,"z":2,"c":2},{"x":0,"y":15,"z":3,"c":2},{"x":0,"y":15,"z":4,"c":2},{"x":0,"y":16,"z":0,"c":2},{"x":0,"y":16,"z":1,"c":2},{"x":0,"y":16,"z":2,"c":2},{"x":0,"y":16,"z":3,"c":2},{"x":0,"y":17,"z":0,"c":2},{"x":0,"y":17,"z":1,"c":2},{"x":0,"y":17,"z":2,"c":2},{"x":0,"y":18,"z":0,"c":2},{"x":0,"y":18,"z":1,"c":2},{"x":0,"y":19,"z":0,"c":2},{"x":4,"y":0,"z":0,"c":4},{"x":5,"y":0,"z":0,"c":0},{"x":5,"y":0,"z":1,"c":0},{"x":5,"y":0,"z":2,"c":0},{"x":5,"y":1,"z":0,"c":0},{"x":5,"y":1,"z":1,"c":0},{"x":5,"y":1,"z":2,"c":0},{"x":5,"y":1,"z":3,"c":0},{"x":5,"y":1,"z":4,"c":0},{"x":5,"y":2,"z":0,"c":0},{"x":5,"y":2,"z":1,"c":0},{"x":5,"y":2,"z":2,"c":0},{"x":5,"y":3,"z":0,"c":0},{"x":5,"y":3,"z":1,"c":0},{"x":5,"y":4,"z":0,"c":0},{"x":5,"y":5,"z":0,"c":0},{"x":5,"y":6,"z":0,"c":0},{"x":5,"y":7,"z":0,"c":0},{"x":5,"y":7,"z":1,"c":0},{"x":5,"y":8,"z":0,"c":0},{"x":5,"y":8,"z":1,"c":0},{"x":5,"y":9,"z":0,"c":0},{"x":5,"y":9,"z":1,"c":0},{"x":5,"y":9,"z":2,"c":0},{"x":5,"y":10,"z":0,"c":0},{"x":5,"y":10,"z":1,"c":0},{"x":5,"y":10,"z":2,"c":0},{"x":5,"y":10,"z":3,"c":0},{"x":5,"y":11,"z":0,"c":0},{"x":5,"y":11,"z":1,"c":0},{"x":5,"y":11,"z":2,"c":0},{"x":5,"y":11,"z":3,"c":0},{"x":5,"y":11,"z":4,"c":0},{"x":5,"y":11,"z":5,"c":0},{"x":5,"y":11,"z":6,"c":0},{"x":5,"y":11,"z":7,"c":0},{"x":5,"y":12,"z":0,"c":0},{"x":5,"y":12,"z":1,"c":0},{"x":5,"y":12,"z":2,"c":0},{"x":5,"y":12,"z":3,"c":0},{"x":5,"y":13,"z":0,"c":0},{"x":5,"y":13,"z":1,"c":0},{"x":5,"y":13,"z":2,"c":0},{"x":5,"y":14,"z":0,"c":0},{"x":5,"y":14,"z":1,"c":0},{"x":5,"y":14,"z":2,"c":0},{"x":5,"y":14,"z":3,"c":0},{"x":5,"y":15,"z":0,"c":0},{"x":5,"y":15,"z":1,"c":0},{"x":5,"y":15,"z":2,"c":0},{"x":5,"y":16,"z":0,"c":0},{"x":5,"y":16,"z":1,"c":0},{"x":5,"y":17,"z":0,"c":0},{"x":5,"y":17,"z":1,"c":0},{"x":5,"y":18,"z":0,"c":0},{"x":5,"y":18,"z":1,"c":0},{"x":5,"y":19,"z":0,"c":0},{"x":10,"y":1,"z":0,"c":3},{"x":10,"y":1,"z":1,"c":3},{"x":10,"y":1,"z":2,"c":3},{"x":10,"y":2,"z":0,"c":3},{"x":10,"y":2,"z":1,"c":3},{"x":10,"y":3,"z":0,"c":3},{"x":10,"y":3,"z":1,"c":3},{"x":10,"y":4,"z":0,"c":3},{"x":10,"y":4,"z":1,"c":3},{"x":10,"y":4,"z":2,"c":3},{"x":10,"y":4,"z":3,"c":3},{"x":10,"y":5,"z":0,"c":3},{"x":10,"y":5,"z":1,"c":3},{"x":10,"y":5,"z":2,"c":3},{"x":10,"y":6,"z":0,"c":3},{"x":10,"y":6,"z":1,"c":3},{"x":10,"y":6,"z":2,"c":3},{"x":10,"y":7,"z":0,"c":3},{"x":10,"y":7,"z":1,"c":3},{"x":10,"y":7,"z":2,"c":3},{"x":10,"y":8,"z":0,"c":3},{"x":10,"y":8,"z":1,"c":3},{"x":10,"y":8,"z":2,"c":3},{"x":10,"y":9,"z":0,"c":3},{"x":10,"y":9,"z":1,"c":3},{"x":10,"y":10,"z":0,"c":3},{"x":10,"y":11,"z":0,"c":3},{"x":10,"y":12,"z":0,"c":3},{"x":10,"y":12,"z":1,"c":3},{"x":10,"y":13,"z":0,"c":3},{"x":10,"y":13,"z":1,"c":3},{"x":10,"y":13,"z":2,"c":3},{"x":10,"y":14,"z":0,"c":3},{"x":10,"y":14,"z":1,"c":3},{"x":10,"y":14,"z":2,"c":3},{"x":10,"y":14,"z":3,"c":3},{"x":10,"y":15,"z":0,"c":3},{"x":10,"y":15,"z":1,"c":3},{"x":10,"y":15,"z":2,"c":3},{"x":10,"y":16,"z":0,"c":3},{"x":10,"y":16,"z":1,"c":3},{"x":10,"y":17,"z":0,"c":3},{"x":10,"y":18,"z":0,"c":3},{"x":10,"y":19,"z":0,"c":3},{"x":15,"y":0,"z":0,"c":1},{"x":15,"y":0,"z":1,"c":1},{"x":15,"y":0,"z":2,"c":1},{"x":15,"y":1,"z":0,"c":1},{"x":15,"y":1,"z":1,"c":1},{"x":15,"y":2,"z":0,"c":1},{"x":15,"y":3,"z":0,"c":1},{"x":15,"y":3,"z":1,"c":1},{"x":15,"y":3,"z":2,"c":1},{"x":15,"y":3,"z":3,"c":1},{"x":15,"y":4,"z":0,"c":1},{"x":15,"y":5,"z":0,"c":1},{"x":15,"y":6,"z":0,"c":1},{"x":15,"y":6,"z":1,"c":1},{"x":15,"y":7,"z":0,"c":1},{"x":15,"y":8,"z":0,"c":1},{"x":15,"y":9,"z":0,"c":1},{"x":15,"y":9,"z":1,"c":1},{"x":15,"y":9,"z":2,"c":1},{"x":15,"y":9,"z":3,"c":1},{"x":15,"y":9,"z":4,"c":1},{"x":15,"y":10,"z":0,"c":1},{"x":15,"y":10,"z":1,"c":1},{"x":15,"y":10,"z":2,"c":1},{"x":15,"y":11,"z":0,"c":1},{"x":15,"y":11,"z":1,"c":1},{"x":15,"y":12,"z":0,"c":1},{"x":15,"y":12,"z":1,"c":1},{"x":15,"y":13,"z":0,"c":1},{"x":15,"y":14,"z":0,"c":1},{"x":15,"y":15,"z":0,"c":1},{"x":15,"y":16,"z":0,"c":1},{"x":15,"y":16,"z":1,"c":1},{"x":15,"y":16,"z":2,"c":1},{"x":15,"y":16,"z":3,"c":1},{"x":15,"y":16,"z":4,"c":1},{"x":15,"y":16,"z":5,"c":1},{"x":15,"y":16,"z":6,"c":1},{"x":15,"y":17,"z":0,"c":1},{"x":15,"y":17,"z":1,"c":1},{"x":15,"y":17,"z":2,"c":1},{"x":15,"y":17,"z":3,"c":1},{"x":15,"y":18,"z":0,"c":1},{"x":15,"y":18,"z":1,"c":1},{"x":15,"y":18,"z":2,"c":1},{"x":15,"y":19,"z":0,"c":1}]};

	// LOAD DATA FROM IMAGE
	return callback(null, JSON.parse(JSON.stringify(data)), 'LOADED DATA FROM IMAGE');

	/* CODE TEMPORARILY DISABLED
	// priority to url
	if (location.hash) {
		gist = location.hash.slice(1);

		// if it was a gist we were working on, load local data as it is more fresh
		data = localStorage.getItem(gist);
		if (data)
			return callback(null, JSON.parse(data), 'loaded your last local changes for ' + gist);

		// if not loads the gist
		github.getGist(gist, function(err, res) {
			if (err) return callback(errors.unknownGist);

			var data;
			try {
				data = JSON.parse(res.files['data.json'].content);
			}
			catch (e) {
				return callback(errors.invalidGist);
			}

			callback(null, data);
		});
		return;
	}

	// well, load the last working gist?
	gist = localStorage.getItem('last');
	data = localStorage.getItem(gist);
	if (data) {
		location.hash = gist;
		return callback(null, JSON.parse(data), 'loaded your last saved stuff');
	}

	// ok ok, load the last orphan art?
	data = localStorage.getItem('orphan');
	if (data) return callback(null, JSON.parse(data), 'loaded your last local stuff');

	// i can't do nothing more dude, new one!
	callback(null, null, 'new');
	*/
};

/**
 *
 */
storage.flush = function() {
	localStorage.removeItem('last');
	location.hash = '';
};

module.exports = storage;