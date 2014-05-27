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
			
			if ($scope.formId != ''){
				$http.get('/api/forms/' + $scope.formId)
				.success(function (data) {
					$scope.formDate = data;
					console.log(data);
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
			}
			
			$scope.createForm = function () {
				var params = '';
				if ($scope.formId && $scope.formId.length > 0){
					params = '/' + $scope.formId;
				}
				delete $scope.formDate._id;
				delete $scope.formDate.__v;
				$http.post('/api/forms' + params, $scope.formDate)
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