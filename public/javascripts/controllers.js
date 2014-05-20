/**
 * Created by Vitaly on 5/15/2014.
 */
angular.module('tulaVotesControllers', [])
	.controller('logInCtrl', ['$scope', '$http',
		function($scope, $http){
			$scope.email = '';
			$scope.isFound = false;
			$scope.logIn = function(){
				$http.get('/api/users/' + $scope.email)
					.success(function(data){
						$scope.isFound = data.success;
					});
			};
		}])
	.controller('indexListCtrl', ['$scope', '$http',
		function ($scope, $http) {
			//get list of forms
			$http.get('/api/forms')
				.success(function (data) {
					$scope.forms = data;
					console.log(data);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});

			$scope.formData = {};

			/*$scope.createForm = function () {
				$http.post('/api/forms', $scope.formData)
					.success(function (data) {
						$scope.formData = {};
						$scope.forms = data;
						console.log(data);
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
			};*/

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
	])
	.controller('viewFormCtrl', ['$scope', '$routeParams',
		function ($scope, $routeParams) {
			//get concrete form
			$scope.formId = $routeParams.formId;
		}])
	.controller('editFormCtrl', ['$scope', '$routeParams', '$http',
		function($scope, $routeParams, $http){
			$scope.formId = $routeParams.formId;
		}]);