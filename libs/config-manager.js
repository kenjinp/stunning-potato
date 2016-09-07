/**
 * Helper for getting any values from config, currently only gets the server config
 */

'use strict';

module.exports = (function () {

    var _config,
    _baseUrl;

    return {

        config: function (cfg) {
            _config = cfg;

            // var serverConfig = cfg.get('server');
            // var portStr = (serverConfig.port === '80') ? '' : ':' + serverConfig.port;  // remove default port
            // _baseUrl = serverConfig.protocol + '://' + serverConfig.hostname + portStr + '/';
        },

        getConfig: function(key) {
            return _config.get(key);
        },

        // getServerUrl: function() {
        //     return _baseUrl || '';
        // }
    };
}());
