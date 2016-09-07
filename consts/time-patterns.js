/**
 * Created by René Simon <mail@rene-simon.eu> on 30.04.16.
 * Copyright © Testacles 2016
 */

'use strict';

module.exports = {
	today: {
		pattern: 'YYYY-MM-DD'
	},
	yesterday: {
		pattern: 'YYYY-MM-DD',
		duration: {days: -1}
	},
	dayBeforeYesterday: {
		pattern: 'YYYY-MM-DD',
		duration: {days: -2}
	},
	beginningOfMonth: {
		pattern: 'YYYY-MM-DD',
		fix: {day: 1}
	},
	thirtyDaysAgo: {
		pattern: 'YYYY-MM-DD',
		duration: {days: -30}
	},
	sevenDaysAgo: {
		pattern: 'YYYY-MM-DD',
		duration: {days: -7}
	},
	oneMonthAgo: {
		pattern: 'YYYY-MM-DD',
		duration: {month: -1}
	},
	beginningOfLastMonth: {
		pattern: 'YYYY-MM-DD',
		fix: {day: 1},
		duration: {month: -1}
	},
	thisHour: {
		pattern: date => date.getHours()
	},
	lastHour: {
		pattern: date => date.getHours(),
		duration: {hours: -1}
	}
};
