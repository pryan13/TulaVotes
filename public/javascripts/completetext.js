angular.module('tulaVotes.completetext', [])
	.directive('completetext', ['$timeout', '$compile', '$http', function($timeout, $compile, $http){
		return {
			restrict: 'A',
			scope:{
				items: '='
			},
			link: function(scope, element, attr, ctrl){
				var promptSelect = '<div style="position: relative;">' +
										'<ul style="display: none;" class="prompt" ng-mouseover="overPrompt=true" ng-mouseleave="overPrompt=false">' +
											'<li class="prompt-item" ng-class="{true:\'active\'}[$index==$parent.activeItem]" ng-mouseover="$parent.activeItem=$index" ng-click="clickItem(item)" ng-repeat="item in promptItems">{{item.name}}<i ng-if="item.isNew">&nbsp;(new)</i></li>' +
										'</ul>' +
									'</div>';
				scope.promptItems =[];
				scope.activeItem = -1;
				scope.overPrompt = false;

				scope.clickItem = function(tag){
					var isTagFound = false;
					for(var i = 0; i < scope.items.length; i++){
						isTagFound = !!tag._id && scope.items[i]._id == tag._id || scope.items[i].name == tag.name;
						if(isTagFound)
							break;
					}
					clearPrompt();
					element.val('');
					if(!isTagFound)
						scope.items.push(tag);
				};

				var resultSelect = $compile(promptSelect)(scope);

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
				var keyAction = function(code){
					$timeout(function () {
						//enter
						if(code == 13){
							scope.clickItem(scope.promptItems[scope.activeItem]);
							return;
						}
						//escape
						if(code == 27){
							clearPrompt();
							return;
						}
						var max = scope.promptItems.length;
						//up arrow
						if(code == 38){
							if(scope.activeItem == 0 || scope.activeItem == -1)
								scope.activeItem = max - 1;
							else
								scope.activeItem -= 1;
							return;
						}
						//down arrow
						if(code == 40){
							if(scope.activeItem == max - 1)
								scope.activeItem = 0;
							else
								scope.activeItem += 1;
						}
					}, 10);
				};
				var clearPrompt = function(){
					hide();
					$timeout(function () {
						scope.promptItems = [];
						scope.activeItem = -1;
					}, 10);
				};
				element.on("blur", function(){
					if(scope.overPrompt)
						return;
					else
						clearPrompt();
				});
				element.on("keyup", function(e){
					if([13, 27, 38, 40].indexOf(e.keyCode) >= 0){
						keyAction(e.keyCode);
						return;
					}
					var tag = this.value;
					if(tag.length == 0){
						clearPrompt();
						return;
					}
					$http.get('/api/tags/filter/' + tag)
						.success(function(response){
							if(response.data.length == 0){
								//new tag
								scope.promptItems = [{name: tag, isNew: true}];
							} else {
								scope.promptItems = response.data;
							}
							show();
						});
				});
			}
		};
	}]);