/**
 * Created by René Simon <mail@rene-simon.eu> on 30.04.16.
 * Copyright © Testacles 2016
 */

'use strict';

let moment = require('moment-timezone');
let _ = require('underscore');

let timePatterns = require('../../consts/time-patterns');

function getDateString(date) {
	date = date || new Date();
	if (!date || !(date instanceof Date)) {
		throw new Error('No date given');
	}
	return moment(date).format('YYYY-MM-DD');
}

function getYesterday(date) {
	date = date || new Date();
	let d = new Date(date.getTime());
	d.setDate(d.getDate() - 1);
	return d;
}

function isDateString(date) {
	return _.isString(date) && /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(date);
}

function isHash(obj) {
	return _.isObject(obj) && !_.isFunction(obj) && !_.isArray(obj) && !_.isError(obj) && !_.isRegExp(obj) && !_.isDate(obj) && !_.isElement(obj);
}

function firstCharToUpperCase(string) {
	return string.substr(0, 1).toUpperCase() + string.substr(1);
}

function firstCharToLowerCase(string) {
	return string.substr(0, 1).toLowerCase() + string.substr(1);
}

function toLowerCamelCase(string) {
	let parts = string.split(/[\W_]+/);
	let lowerCamelCase = '';
	for (let part of parts) {
		lowerCamelCase += !lowerCamelCase ? firstCharToLowerCase(part) : firstCharToUpperCase(part);
	}
	return lowerCamelCase;
}

function toUpperCamelCase(string) {
	return firstCharToUpperCase(toLowerCamelCase(string));
}

function btoa(string) {
	return (new Buffer(string)).toString('base64');
}

function atob(base64string) {
	return (new Buffer(base64string, 'base64')).toString('ascii');
}

function getDelayPromise(milliseconds) {
	return new Promise((resolve, reject) => {
		try {
			setTimeout(function () {
				resolve();
			}, milliseconds);
		} catch (error) {
			reject(error);
		}
	});
}

function cutLastSlash(url) {
	if (url.substr(-1) !== '/') {
		return url;
	}
	return url.substr(0, url.length - 1);
}

function applyFixOnDate(date, fix) {
	let momentDate = moment(date);
	if (fix.second) {
		momentDate.second(fix.second);
	}
	if (fix.minute) {
		momentDate.minute(fix.minute);
	}
	if (fix.hour) {
		momentDate.hour(fix.hour);
	}
	if (fix.day) {
		momentDate.date(fix.day);
	}
	if (fix.month) {
		momentDate.month(fix.month - 1);
	}
	if (fix.year) {
		momentDate.year(fix.year);
	}
	return momentDate;
}

function addTime(date, duration) {
	let momentDate = moment.tz(new Date(date.getTime()), 'GMT');
	momentDate.add(moment.duration(duration));
	return momentDate.toDate();
}

function getTimeStringPatternMapping(date) {
	let map = {};
	date = date || new Date();
	Object.keys(timePatterns).forEach(function (patternName) {
		map[getTimeStringByPatternName(patternName, date)] = '{' + patternName + '}';
	});
	return map;
}

function getTimeStringByPatternName(patternName, date) {
	let schema = timePatterns[patternName];
	if (!schema) {
		return null;
	}
	date = date || new Date();
	if (schema.duration) {
		date = addTime(date, schema.duration);
	}
	if (schema.fix) {
		date = applyFixOnDate(date, schema.fix);
	}
	if (schema.pattern) {
		if (_.isFunction(schema.pattern)) {
			return schema.pattern(date);
		}
		return moment(date).format(schema.pattern);
	}
	return moment(date).toString('YYYY-MM-DD HH:mm:ss');
}

function getTimeStringByPattern(pattern, date) {
	if (!_.isString(pattern) || pattern.indexOf('{') !== 0 || pattern.indexOf('}') !== pattern.length - 1) {
		return pattern;
	}
	let patternName = pattern.substring(1, pattern.length - 1);
	let timeString = getTimeStringByPatternName(patternName, date);
	if (!timeString) {
		return pattern;
	}
	return timeString;
}

function replaceObjValuesByTimeString(obj) {
	for (let key of Object.keys(obj)) {
		let value = obj[key];
		if (_.isString(value)) {
			obj[key] = getTimeStringByPattern(value);
		}
	}
	return obj;
}

function getContentTypeFromHeaders(headers) {
	return getHeadersField(headers, 'content-type');
}

function getMimeContentTypeFromHeaders(headers) {
	let contentType = getContentTypeFromHeaders(headers);
	if (!contentType) {
		return contentType;
	}
	return contentType.split(';')[0];
}

function getCacheControlFromHeaders(headers) {
	return getHeadersField(headers, 'cache-control');
}

function getHeadersField(headers, key) {
	key = key.toLowerCase();
	if (headers[key]) {
		return headers[key];
	}
	for (let headerKey of Object.keys(headers)) {
		if (headerKey.toLowerCase() === key) {
			return headers[headerKey];
		}
	}
	return null;
}

const MAX_DEPTH = 10;

function getOrderedObject(object, currentDepth) {
	currentDepth = currentDepth || 1;
	let response;
	if (_.isArray(object)) {
		response = [];
		object.forEach(function (element) {
			response.push(getOrderedObject(element, currentDepth + 1));
		});
		return _.sortBy(response);
	}
	if (!isHash(object)) {
		return object;
	}
	if (currentDepth > MAX_DEPTH) {
		throw new Error('Can not order objects deeper then ' + MAX_DEPTH + ' levels');
	}
	response = {};
	let orderedKeys = _.sortBy(Object.keys(object));
	for (let key of orderedKeys) {
		response[key] = getOrderedObject(object[key], currentDepth + 1);
	}
	return response;
}

function mapObject(obj, iterator) {
	let result = {};
	_.each(obj, (value, key) => result[key] = iterator(value));
	return result;
}

module.exports.addTime = addTime;
module.exports.getDateString = getDateString;
module.exports.getYesterday = getYesterday;
module.exports.isHash = isHash;
module.exports.firstCharToUpperCase = firstCharToUpperCase;
module.exports.firstCharToLowerCase = firstCharToLowerCase;
module.exports.toUpperCamelCase = toUpperCamelCase;
module.exports.toLowerCamelCase = toLowerCamelCase;
module.exports.btoa = btoa;
module.exports.atob = atob;
module.exports.getDelayPromise = getDelayPromise;
module.exports.cutLastSlash = cutLastSlash;
module.exports.getTimeStringByPattern = getTimeStringByPattern;
module.exports.getContentTypeFromHeaders = getContentTypeFromHeaders;
module.exports.getCacheControlFromHeaders = getCacheControlFromHeaders;
module.exports.getMimeContentTypeFromHeaders = getMimeContentTypeFromHeaders;
module.exports.getOrderedObject = getOrderedObject;
module.exports.isDateString = isDateString;
module.exports.getTimeStringPatternMapping = getTimeStringPatternMapping;
module.exports.replaceObjValuesByTimeString = replaceObjValuesByTimeString;
module.exports.mapObject = mapObject;
