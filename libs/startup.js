'use strict';

const
  configManager = require('./config-manager'),
  logger = require('./utils/logger'),
  log = logger.createLog('startup'),
  mongoClient = require('./mongo-client');

function start(config, callback) {
	function cleanCallback(error) {

		if (error) {
			console.log('... failed startup process', error);
		} else {
			console.log('... finished startup');
		}
		callback(error);
	}

    try {
		log.info('Starting up ...');
		logger.init(config.get('logger'));
        configManager.config(config);
		mongoClient.init(config.get('mongo')).then(() => {
			cleanCallback();
		}).catch(cleanCallback);
	} catch (error) {
		cleanCallback(error);
	}
}

exports.start = start;
