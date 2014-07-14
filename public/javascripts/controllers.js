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
	.controller('viewFormCtrl', ['$scope', '$routeParams', '$http', 'NotifyService', 'NOTIFICATION_TYPES',
		function ($scope, $routeParams, $http, NotifyService, NOTIFICATION_TYPES) {
			$scope.hasAlreadyVoted = false;
					$http.get('/api/forms/view/' + $routeParams.formId)
						.success(function (response) {
					$scope.formData = response.data;
					angular.forEach($scope.formData.formOptions, function(fOpt) {
						$scope.hasAlreadyVoted = $scope.hasAlreadyVoted || fOpt.checked;
					});
				})
				.error(function (response) {
					console.log('Error: ' + response);
				});
			$scope.vote = function(data){
				var voteData = {formId: data._id, selectedOptions: []};
				var vd = angular.forEach(data.formOptions, function(item){
					if(item.checked)
						voteData.selectedOptions.push(item._id);
				});
				$http.post('/api/forms/vote', voteData)
					.success(function (response) {
						if (response.success) {
							$scope.hasAlreadyVoted = true;
							NotifyService.notify({type: NOTIFICATION_TYPES.success});
						}
						else {
							NotifyService.notify({type: NOTIFICATION_TYPES.info, message: "Something went wrong"});
						}
					})
					.error(function (response) {
						NotifyService.notify({type: NOTIFICATION_TYPES.error, message: response.error});
						console.log('Error: ' + response);
					});
			};
		}])
	.controller('editFormCtrl', ['$scope', '$routeParams', '$http', '$location', 'NotifyService', 'NOTIFICATION_TYPES',
		function($scope, $routeParams, $http, $location, NotifyService, NOTIFICATION_TYPES){
			$scope.isNew = $routeParams.formId === undefined;
			//$scope.formOptions = [];
			if($scope.isNew){
				$scope.formData = {formOptions: []};
				$scope.formData.formOptions.push({text: "", checked: false});
			}
			
			if (!$scope.isNew){
				$http.get('/api/forms/' + $routeParams.formId)
				.success(function (response) {
					$scope.formData = response.data
					if($scope.formData.formOptions.length == 0)
						$scope.formData.formOptions.push({text: "", checked: false});
				})
				.error(function (response) {
					console.log('Error: ' + response);
				});
			}

			$scope.addOption = function(){
				$scope.formData.formOptions.push({text: "", checked: false});
			};

			$scope.deleteOption = function(optNum){
				$scope.formData.formOptions.splice(optNum, 1);
			};
			
			$scope.createForm = function (newForm) {
				$http.post('/api/forms', newForm)
					.success(function (response) {
						if (response.success) {
							$scope.formData = response.data;
							$scope.isNew = false;
							NotifyService.notify({type: NOTIFICATION_TYPES.success});
						}
						else {
							NotifyService.notify({type: NOTIFICATION_TYPES.info, message: "Something went wrong"});
						}
					})
					.error(function (response) {
						NotifyService.notify({type: NOTIFICATION_TYPES.error, message: response.error});
						console.log('Error: ' + response);
					});
			};

			$scope.updateForm = function (existingForm) {
				$http.put('/api/forms', existingForm)
					.success(function (response) {
						if(response.success) {
							$scope.formData = response.data;
							NotifyService.notify({type: NOTIFICATION_TYPES.success});
						}
						else {
							NotifyService.notify({type: NOTIFICATION_TYPES.info, message: "Something went wrong"});
						}
					})
					.error(function (response) {
						NotifyService.notify({type: NOTIFICATION_TYPES.error, message: response.error});
						console.log('Error: ' + response);
					});
			};

			$scope.goBack = function(){
				$location.url('/index');
			}
		}]);