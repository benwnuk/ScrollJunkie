module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
	pkg : grunt.file.readJSON('package.json'),
		coffee : {
			options : {
				sourceMap: true
			},
			compile : {
				files : {
					'assets/scrolljunkie.js' : 'source/scrolljunkie.coffee'
				}
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	
	grunt.registerTask('default', ['coffee']);

};