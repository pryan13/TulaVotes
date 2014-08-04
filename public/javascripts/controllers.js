angular.module('tulaVotesControllers', ['tulaVotes.notify', 'tulaVotes.constants', 'tulaVotes.chart'])
	.controller('indexListCtrl', ['$scope', '$http',
		function ($scope, $http) {
			$scope.showMine = false;
			$scope.formData = {};

			var refreshFormsList = function() {
				var listUrl = $scope.showMine
					? '/api/forms/mine'
					: '/api/forms';
				$http.get(listUrl)
					.success(function (response) {
						$scope.forms = response.data;
					})
					.error(function (response) {
						console.log('Error: ' + response);
					});
			};

			refreshFormsList();

			$scope.deleteForm = function (id) {
				$http.delete('/api/forms/' + id)
					.success(function (response) {
						refreshFormsList();
					})
					.error(function (response) {
						console.log('Error: ' + response);
					});
			};

			$scope.toggleMine = function(){
				$scope.showMine = !$scope.showMine;
				refreshFormsList();
			};
		}
	])
	.controller('viewFormCtrl', ['$scope', '$routeParams', '$http', '$location', 'NotifyService', 'NOTIFICATION_TYPES',
		function ($scope, $routeParams, $http, $location, NotifyService, NOTIFICATION_TYPES) {
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

			$scope.goBack = function(){
				$location.url('/index');
			}
		}])
	.controller('statFormCtrl', ['$scope', '$routeParams', '$http', '$location',
		function ($scope, $routeParams, $http, $location) {
			$scope.chartObj;
			$http.get('/api/forms/stat/' + $routeParams.formId)
				.success(function (response) {
					$scope.formData = response.data;
					$scope.chartData = {
						chart: {
							plotBackgroundColor: null,
							plotBorderWidth: null,
							plotShadow: false
						},
						title: {
							text: ''
						},
						tooltip: {
							pointFormat: '<b>{point.y} votes</b><br/><b>{point.percentage:.1f}%</b>'
						},
						plotOptions: {
							pie: {
								allowPointSelect: true,
								cursor: 'pointer',
								dataLabels: {
									enabled: false
								},
								showInLegend: true
							}
						},
                        legend: {
                            layout: 'vertical'
                        },
                        series: [{
                            type: 'pie',
                            data: []
                        }]
					};
					angular.forEach($scope.formData.formOptions, function(fOpt) {
                        $scope.chartData.series[0].data.push([fOpt.text, fOpt.votesCount]);
					});
				})
				.error(function (response) {
					console.log('Error: ' + response);
				});
			$scope.goBack = function(){
				$location.url('/index');
			}
		}])
	.controller('editFormCtrl', ['$scope', '$routeParams', '$http', '$location', 'NotifyService', 'NOTIFICATION_TYPES',
		function($scope, $routeParams, $http, $location, NotifyService, NOTIFICATION_TYPES){
			$scope.isNew = $routeParams.formId === undefined;
			//$scope.formOptions = [];
			if($scope.isNew){
				$scope.formData = {formOptions: [], type: 'radio'};
				$scope.formData.formOptions.push({text: ""});
			}
			
			if (!$scope.isNew){
				$http.get('/api/forms/edit/' + $routeParams.formId)
				.success(function (response) {
					$scope.formData = response.data
					if($scope.formData.formOptions.length == 0)
						$scope.formData.formOptions.push({text: ""});
				})
				.error(function (response) {
					console.log('Error: ' + response);
				});
			}

			$scope.addOption = function(){
				$scope.formData.formOptions.push({text: ""});
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