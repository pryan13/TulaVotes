angular.module('tulaVotesControllers', ['tulaVotes.notify', 'tulaVotes.constants'])
	.controller('indexListCtrl', ['$scope', '$http',
		function ($scope, $http) {
			//get list of forms
			$http.get('/api/forms')
				.success(function (response) {
					$scope.forms = response.data;
				})
				.error(function (response) {
					console.log('Error: ' + response);
				});

			$scope.formData = {};

			$scope.deleteForm = function (id) {
				$http.delete('/api/forms/' + id)
					.success(function (response) {
						$scope.forms = response.data;
					})
					.error(function (response) {
						console.log('Error: ' + response);
					});
			};
		}
	])
	.controller('viewFormCtrl', ['$scope', '$routeParams', '$http',
		function ($scope, $routeParams, $http) {
		}])
	.controller('editFormCtrl', ['$scope', '$routeParams', '$http', '$location', 'NotifyService', 'NOTIFICATION_TYPES',
		function($scope, $routeParams, $http, $location, NotifyService, NOTIFICATION_TYPES){
			$scope.isNew = $routeParams.formId === undefined;
			
			if (!$scope.isNew){
				$http.get('/api/forms/' + $routeParams.formId)
				.success(function (response) {
					$scope.formData = response.data;
				})
				.error(function (response) {
					console.log('Error: ' + response);
				});
			}
			
			$scope.createForm = function (newForm) {
				$http.post('/api/forms', newForm)
					.success(function (response) {
						if (response.success) {
							$scope.formData = response.data;
							$scope.isNew = false;
						}
						NotifyService.notify({type: NOTIFICATION_TYPES.success});
					})
					.error(function (response) {
						NotifyService.notify({type: NOTIFICATION_TYPES.error});
						console.log('Error: ' + response);
					});
			};

			$scope.updateForm = function (existingForm) {
				$http.put('/api/forms', existingForm)
					.success(function (response) {
						if(response.success)
							$scope.formData = response.data;
						NotifyService.notify({type: NOTIFICATION_TYPES.success});
					})
					.error(function (response) {
						NotifyService.notify({type: NOTIFICATION_TYPES.error});
						console.log('Error: ' + response);
					});
			};

			$scope.goBack = function(){
				$location.url('/index');
			}
		}]);