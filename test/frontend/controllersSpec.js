describe("indexListCtrl", function(){
	describe("Forms List Section", function(){
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
				.respond({success: true, data: [{text: 'sample form 0'},{text: 'sample form 1'},{text: 'sample form 2'},{text: 'sample form 3'}]})
			expect(scope.forms).toBeUndefined();
			$httpBackend.flush();
			expect(scope.forms).not.toBeUndefined();
			expect(scope.forms.length).toEqual(4);
		});
	});
});

describe("editFormCtrl", function(){
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

		expect(scope.isNew).toBeTruthy();
		expect(scope.formData).toBeDefined();
	}));

	it("should request form details if formId is provided", inject(function(_$httpBackend_, $routeParams, $rootScope, $controller){
		var id = '538f2a679c8bfa0000ded5ec',
			form = {
				_id: id,
				__v: '0',
				name: 'Form Name',
				description: 'Form Description',
				type: 'radio',
				isActive: true,
				formOptions: [{text: "New Option", checked: false},{text: "New Option Again", checked: false}]
			};
		$httpBackend = _$httpBackend_;
		$httpBackend.expectGET("/api/forms/" + id)
			.respond({success: true, data: form});
		routeParams = $routeParams;
		scope = $rootScope.$new();
		routeParams.formId = id;
		controller = $controller("editFormCtrl", {$scope: scope, $routeParams: routeParams});

		expect(scope.isNew).toBeFalsy();
		$httpBackend.flush();
		expect(scope.formData).toEqual(form);
	}));

	it("should provide at least one form option to fill", inject(function(_$httpBackend_, $routeParams, $rootScope, $controller){
		//new form
		scope = $rootScope.$new();
		controller = $controller("editFormCtrl", {$scope: scope});

		expect(scope.formData.formOptions).toBeDefined();
		expect(scope.formData.formOptions.length).toEqual(1);
		//existing form
		var id = '538f2a679c8bfa0000ded5ec',
			form = {
				_id: id,
				__v: '0',
				name: 'Form Name',
				description: 'Form Description',
				type: 'radio',
				isActive: true,
				formOptions: [{
					text: "", checked: false
				}]
			};
		$httpBackend = _$httpBackend_;
		$httpBackend.expectGET("/api/forms/" + id)
			.respond({success: true, data: form});
		routeParams = $routeParams;
		scope = $rootScope.$new();
		routeParams.formId = id;
		controller = $controller("editFormCtrl", {$scope: scope, $routeParams: routeParams});

		$httpBackend.flush();
		expect(scope.formData.formOptions).toBeDefined();
		expect(scope.formData.formOptions.length).toEqual(1);
	}));

	it("should add form option", inject(function(_$httpBackend_, $routeParams, $rootScope, $controller){
		//new form
		scope = $rootScope.$new();
		controller = $controller("editFormCtrl", {$scope: scope});

		expect(scope.formData.formOptions).toBeDefined();
		expect(scope.formData.formOptions.length).toEqual(1);
		scope.addOption();
		expect(scope.formData.formOptions.length).toEqual(2);
		//existing form
		var id = '538f2a679c8bfa0000ded5ec',
			form = {
				_id: id,
				__v: '0',
				name: 'Form Name',
				description: 'Form Description',
				type: 'radio',
				isActive: true,
				formOptions: [{
					text: "", checked: false
				}]
			};
		$httpBackend = _$httpBackend_;
		$httpBackend.expectGET("/api/forms/" + id)
			.respond({success: true, data: form});
		routeParams = $routeParams;
		scope = $rootScope.$new();
		routeParams.formId = id;
		controller = $controller("editFormCtrl", {$scope: scope, $routeParams: routeParams});

		$httpBackend.flush();
		expect(scope.formData.formOptions).toBeDefined();
		expect(scope.formData.formOptions.length).toEqual(1);
	}));

	it("should delete form option", inject(function(_$httpBackend_, $routeParams, $rootScope, $controller){
		//new form
		scope = $rootScope.$new();
		controller = $controller("editFormCtrl", {$scope: scope});

		expect(scope.formData.formOptions).toBeDefined();
		expect(scope.formData.formOptions.length).toEqual(1);
		scope.addOption();
		expect(scope.formData.formOptions.length).toEqual(2);
		scope.deleteOption('1');
		expect(scope.formData.formOptions.length).toEqual(1);
		//existing form
		var id = '538f2a679c8bfa0000ded5ec',
			form = {
				_id: id,
				__v: '0',
				name: 'Form Name',
				description: 'Form Description',
				type: 'radio',
				isActive: true,
				formOptions: [{
					text: "", checked: false
				}]
			};
		$httpBackend = _$httpBackend_;
		$httpBackend.expectGET("/api/forms/" + id)
			.respond({success: true, data: form});
		routeParams = $routeParams;
		scope = $rootScope.$new();
		routeParams.formId = id;
		controller = $controller("editFormCtrl", {$scope: scope, $routeParams: routeParams});

		$httpBackend.flush();
		expect(scope.formData.formOptions).toBeDefined();
		expect(scope.formData.formOptions.length).toEqual(1);
	}));

	it("should save new form", inject(function(_$httpBackend_, $routeParams, $rootScope, $controller){
		var form = {
				__v: '0',
				name: 'Form Name',
				description: 'Form Description',
				type: 'radio',
				isActive: true,
				formOptions: [{
					text: "Option", checked: false
				}]
			},
			savedForm = form;
		savedForm._id = '538f2a679c8bfa0000ded5ec';
		$httpBackend = _$httpBackend_;
		$httpBackend.expectPOST("/api/forms")
			.respond({success: true, data: savedForm});
		scope = $rootScope.$new();
		controller = $controller("editFormCtrl", {$scope: scope});

		expect(scope.formData).toBeDefined();
		expect(scope.isNew).toBeTruthy();
		scope.createForm(form);
		$httpBackend.flush();
		expect(scope.formData).toEqual(savedForm);
	}));

	it("should update existing form", inject(function(_$httpBackend_, $routeParams, $rootScope, $controller){
		var id='538f2a679c8bfa0000ded5ec',
			existingForm = {
				_id: id,
				__v: '0',
				name: 'Form Name',
				description: 'Form Description',
				type: 'radio',
				isActive: true,
				formOptions: [{	text: "option", checked: false}]
			},
			updatedForm = {
				_id: id,
				__v: '0',
				name: 'Updated Form Name',
				description: 'Updated Form Description',
				type: 'checkbox',
				isActive: true,
				formOptions: [{text: "new option", checked: false}, {text: "one more new option", checked: false}]
			};
		$httpBackend = _$httpBackend_;
		$httpBackend.expectGET("/api/forms/" + id)
			.respond({success: true, data: existingForm});
		scope = $rootScope.$new();
		routeParams.formId = id;
		controller = $controller("editFormCtrl", {$scope: scope, $routeParams: routeParams});

		$httpBackend.flush();
		expect(scope.formData).toEqual(existingForm);

		$httpBackend.expectPUT("/api/forms")
			.respond({success: true, data: updatedForm});
		scope.updateForm(updatedForm);
		$httpBackend.flush();
		expect(scope.formData).toEqual(updatedForm);
	}));
});

describe("viewFormCtrl", function(){});
