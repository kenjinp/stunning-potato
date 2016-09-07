'use strict';


module.exports = function (grunt) {

	// Load the project's grunt tasks from a directory
	require('grunt-config-dir')(grunt, {
		configDir: require('path').resolve('tasks')
	});

	grunt.registerTask('build', ['dustjs', 'i18n', 'less', 'bower_concat', 'browserify', 'concurrent:build']);

	grunt.registerTask('serve', 'Build & run the server locally, for development.', [
		'clean',
		'build',
		'concurrent:server'
	]);

	grunt.registerTask('test', ['mochacli']);


};
