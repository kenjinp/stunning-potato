'use strict';

const
  _ = require('underscore'),
  session = require('express-session'),
  redis = require('redis'),
  configManager = require('../config-manager'),
  RedisStore = require('connect-redis')(session);

let redisClient = null;

let redisCfg = configManager.getConfig('redis');
redisClient = redis.createClient(redisCfg.port, redisCfg.host);
redisClient.auth(redisCfg.pass, function (success) {
    if (!success) {
        console.log('Redis could not authentificate!!!!');
    } else {
        console.log('Redis authentificated');
    }
});


module.exports.middleware = function (sessionConf) {
  return function (req, res, next) {
    return session(_.extend(sessionConf, {
      store: new RedisStore({
        client: redisClient
      })
    }))(req, res, next);
  };
};
