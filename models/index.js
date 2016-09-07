'use strict';

const
	configManager = require('../libs/config-manager');

module.exports = function IndexModel() {

	return {
		name: 'Krakbone',
    	url: 'localhost:8000',
    	description: 'A new website'
	};
};
