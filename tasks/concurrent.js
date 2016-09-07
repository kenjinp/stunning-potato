'use strict';

module.exports = function (grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-concurrent');

	// Options
	return {
		server: {
			tasks: [
				'nodemon',
				'watch'
			],
			options: {
				logConcurrentOutput: true
			}
		},
		//
		// build: {
		//     tasks: [
		//         'copyto:frontend',
		//         'copyto:fontawesome',
		//         'copyto:assets',
		//         'copyto:images',
		//         'uglify'
		//     ],
		//     options: {
		//         logConcurrentOutput: true
		//     }
		// },

		// just like build but without any minifying to make it faster
		build: {
			tasks: [
				'copyto:bootstrap',
				'copyto:fontawesome',
				'copyto:build',
			],
			options: {
				logConcurrentOutput: true
			}
		}
	};
};
