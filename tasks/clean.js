'use strict';


module.exports = function clean(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Options
	return {
		tmp: 'tmp',
		build: [
			'.build/templates',
			'.build/js',
			'.build/css',
			'.build/img',
			'.build/fonts',
			'.build/_bower.css',
			'.build/_bower.js',
			'.build/favicon.io'
		],
	};
};
