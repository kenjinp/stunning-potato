/**
 * Created by René Simon <mail@rene-simon.eu> on 30.04.16.
 * Copyright © Testacles 2016
 */

'use strict';

const chalk = new (require('chalk')).constructor({enabled: true});
var _ = require('underscore');

var tools = require('./tools');

var logLevel = -1;

var SEVERITIES = {
	'-1': {
		name: 'DEBUG',
		chalk: chalk.cyan
	},
	0: {
		name: 'INFO',
		chalk: chalk.green
	},
	1: {
		name: 'NOTICE',
		chalk: chalk.blue
	},
	2: {
		name: 'WARN',
		chalk: chalk.yellow
	},
	3: {
		name: 'ERROR',
		chalk: chalk.magenta
	},
	4: {
		name: 'FATAL',
		chalk: chalk.red
	}
};

function logNormalData(msg, data) {
	if (data) {
		console.log(msg, (_.isArray(data) || tools.isHash(data)) ? '\n' + JSON.stringify(data, null, '\t').replace(/\\n/g, '\n') : data);
	} else {
		console.log(msg);
	}
}

function logData(severity, name, msg, data) {
	if (severity < logLevel) {
		return;
	}
	var type = SEVERITIES[String(severity)] || {
			name: 'UNKNOWN',
			chalk: chalk.bgCyan
		};
	msg = '[' + chalk.yellow((new Date()).toISOString()) + '][' + type.chalk(type.name) + '][' + chalk.bold(name) + '] ' + msg;
	logNormalData(msg, data);
}

function handleErrorLog(severity, name, msg, data) {
	if (msg instanceof Error) {
		data = msg.data || {};
		data.STACK = msg.stack;
		msg = msg.message;
	}
	logData(severity, name, msg, data);
}

class Log {
	constructor(name) {
		this.name = name;
	}

	debug(msg, data) {
		logData(-1, this.name, msg, data);
	}

	info(msg, data) {
		logData(0, this.name, msg, data);
	}

	notice(msg, data) {
		logData(1, this.name, msg, data);
	}

	warn(msg, data) {
		logData(2, this.name, msg, data);
	}

	error(msg, data) {
		handleErrorLog(3, this.name, msg, data);
	}

	fatal(msg, data) {
		handleErrorLog(4, this.name, msg, data);
	}
}

function init(config) {
	logLevel = _.isFinite(config.level) ? config.level : -1;
}

function createLog(name) {
	name = name || 'main';
	return new Log(name);
}

module.exports.init = init;
module.exports.createLog = createLog;
