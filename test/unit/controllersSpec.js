/**
 * Created by Vitaly on 5/19/2014.
 */

describe("IndexController >", function(){
	describe("Forms List Section >", function(){
		var scope,controller,$httpBackend;
		beforeEach(module("tulaVotesApp"));
		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller){
			$httpBackend = _$httpBackend_;
			$httpBackend.expectGET("/api/forms")
				.respond([{text: 'sample form 0'},{text: 'sample form 1'},{text: 'sample form 2'},{text: 'sample form 3'}])
			scope = $rootScope.$new();
			controller = $controller("indexListCtrl", {$scope: scope});
		}));
		afterEach(function(){
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it("should fetch list of forms with 4 items", function(){
			expect(scope.forms).toBeUndefined();
			$httpBackend.flush();
			expect(scope.forms).not.toBeUndefined();
			expect(scope.forms.length).toEqual(4);
		});
	});
});