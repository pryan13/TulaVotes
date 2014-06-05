describe("indexListCtrl >", function(){
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

describe("editFormCtrl >", function(){
	var scope,controller,$httpBackend, routeParams;
	beforeEach(module("tulaVotesApp"));
	afterEach(function(){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it("should not get form details if formId is not provided", inject(function(_$httpBackend_, $routeParams, $rootScope, $controller){
		$httpBackend = _$httpBackend_;
		routeParams = $routeParams;
		scope = $rootScope.$new();
		controller = $controller("editFormCtrl", {$scope: scope, $routeParams: routeParams});
		expect(scope.formId).toBeUndefined();
	}));

	it("should request form details if formId is provided", inject(function(_$httpBackend_, $routeParams, $rootScope, $controller){
		var id = '538f2a679c8bfa0000ded5ec',
			form = {
			_id: id,
			__v: '0',
			name: 'Form Name',
			description: 'Form Description',
			type: 'radio',
			isActive: true
		};
		$httpBackend = _$httpBackend_;
		$httpBackend.expectGET("/api/forms/" + id)
			.respond(form);
		routeParams = $routeParams;
		scope = $rootScope.$new();
		routeParams.formId = id;
		controller = $controller("editFormCtrl", {$scope: scope, $routeParams: routeParams});
		expect(scope.formId).toEqual(id);
		$httpBackend.flush();
		expect(scope.formDate).toEqual(form);
	}));
});
