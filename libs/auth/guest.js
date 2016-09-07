'use strict';

const
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    _ = require('underscore');

function makeID() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for( var i=0; i < 5; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = function (req, res, next) {
    if(req.user) { return next(); }
    // Create a new user and login with that
    let guest = {
      firstName: 'Guest',
      guest: 'true',
      scoreUpdates: [],
      score: 0,
      key: `GUEST-${makeID()}`,
      trophyCount: 0
    };
    // req.session.save().
    req.logIn(guest, next);
};
