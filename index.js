'use strict';

const
	express = require('express'),
	kraken = require('kraken-js'),
	passport = require('passport'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    log = require('./libs/utils/logger').createLog('server'),
    port = process.env.PORT || 8000;

const
	localStrategy = require('./libs/auth/local');

var options, app, _conf;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
	onconfig: function (config, next) {
    _conf = config;
		require('./libs/startup').start(config, (error) => {
			next(error, config);
		});
	}
};

app = module.exports = express();
app.use(kraken(options));
app.on('listening', () => console.log(arguments, 'listening'));

app.listen(port, function (err) {
        log.info(`Listening on http://localhost:${port}`);
});

app.on('middleware:after:session', function (eventargs) {
	passport.use('local', localStrategy());
    passport.serializeUser(function(user, done) {
      done(null, user);
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });
    app.use(passport.initialize());
    app.use(passport.session());
});

app.on('start', function () {
	log.notice('Application ready to serve requests. Port might be', port);
	log.info('Environment: %s', app.kraken.get('env:env'));
});
