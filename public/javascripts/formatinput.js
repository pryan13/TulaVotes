angular.module('tulaVotes.formatInput', [])
	.directive('formatinput', ['dateFilter', function(dateFilter){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ctrl){
				function format(rawValue){
					return dateFilter(rawValue, attrs.format);
				};
				ctrl.$formatters.push(format);
				function parse(formattedValue){
					return new Date(formattedValue);
				};
				ctrl.$parsers.push(parse);
			}
		};
	}]);