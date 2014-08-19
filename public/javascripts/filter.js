angular.module('tulaVotes.filters', [])
	.filter('booleanToText', function(){
		return function(input, output){
			var out = {
				'true': output[0],
				'false': output[1]
			}
			return out[input];
		};
	});