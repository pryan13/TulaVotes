angular.module('tulaVotes.completetext', [])
	.directive('completetext', ['$timeout', '$compile', '$http', function($timeout, $compile, $http){
		return {
			restrict: 'A',
			scope:{
				items: '='
			},
			link: function(scope, element, attr, ctrl){
				var promptSelect = '<div style="position: relative;">' +
										'<ul class="prompt" id="' + element.attr('id') + '_promptSelect" >' +
											'<li class="prompt-item" ng-click="clickItem(item)" ng-repeat="item in promptItems" data-id="{{item._id}}">{{item.name}}</li>' +
										'</ul>' +
									'</div>';
				scope.promptItems =[];

				scope.clickItem = function(ttag){
					scope.items.push(ttag);
					scope.promptItems = [];
					element.val('');
				};

				var resultSelect = $compile(promptSelect)(scope);
				var select = resultSelect.children();
				$timeout(function () {
					element.after(resultSelect);
				}, 300);

				element.on("keyup", function(){
					var tag = this.value;
					var sc = resultSelect.scope();
					if(tag.length == 0){
						$timeout(function () {
							sc.promptItems = [];
						}, 10);
						return;
					}
					$http.get('/api/tags/' + tag)
						.success(function(response){
							if(response.data.length == 0){
								//new tag
								sc.promptItems = [{name: tag}];
							} else {
								sc.promptItems = response.data;
							}
						});
				});
			}
		};
	}]);