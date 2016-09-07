'use strict';

/*global window*/

window.ua = require('universal-analytics');

const
  GOOGLE_ANALYTICS_KEY = 'UA-8888888';

function report () {
}

function setUser () {
  let user = Backbone.radio.reqres.request('get:user');
  if (user) {
    return user.get('key');
  } else {
    return false;
  }
}

module.exports = {
  page: function (page, url) {
    let host = window.location.hostname;
    if (host === 'localhost') { return; }
    if (!setUser()) { return; }
    else {
      //send goggle some info for GA
      window.visitor =
          window.ua(GOOGLE_ANALYTICS_KEY,
            setUser(),
            { strictCidFormat: false });
      window.visitor.pageview({
          dp: '/' + url,
          dt: page,
          dh: host
      }).send();
    }
  },
};
