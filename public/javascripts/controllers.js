angular.module('tulaVotesControllers', [])
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
	.controller('editFormCtrl', ['$scope', '$routeParams', '$http', '$location',
		function($scope, $routeParams, $http, $location){
			$scope.formId = $routeParams.formId;
			
			$scope.createForm = function () {
				$http.post('/api/forms', $scope.formDate)
					.success(function (data) {
						$scope.formData = {};
						$scope.forms = data;						
						$location.url('/index');
					})
					.error(function (data) {
						console.log('Error: ' + data);
					});
			};
		}]);