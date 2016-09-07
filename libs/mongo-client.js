'use strict';

let mongoose = require('mongoose');

var log = require('./utils/logger').createLog('mongoClient');

var MongoClient = function () {
	return {

		/**
		 * Open a connection to the database using Promise
		 *
		 * @param conf - configuration object
		 * @return Promise
		 */
		init: function (conf) {
			return new Promise((resolve, reject) => {
				try {
					// turn on mongoose debug logging if configured
					mongoose.set('debug', conf.debug);

					// connect
					var mongoUrl = conf.mongoUrl || this.createMongoUrl(conf);
					mongoose.connect(mongoUrl);

					var db = mongoose.connection;
					db.on('error', function (error) {
						log.error('Mongoose error:', {error: error});
						reject(error);
					});
					db.once('open', function (err) {
						if (err) {
							log.error('error while opening connection:', {error: err});
						} else {
							log.info('MongoClient connection open:', mongoUrl);
						}

						resolve(db);
					});
				} catch (error) {
					reject(error);
				}
			});
		},

		/**
		 * Create Mongo URI from the config
		 *
		 * @param conf - configuration object
		 * @return
		 */
		createMongoUrl: function (conf) {
			var mongoUri = 'mongodb://';

			// check password
			var username = conf.username;
			var password = conf.password;
			if (username && password) {
				mongoUri += username + ':' + password + '@';
			}

			mongoUri += conf.host;

			// port
			var port = conf.port;
			if (port) {
				mongoUri += ':' + port;
			}

			// database
			mongoUri += '/' + conf.db;

			return mongoUri;
		},

		/**
		 * Returns the status of the database connection
		 * @returns {*}
		 */
		isConnected: function () {
			return mongoose.connection.readyState;
		},

		getDatabaseInstance: function () {
			return mongoose.connection;
		}

	};
};

module.exports = MongoClient();
