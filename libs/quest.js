/**
 * Created by Marius Mischie <marius.mischie@softgames.de> on 04/11/15.
 * Copyright © Softgames 2015
 */

'use strict';

var request = require('request');

var quest = function (params, callback) {
    var startTime = new Date();

    let requestMethod = request.get;
    if (typeof params.method !== 'undefined'){
        let method = params.method.toLowerCase();
        switch (method){
            case 'post': requestMethod = request.post; break;
            case 'patch': requestMethod = request.patch; break;
            case 'delete': requestMethod = request.del; break;
            case 'put': requestMethod = request.put; break;
        }
    }
    let method = params.method ? params.method.toUpperCase() : 'GET';
    console.log(
        `************ EXTERNAL ${method}:` ,
        JSON.stringify(params, null, 2),
        '************'
    );

    return requestMethod(params, function (err, response, body) {
        var responseTime = new Date() - startTime;
        try {
            console.log(
                '************ EXTERNAL REQUEST: ',
                (new Date()).toString(),
                response.request.uri.path || 'no path',
                (response.request.method || '-'),
                (response.request.url.href || '-'),
                ('status=' + response.statusCode || '-'),
                'time=' + responseTime + 'ms',
                '************'
            );
        } catch (error) {
            if (response) {
                console.log(
                    '************',
                    'COULD NOT LOG REQUEST',
                    response.request.uri.path || 'no path',
                    error.toString(), response ? (response.statusCode || 'no status code') : 'No Response',  (responseTime || 'no response time'),
                    '************');
            } else {
                console.log(
                    '************',
                    'COULD NOT LOG REQUEST',
                    'Response not available',
                    '************');
            }

        } finally {
            callback(err, response, body);
        }
    });
};

module.exports = quest;
