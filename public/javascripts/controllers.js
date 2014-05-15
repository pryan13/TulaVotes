/**
 * Created by Vitaly on 5/15/2014.
 */
angular.module('tulaVotesControllers', [])
	.controller('indexListCtrl', ['$scope',
		function ($scope) {
			//get list of forms
		}])
	.controller('viewFormCtrl',['$scope', '$routeParams',
		function($scope, $routeParams){
			//get concrete form
			$scope.formId = $routeParams.formId;
		}]);