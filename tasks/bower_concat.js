'use strict';


module.exports = function bowerConcat(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-bower-concat');

	// Options
	return {
		all: {
			dest: {
				js: '.build/_bower.js',
				css: '.build/_bower.css',
				fonts: '.build/_bower.fonts',
			},
			dependencies: {
				// 'admin-lte': ['jquery', 'bootstrap'],
				'bootstrap': 'jquery',
				'backbone': 'underscore',
			},
			mainFiles: {
				'bootstrap': ['dist/css/bootstrap.css', 'dist/js/bootstrap.js', 'dist/css/bootstrap-theme.min.css'],
				'fontawesome': ['css/font-awesome.css'],
				// 'admin-lte': ['dist/css/AdminLTE.css', 'dist/css/skins/_all-skins.css', 'dist/js/app.js'],
			}
		}
	};
};
