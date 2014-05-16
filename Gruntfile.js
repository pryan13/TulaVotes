/**
 * Created by Vitaly on 5/16/2014.
 */
module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bowercopy: {
			options: {
				srcPrefix: 'bower_components'
			},
			js: {
				options: {
					destPrefix: 'public/javascripts/lib'
				},
				files: {
					'angular.js': 'angular/angular.js',
					'angular-route.js': 'angular-route/angular-route.js'
				}
			},
			css: {
				options: {
					destPrefix: 'public/stylesheets'
				},
				files: {
					'bootstrap.css': 'bootstrap/dist/css/bootstrap.css'
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-bowercopy');
}
