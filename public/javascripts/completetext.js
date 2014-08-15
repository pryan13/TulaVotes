angular.module('tulaVotes.completetext', [])
	.directive('completetext', ['$timeout', '$compile', function($timeout, $compile){
		return {
			restrict: 'A',
			scope:{
				items: '='
			},
			link: function(scope, element, attr, ctrl){
				scope.test = "test";
				var promptSelect = '<div style="position: relative;">' +
										'<select class="{{test}} form-control" id="' + element.attr('id') +
											'_promptSelect" style="position: absolute; top: -34px; z-index: -1;">' +
											'<option ng-repeat="item in promptItems">{{item}}</option>' +
										'</select>' +
									'</div>';
				scope.promptItems =[];
				var resultSelect = $compile(promptSelect)(scope);
				$timeout(function () {
					element.after(resultSelect);
				}, 300);

				element.on("change", function(){
					var tag = this.value;
					var sc = resultSelect.scope();
					sc.promptItems.unshift(tag);
					sc.$digest();
					$timeout(function () {
						scope.items.push(tag);
					}, 300);
				});
			}
		};
	}]);