'use strict';

var LocalStrategy = require('passport-local'),
    configManager = require('../config-manager');

module.exports = function () {

return new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(username, password, done){
        let user = {
            name: 'bob'
        };
		return done(null, user);
	}
);
};
