/**
 * Created by AAndrushkevich on 05/14/2014.
 */

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
			.otherwise({
				redirectTo: '/index'
			})
	}]
);
