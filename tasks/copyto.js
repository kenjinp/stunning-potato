'use strict';


module.exports = function copyto(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-copy-to');

	// Options
	return {
		build: {
			files: [{
				cwd: 'public',
				src: ['**/*'],
				dest: '.build/'
			}],
			options: {
				ignore: [
					'public/css/**/*',
					'public/js/**/*',
					'public/templates/**/*'
				]
			}
		},
		bootstrap: {
			files: [
				{
					cwd: 'bower_components/bootstrap/dist/',
					src: [
						'fonts/*'
					],
					dest: '.build/'
				}
			]
		},
		fontawesome: {
			files: [
				{
					cwd: 'bower_components/fontawesome/',
					src: [
						'fonts/*'
					],
					dest: '.build/'
				}
			]
		}
	};
};
