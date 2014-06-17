module.exports = function (config) {
	config.set({

		basePath: '../../',

		files: [
			'public/javascripts/lib/angular.js',
			'public/javascripts/lib/angular-route.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'public/javascripts/**/*.js',
			'test/frontend/**/*.js'
		],

		autoWatch: true,

		reporters: ['story'],

		frameworks: ['jasmine'],

		browsers: [/*'Chrome','Firefox',*/'PhantomJS']

	});
};