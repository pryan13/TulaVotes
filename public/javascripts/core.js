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

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all todos and show them
	$http.get('/api/forms')
		.success(function (data) {
			$scope.forms = data;
			console.log(data);
		})
		.error(function (data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createForm = function () {
		$http.post('/api/forms', $scope.formData)
			.success(function (data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.forms = data;
				console.log(data);
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteForm = function (id) {
		$http.delete('/api/forms/' + id)
			.success(function (data) {
				$scope.forms = data;
				console.log(data);
			})
			.error(function (data) {
				console.log('Error: ' + data);
			});
	};
}
