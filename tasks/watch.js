'use strict';

module.exports = function (grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Options
	return {
		options: {},

		// NOTE: JS and Dust is being watch by watchify
		// @see tasks/browserify.js
		styles: {
			files: [
				'public/css/themes/*.less',
				'public/css/app/*.less',
				'public/css/*.less',
			],
			tasks: ['less']
		},
		frontend: {
			files: [
				'public/js/**/*'
			],
			tasks: ['browserify']
		}
	};
};
