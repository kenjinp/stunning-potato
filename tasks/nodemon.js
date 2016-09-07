'use strict';

module.exports = function (grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-nodemon');

	// Options
	return {
		dev: {
			script: 'index.js',
			options: {
				//  args: ['dev'],
				//  nodeArgs: ['--debug'],
				callback: function (nodemon) {
					nodemon.on('log', function (event) {
						console.log(event.colour);
					});
				},
			}
		}
	};
};
