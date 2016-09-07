'use strict';

module.exports = function (grunt) {
	// Load task
	grunt.registerTask('i18n', ['clean:tmp', 'localizr', 'dustjs', 'clean:tmp']);

	// Options
	return {};
};
