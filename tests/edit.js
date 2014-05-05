/***********************************************************************
  * This file is a part of MWNode.js
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

var mw = require("../mwnode.js");

// Login
mw.login("Username", "Password", "mine.wikia.com", function(error, is) {

	if (error == null && is == true) {

		mw.edit_page("Page", "Bot Test", "Bot edit", function(error, is) {

			if (error == null && is == true) {

				console.log("Edit Made!");
			} else {

				console.log(error);
			}
		});
	} else {

		console.log(error);
	}
});