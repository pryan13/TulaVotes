describe("Application", function(){
	browser.ignoreSynchronization = true;

	it("should redirect user to create form page when create form button clicked", function(){
		browser.driver.get("http://localhost:3000");
		expect(browser.driver.getCurrentUrl()).toEqual("http://localhost:3000/login");
		element(by.name('email')).sendKeys('master');
		element(by.buttonText("OK")).click();
		expect(browser.driver.getCurrentUrl()).toEqual("http://localhost:3000/#/index");
		element(by.id("createFormLink")).click();
		expect(browser.driver.getCurrentUrl()).toEqual("http://localhost:3000/#/create/");
	});

	var checkOptionsCount = function(expectedCount){
		var optionsCount = element.all(by.repeater("option in formOptions")).count();
		expect(optionsCount).toEqual(expectedCount);
	};

	describe("Options section", function(){
		it("should contain one initial option to fill", function(){
			checkOptionsCount(1);
		});
		it("should allow add new options with Add button click", function(){
			element(by.id("btnAddOption")).click();
			checkOptionsCount(2);
		});
		it("should allow delete existing options with Delete button click", function(){
			element(by.repeater("option in formOptions").row(1)).element(by.css(".close")).click();
			checkOptionsCount(1);

		});
	});
});