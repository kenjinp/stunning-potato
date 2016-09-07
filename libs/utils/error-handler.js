/**
 * Created by René Simon <mail@rene-simon.eu> on 30.04.16.
 * Copyright © Testacles 2016
 */

'use strict';

var log = require('./logger').createLog('errorHandler');


var errors = require('../../consts/errors');

function getError(error) {
	var errorParts = error.message.split(' ');
	var key = errorParts[errorParts.length - 1];

	if (!errors[key]) {
		key = 'unknown';
	}

	return errors[key];
}

function handleError(error, response) {

	var mappedError = getError(error);


	log.error('StatusCode: ' + mappedError.httpStatusCode + ' ErrorMessage: ' + error.message, {data: error.data});

	var logMessage = mappedError.message;
	if (mappedError.httpStatusCode === 500) {
		logMessage = error.message;
		log.error(error.stack);
	}

	response.status(mappedError.httpStatusCode).json({error: logMessage});
}

module.exports.handleError = handleError;

