'use strict';

var request = require('./quest'),
    _       = require('underscore');

var middleware = (params) => {
    return new Promise((resolve, reject) => {
        request(params, function (err, response, body) {
            let middleware = [checkJson, checkStatus];
            let checkedResponse =
                    _.compose
                        .apply(null, middleware)({
                            err: err,
                            response: response,
                            body: body
                        });
            if (checkedResponse.err) {
                reject(checkedResponse.err);
            } else {
                resolve(checkedResponse.body);
            }
        });
    });
};

var checkStatus = (res) => {
    //return first error
    if (res.err) { return res; }
    if (!res.response || res.response.statusCode.toString()[0] !== '2') {
        //response came back bad
        res.err = {
            status: res.response.statusCode,
            error: 'Bad Response From Server'
        };
        console.log(
            '/!\\ [API MIDDLEWARE] error while checking status code: ',
            res.err,
            res.body
        );
    }
    return res;
};

//try to parse the json response
var checkJson = (res) => {
    if (res.err) { return res; }
    let contype = res.response.headers['content-type'];
    if (contype && contype.indexOf('application/json') >= 0) {
        try {
            res.body = tryParseJSON(res.body);
        } catch (error) {
            res.err = {
                status: res.response.statusCode,
                error: error
            };
            console.log(
                '/!\\ [API MIDDLEWARE] error while parsing json: ',
                res.err
            );
        }
    }
    return res;
};

function tryParseJSON (jsonString) {
    // already an object, no need to parse
    if (typeof jsonString === 'object') {
        return jsonString;
    } else {
        var object = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object",
        // so we must check for that, too.
        if (object && typeof object === 'object' && object !== null) {
            return object;
        }
    }
}

module.exports = middleware;
