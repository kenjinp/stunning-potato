'use strict';

const
	Main = require('./main/main-view');
//    Footer = require('./footer/footer-view');
// var SidebarMenuView = require('../sidebar-menu/sidebar-menu');
// var HeaderView = require('../header/header-view');

// create main app
var mainApp = new Backbone.Marionette.Application();

/* global window */
Backbone.radio = Backbone.Wreqr.radio.channel('global');

var globalChannel = Backbone.radio;

// Tailored Backbone Spells

//Hey! Listen! -> inits and registers messagebus
// listeners for removal later
Backbone.View.prototype.listen = function (eventKey, method, useGlobal) {
    if (!this.eventKeys) {
        this.eventKeys = [];
    }
    if (!eventKey) { throw new Error('eventKey cannot be null.'); }
    this.eventKeys.push(eventKey);
    globalChannel.vent.on(eventKey, method.bind(this));
};

//kill all the messagebus listening events registered
Backbone.View.prototype.stopListening = function () {
    if (this.eventKeys) {
        _.each(this.eventKeys, function(eventKey) {
            globalChannel.vent.off(eventKey);
        });
    }
};

Backbone.View.prototype.retrieve = function (options) {
    let ajaxCall = $.ajax(options);
    if (!this.ajaxRegistry) { this.ajaxRegistry = []; }
    this.ajaxRegistry.push(ajaxCall);
    return ajaxCall;
};

Backbone.View.prototype.abortAjax = function () {
    if (this.ajaxRegistry) {
        _.each(this.ajaxRegistry, (ajaxCall) => {
            ajaxCall.abort();
        });
    }
};

Backbone.View.prototype.slayChildren = function () {
    if (this.regions) {
        _.each(this.regions, function(selector, childViewName) {
            var child = this[childViewName];
            if(child && child.currentView) {
                if (child.currentView.close) {
                    child.currentView.close();
                } else {
                    child.currentView.remove();
                }
            }
        }.bind(this));
    }
};


//executes on change to another page
Backbone.View.prototype.close = function() {
    //everyone can have an onClose function

    if (this.onClose) {
      this.onClose();
    }
    //abort registered ajax calls
    this.abortAjax();
    //kill messagebus listeners #cantstopthesignal
    this.stopListening();
    //kill all children #infanticide
    this.slayChildren();
    //remove from DOM
    this.remove();
    // unbind events that are
    // set on this view
    this.off();
    // remove all models bindings
    // made by this view
    if(this.model) {
        this.model.off( null, null, this );
    }
};

// so marionette would render using DUst
Backbone.Marionette.Renderer.render = function (template, data) {
	var html;
	template(data, function (err, out) {
		html = out;
	});

	return html;
};

mainApp.addRegions({
	mainRegion: '#main'
});

mainApp.on('before:start', function (options) {
	console.log('[app] starting up');
});

mainApp.on('start', function (options) {
	console.log('[app] started');
	this.mainRegion.show(new Main());
});

mainApp.start();
