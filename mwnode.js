/***********************************************************************
  * Wikia.js - a node.js bot client for autocat
  *  Copyright (C) 2014 Benjamin Williams
  *
  *  @GNU-GPL-license-start@
  *    The JavaScript code in this page is free software: you can
  *    redistribute it and/or modify it under the terms of the GNU
  *    General Public License (GNU GPL) as published by the Free Software
  *    Foundation, either version 3 of the License, or (at your option)
  *    any later version. The code is distributed WITHOUT ANY WARRANTY;
  *    without even the implied warranty of MERCHANTABILITY or FITNESS
  *    FOR A PARTICULAR PURPOSE. See the GNU GPL for more details.
  *
  *    As additional permission under GNU GPL version 3 section 7, you
  *    may distribute non-source (e.g., minimized or compacted) forms of
  *    that code without the copy of the GNU GPL normally required by
  *    section 4, provided you include this license notice and a URL
  *    through which recipients can access the Corresponding Source.
  *  @GNU-GPL-license-end@
***********************************************************************/

var request = require("request");
var cookiejar = request.jar();
var request = request.defaults({jar:cookiejar})

module.exports = {};

module.exports.delete_page = function(title, reason, callback) {

	var data = {
		action: "delete",
		title: title,
		summary: reason,
		token: module.exports.token,
		format: "json"
	};

	post(data, function(error, result) {

		if (!error) {

			if (!result.error.info) {

				callback(null, true);
			} else {

				callback(result.error.info, false);
			}
		} else {

			callback(error, false);
		}
	});
};

module.exports.edit_page = function(title, content, summary, callback) {

	var data = {
		action: "edit",
		title: title,
		text: content,
		summary: summary,
		token: module.exports.token,
		format: "json"
	};

	post(data, function(error, result) {

		if (error == null) {

			if (result && result.edit && result.edit.result == "Success") {

				callback(null, true);
			} else if (result && result.error) {

				callback(result.error.info, false);
			} else {

				callback(null, false);
			}
		} else {

			callback(error, false);
		}
	});
};

module.exports.get_contents = function(title, callback) {

	var data = {
		action: "query",
		prop: "revisions",
		rvprop: "content",
		titles: title,
		format: "json"
	};

	post(data, function(error, result) {

		if (!error) {

			if (result.query.pages) {

				for (var key in result.query.pages) {

					var query = result.query.pages[key];
					var page = query["revisions"][0]["*"];
				}

				callback(null, page);
			} else {

				callback(null, "");
			}
		} else {

			callback(error, false);
		}
	});
};

module.exports.login = function(user, pass, wiki, callback) {

	module.exports.apipath = "http://" + wiki + "/api.php";

	var data = {
		action: "login",
		lgname: user,
		lgpassword: pass,
		format: "json"
	};

	post(data, function(error, result) {

		if (error == null) {

			data.lgtoken = result.login.token;

			post(data, function(error, result) {

				if (error == null) {

					if (result.login.result == "Success") {

						fetch_token(function() {

							callback(null, true);
						});
					} else {

						callback(null, false);
					}
				} else {

					callback(error, false);
				}
			});
		} else {

			callback(error, false);
		}
	});
};

module.exports.query_special = function(type, limit, callback) {

	var data = {
		action: "query",
		list: "querypage",
		qppage: type,
		qplimit: limit,
		format: "json"
	};

	post(data, function(error, result) {

		if (!error) {

			if (result.error.code) {

				callback(result.error.code, false);
			} else {

				callback(null, result);
			}
		} else {

			callback(error, false);
		}
	});
};

//Private
fetch_token = function(callback) {

	var data = {
		action: "query",
		prop: "info",
		intoken: "edit",
		titles: "Main Page",
		format: "json"
	};

	post(data, function(error, result) {

		if (error == null && !result.error) {

			for (var key in result.query.pages) {

				var query = result.query.pages[key];

				module.exports.token = query.edittoken;
				callback();
			}
		}
	});
};

var post = function(data, callback) {

	var r;
	var options = {};
		options.url = module.exports.apipath;
		options.method = "POST";
		options.form = data;

	request(options, function(error, response, body) {

		if (!error) {

			if(response.statusCode == 200) {

				try {

					if((typeof body) == "string") {

						var result = JSON.parse(body);

						r = result;
					} else {

						r = body;
					}

					return callback(null, r);
				} catch (e) {

					return callback(e);
				}
			}
		} else {

			console.log("Error: " + error);
			return callback(error);
		}
	});
};
