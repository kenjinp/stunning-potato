'use strict';

const
	IndexModel = require('../models/index'),
  passport = require('passport'),
  assignGuests = require('../libs/auth/guest'),
	_ = require('underscore');

module.exports = (router) => {

	var model = new IndexModel();

		let routes = [
			'/',
		];

		_.each(routes, (route) => {
			router.get(route, (req, res) => res.render('index', model));
		});

    router.all('*', (req, res) => {
      res.redirect('/');
    });

};
