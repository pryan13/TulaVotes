angular.module("tulaVotes.notify", [])
	.service("NotifyService",
		["$timeout", "$compile", "$rootScope", "NOTIFICATION_TYPES",
			function($timeout, $compile, $rootScope, NOTIFICATION_TYPES) {
				var domElement;
				this.notify = function(options){
					var optionsToApply = {
						lingerTime: 5000,
						type: NOTIFICATION_TYPES.info,
						message: "Operation complete successfully."
					};
					angular.extend(optionsToApply, options);
					var template = angular.element(
							"<notify-message time=\"" + optionsToApply.lingerTime + "\">"+
								"<div class=\"alert alert-" + optionsToApply.type.class + "\">" +
									"<a href=\"javascript:void(0)\" ng-click=\"close()\" class=\"close\" data-dismiss=\"alert\">&times;</a>" +
									"<strong>" + optionsToApply.type.title + "</strong>&nbsp;&nbsp;&nbsp;" + optionsToApply.message +
								"</div>" +
							"</notify-message>");
					var newScope = $rootScope.$new();
					domElement.empty();
					$timeout(function(){
						domElement.append($compile(template)(newScope));
					}, 300);
				};
				this.defineHolder = function(element){
					domElement = element;
				}
			}
		])
	.directive("notifyHolder",
		["NotifyService",
			function(notifyService){
				return {
					restrict: "E",
					link: function(scope, element){
						notifyService.defineHolder(element);
					}
				};
			}
		])
	.directive("notifyMessage",
		["$timeout",
			function($timeout){
				return {
					restrict: "E",
					transclude: true,
					template: "<div ng-transclude>",
					link: function(scope, element, attr){
						var promiseToEnd,
							promiseToDestroy;
						//ugly hack to get css styling to be interpreted correctly by browser.  Blech!
						$timeout(function() {
							element.addClass("show");
						}, 1);
						scope.close = function() {
							element.remove();
							scope.$destroy();
						};

						function cancelTimeouts() {
							if(promiseToDestroy) {
								$timeout.cancel(promiseToDestroy);
								promiseToDestroy = undefined;
							}
							$timeout.cancel(promiseToEnd);
							element.addClass("show");
						}

						function startTimeouts() {
							promiseToEnd = $timeout(function() {
								element.removeClass("show");
								promiseToDestroy = $timeout(scope.close, 1010);
							}, attr.time);
						}

						element.bind("mouseenter", cancelTimeouts);
						element.bind("mouseleave", startTimeouts);

						startTimeouts();
					}
				};
			}
		]);