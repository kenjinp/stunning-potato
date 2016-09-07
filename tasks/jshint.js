'use strict';


module.exports = function jshint(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Options
	return {
		files: [
			'controllers/**/*.js',
			'libs/**/*.js',
			'models/**/*.js',
			'public/js/**/*.js',
			'test/**/*.js',
			'scripts/*.js',
			'!test/frontends/.test-build.js'
		],
		options: {
			jshintrc: '.jshintrc'
		}
	};
};
