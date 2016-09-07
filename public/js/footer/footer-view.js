'use strict';


let View = Backbone.Marionette.LayoutView.extend({
	template: require('./footer.dust'),

	initialize: function () {
		this.model = new Backbone.Model({
			version: '0.1.0'
		});
	}
});

module.exports = View;
