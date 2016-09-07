'use strict';
const
  API = require('../constants/api');

const
  USER = API.url.user;
module.exports = Backbone.Model.extend({
  //mock up
  url: USER,

  isGuest: function () {
    return !!this.get('guest');
  },

  loggedIn: function () {
    return !this.get('guest');
  },
});
