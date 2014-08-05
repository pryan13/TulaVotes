angular.module('tulaVotesApp', ['ngRoute', 'tulaVotesControllers'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/index',{
				templateUrl: 'partials/indexList',
				controller: 'indexListCtrl'
			})
			.when('/view/:formId',{
				templateUrl: 'partials/viewForm',
				controller: 'viewFormCtrl'
			})
			.when('/formstat/:formId',{
				templateUrl: 'partials/statForm',
				controller: 'statFormCtrl'
			})
			.when('/edit/:formId',{
				templateUrl: 'partials/editForm',
				controller: 'editFormCtrl'
			})
			.when('/create/',{
				templateUrl: 'partials/editForm',
				controller: 'editFormCtrl'
			})
			.otherwise({
				redirectTo: '/index'
			})
	}]
);
