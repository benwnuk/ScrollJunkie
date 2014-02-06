module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
		coffee: {
			options: {
				sourceMap: true
			},
			compile: {
				files: {
					'assets/scrolljunkie.js' : 'source/scrolljunkie.coffee'
				}
			}
		},
		compass: {
			dist:{
				options: {
					outputStyle: 'expanded',
					sassDir: 'source',
					cssDir: 'assets'
				}	
			}			
		},
		watch: {
			coffee: {
				files: ['source/scrolljunkie.coffee'],
				tasks: ['coffee'],
				options: {
					livereload: true
				}
			},
			compass: {
				files: ['source/scrolljunkie.scss'],
				tasks: ['compass'],
				options: {
					livereload: true
				}
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.registerTask('default', ['watch']);

};