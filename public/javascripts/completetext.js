angular.module('tulaVotes.completetext', [])
	.directive('completetext', ['$timeout', '$compile', '$http', function($timeout, $compile, $http){
		return {
			restrict: 'A',
			scope:{
				items: '='
			},
			link: function(scope, element, attr, ctrl){
				var promptSelect = '<div style="position: relative;">' +
										'<ul style="display: none;" class="prompt" id="' + element.attr('id') + '_promptSelect" >' +
											'<li class="prompt-item" ng-click="clickItem(item)" ng-repeat="item in promptItems" data-id="{{item._id}}">{{item.name}}</li>' +
										'</ul>' +
									'</div>';
				scope.promptItems =[];

				scope.clickItem = function(tag){
					var isTagFound = false;
					for(var i = 0; i < scope.items.length; i++){
						isTagFound = !!tag._id && scope.items[i]._id == tag._id || scope.items[i].name == tag.name;
						if(isTagFound)
							break;
					}
					scope.promptItems = [];
					element.val('');
					hide();
					if(!isTagFound)
						scope.items.push(tag);
				};

				var resultSelect = $compile(promptSelect)(scope);;

				$timeout(function () {
					element.after(resultSelect);
				}, 300);

				var prompt = resultSelect.children();
				var show = function(){
					prompt.css('display', 'block');
				};
				var hide = function(){
					prompt.css('display', 'none');
				};

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
							show();
						});
				});
			}
		};
	}]);