/**
 * Created by Vitaly on 5/19/2014.
 */
describe("LoginController >", function(){
	var scope,controller,$httpBackend;
	beforeEach(module("tulaVotesApp"));
	beforeEach(inject(function(_$httpBackend_, $rootScope, $controller){
		$httpBackend = _$httpBackend_;
		scope = $rootScope.$new();
		controller = $controller("logInCtrl", {$scope: scope});
	}));

	afterEach(function(){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it("model should be initialized with properly values", function(){
		expect(scope.email).toEqual('');
		expect(scope.isFound).toBeFalsy();
	});

	it("should deny access if user's email doesn't exist in db", function(){
		$httpBackend.expectGET("/api/users/unexisting@tulavotes.com")
			.respond({success: false});

		scope.email = 'unexisting@tulavotes.com';
		scope.logIn();
		$httpBackend.flush();

		expect(scope.isFound).toBeFalsy();
	});

	it("should allow access if user's email does exist in db", function(){
		$httpBackend.expectGET("/api/users/existing@tulavotes.com")
			.respond({success: true});

		scope.email = 'existing@tulavotes.com';
		scope.logIn();
		$httpBackend.flush();

		expect(scope.isFound).toBeTruthy();
	});
});

describe("IndexController >", function(){
	describe("Forms List Section >", function(){
		var scope,controller,$httpBackend;
		beforeEach(module("tulaVotesApp"));
		beforeEach(inject(function(_$httpBackend_, $rootScope, $controller){
			$httpBackend = _$httpBackend_;
			scope = $rootScope.$new();
			controller = $controller("indexListCtrl", {$scope: scope});
		}));
		afterEach(function(){
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it("should fetch list of forms with 4 items", function(){
			$httpBackend.expectGET("/api/forms")
				.respond([{text: 'sample form 0'},{text: 'sample form 1'},{text: 'sample form 2'},{text: 'sample form 3'}])
			expect(scope.forms).toBeUndefined();
			$httpBackend.flush();
			expect(scope.forms).not.toBeUndefined();
			expect(scope.forms.length).toEqual(4);
		});
	});
});