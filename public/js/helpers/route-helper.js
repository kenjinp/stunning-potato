/**
 * Helper functions for routing
 */
'use strict';

module.exports = {
	/**
	 * Update the URL, will pass this to Backbone history.
	 *
	 * @param newUrl - The new fragment URL.
	 * You don't have to add any prefix since the helper will always add prefix to the
	 * newUrl.
	 * @param options - Additional options you want to pass to Backbone.history.navigate()
	 */
	navigate: function (newUrl, options) {
		Backbone.history.navigate(newUrl, options);
	},

	/**
	 * Check if the current URL/route starts with the
	 * given name. This method will consider the routePrefix.
	 *
	 * For example, if the current URL is 'http://me.com/about', then
	 * calling isCurrentRoute('about') will return true.
	 *
	 * @param theUrl - the fragment URL, without any prefix
	 * @return true if the current route url starts with the given url.
	 * Otherwise, return falsy value
	 *
	 */
	isCurrentRoute: function (theUrl) {
		return theUrl ? (Backbone.history.fragment.indexOf(theUrl) === 0) : false;
	},

	/**
	 * Process the current route and split it into pure route and
	 * the URL params, if they're existed.
	 *
	 * @param route - If defined, this will be used, otherwise will use
	 * route rom Backbone
	 * @return array of strings containing 2 elements
	 * returnArray[0] = route without params,
	 * returnArray[1] = route params (all chars after '?'). If no params, this will be empty string
	 *
	 * Example: 'test?fast=true', will return ['test', 'fast=true']
	 */
	getRouteParams: function (route) {
		var tempResult = ['', ''];

		var fragment = route;
		if (!fragment) {
			// get fragment from Backbone histroy
			fragment = this._getFragmentWithSearchParams();
		}

		if (fragment) {
			var regexResults = fragment.match(/([^\?]*)\?{0,1}(.*)/);
			if (regexResults && (regexResults.length >= 3)) {
				tempResult[0] = regexResults[1];
				tempResult[1] = regexResults[2];
			}
		}

		return tempResult;
	},

	/**
	 * Internal function to get Backbone history and also the URl params if it's existed.
	 * @return The param with URL string (e.g 'search', or 'pins/12321', or 'all?c=US')
	 */
	_getFragmentWithSearchParams: function () {
		return Backbone.history.fragment + Backbone.history.location.search;
	},

	/**
	 * Gets parameter value from the given URl params
	 *
	 * @param url - The url or partial url, and with '?'.
	 * (e.g ?name=den&cool=false or test?action=buy)
	 * @param name - The parameter name
	 * @return the value of the parameter. If not found, empty string will be returned
	 */
	getParameterByName: function (url, name) {
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
			results = regex.exec(url);

		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}
};
