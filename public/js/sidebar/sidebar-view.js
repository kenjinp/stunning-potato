'use strict';

let View = Backbone.Marionette.LayoutView.extend({
	template: require('./sidebar.dust'),

	ui: {
		menuItem: '.menu-item',
		parentMenuItem: '.parent-menu-item',
	},

	events: {
	},
});

module.exports = View;
