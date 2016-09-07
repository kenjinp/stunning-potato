'use strict';

const
	RouteHelper = require('../helpers/route-helper'),
  	Track = require('../helpers/tracking'),
	_ = require('underscore');

//views
const
    HomeView = require('../home/home-view');


//models
const
  UserModel = require('../models/user');

/* global window */

var mainContainer = null, modalContainer = null;

module.exports = Backbone.Marionette.Controller.extend({

	mainContainer: null,
	viewInDisplay: null,

	initialize: function (options) {
		this._initListeners();
	    this.isDataInitialized = false;
	    this.initializeData();
		mainContainer = options.mainContainer;
		modalContainer = options.modalContainer;
	},

  initializeData: function () {
    this.user = new UserModel();
    $.when(
      this.user.fetch()
    ).done(() => {
      console.log('[USER]', this.user.attributes);
      this.isDataInitialized = true;
      Backbone.radio.vent.trigger('data:initialized');
    });
  },

	_initListeners: function () {
    Backbone.radio.vent.on('data:initialize', this.initializeData.bind(this));
    Backbone.radio.vent.on('data:status', () => this.isDataInitialized);
    Backbone.radio.vent.on('login', this.login.bind(this));
    Backbone.radio.vent.on('logout', this.logout.bind(this));
    Backbone.radio.vent.on('home:show', this.showHomeView.bind(this));
    Backbone.radio.reqres.setHandler('send:analytics', this.sendAnalytics.bind(this));
		Backbone.radio.reqres.setHandler('get:user', this.getUser.bind(this));
	},

  //change page
  sendAnalytics: function (options) {
      let url = options.url,
          viewInDisplay = options.viewInDisplay;
      if (viewInDisplay) {
        Track.page(viewInDisplay, url);
      }
  },

  login: function (options) {
  },

  logout: function (options) {
  },

  showHomeView: function (options) {
      this.injectView(HomeView, 'show-home', '', options, 'home');
  },

  getUser: function (options) {
    return this.user;
  },

	/**
	 * Injects a view in the main container
	 * @param View
	 * @param viewInDisplay
	 * @param url
	 * @param options
	 * @param parentSection
	 * @param skip
	 */
	injectView: function (View, viewInDisplay, url, options, parentSection) {

		options = options || {};

		console.log('[main controller] showing ', viewInDisplay);
    let sendAnalytics = this.sendAnalytics.bind(this);

		function switchView(viewInDisplay) {
			RouteHelper.navigate(url);
			mainContainer.show(new View(options));
			$('.parent-menu-item').removeClass('active');
			$('.' + parentSection).addClass('active');
      sendAnalytics({url: url, viewInDisplay: viewInDisplay});
			return viewInDisplay;
		}


		if (this.viewInDisplay === viewInDisplay) {
			return;
		}

		if (mainContainer.currentView) {
			// $.xhrPool.abortAll();
			mainContainer.currentView.remove();
		}

		this.viewInDisplay = switchView(this.viewInDisplay);
	}

});
