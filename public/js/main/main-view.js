'use strict';

const
    Flash = require('../flash/flash-view'),
    Footer = require('../footer/footer-view'),
    Sidebar = require('../sidebar/sidebar-view'),
    Header = require('../header/header-view'),
	MainRouter = require('./main-router'),
	MainController = require('./main-controller');

let View = Backbone.Marionette.LayoutView.extend({
	template: require('./main-page.dust'),

    regions: {
        flash: '#flash',
		footer: '#footer',
		header: '#header',
		sidebar: '#sidebar',
		mainContainer: '.main-container',
		modalContainer: '.modal-container'
	},

    initialize: function () {
		console.log('[main-view] initialize');

		this.model = new Backbone.Model({
			debugMode: this.$el.data('debugMode'),
			page: this.$el.data('page')
		});

		new MainRouter({
			controller: new MainController({
				mainContainer: this.mainContainer,
				modalContainer: this.modalContainer
			})
		});
	},

	onShow: function () {
        // this.flash.show(new Flash());
        // this.sidebar.show(new Sidebar());
		// this.footer.show(new Footer());
		// this.header.show(new Header());
	},

	onRender: function () {
		console.log('[main-view] start history');
		Backbone.history.start({pushState: true});
	}
});

module.exports = View;
