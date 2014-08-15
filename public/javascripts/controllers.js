angular.module('tulaVotesControllers', ['tulaVotes.notify', 'tulaVotes.constants', 'tulaVotes.chart', 'tulaVotes.formatInput', 'tulaVotes.completetext'])
	.controller('indexListCtrl', ['$scope', '$http', '$location',
		function ($scope, $http, $location) {
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

			$scope.goVote = function(formId){
				$location.url('/view/' + formId);
			}
		}
	])
	.controller('viewFormCtrl', ['$scope', '$routeParams', '$http', '$location', 'NotifyService', 'NOTIFICATION_TYPES',
		function ($scope, $routeParams, $http, $location, NotifyService, NOTIFICATION_TYPES) {
			$scope.chartObj;
			var initChart = function(data){
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
					series: [
						{
							type: 'pie',
							data: []
						}
					]
				};
				angular.forEach(data, function (fOpt) {
					$scope.chartData.series[0].data.push([fOpt.text, fOpt.votesCount]);
				});
			};
			$http.get('/api/forms/view/' + $routeParams.formId)
				.success(function (response) {
					$scope.formData = response.data;
					initChart($scope.formData.formOptions);
				})
				.error(function (response) {
					console.log('Error: ' + response);
				});
			$scope.vote = function(data){
				var voteData = {formId: data._id, selectedOptions: []};
				angular.forEach(data.formOptions, function(item){
					if(item.checked)
						voteData.selectedOptions.push(item._id);
				});
				$http.post('/api/forms/vote', voteData)
					.success(function (response) {
						if (response.success) {
							initChart(response.data);
							$scope.formData.hasAlreadyVoted = true;
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
					$scope.formData = response.data;
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

			var createForm = function (newForm) {
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
			
			$scope.createForm = function (newForm) {
				createForm(newForm);
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

			$scope.duplicateForm = function (existingForm) {
				createForm(existingForm);
			};

			$scope.goBack = function(){
				$location.url('/index');
			}
		}]);