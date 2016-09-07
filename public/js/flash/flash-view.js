'use strict';


let View = Backbone.Marionette.ItemView.extend({
	template: require('./flash.dust'),

	ui: {
		flash: '.flash'
	},

	events: {
		'click .close': 'dismiss'
	},

	model: new Backbone.Model(),

	initialize: function () {
		this.model.on('change', this.render);
		Backbone.radio.vent.on('flash', this.flashMessage.bind(this));
	},

	flashMessage: function (options) {
		console.log(options);
		this.model.set(options);
		this.ui.flash
			.removeClass('hidden')
			.addClass('visible')
			.removeClass('shut');
	},

	dismiss: function () {
		this.ui.flash
			.removeClass('visible')
			.addClass('hidden')
			.addClass('shut');
	}
});

module.exports = View;
