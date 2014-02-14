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
		connect: {
			dev: {
				options: {
					port: 8080,
					livereload: true
				}
			}
		},
		watch: {
			coffee: {
				files: ['source/*.coffee'],
				tasks: ['coffee'],
				options: {
					livereload: true
				}
			},
			compass: {
				files: ['source/*.scss'],
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
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['connect','watch']);
};