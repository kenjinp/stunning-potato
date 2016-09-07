'use strict';


module.exports = function browserify(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-browserify');

	// Options
	return {
		build: {
			options: {
				// activate watchify
				watch: true,
				exclude: [
					'libs/**/*.js',
					'models/**/*.js',
					'controllers/**/*.js'
				],
				transform: [['babelify', {'presets': 'es2015', 'compact': false}]]
			},
			files: {
				'.build/js/app-bundled.js': ['public/js/assets/*', 'public/js/app.js']
			}
		}
	};
};
