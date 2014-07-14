describe("Application", function(){
	browser.ignoreSynchronization = true;

	it("should redirect user to edit form page when any edit button clicked", function(){
		browser.driver.get("http://localhost:3000");
		expect(browser.driver.getCurrentUrl()).toEqual("http://localhost:3000/login");
		element(by.name('email')).sendKeys('master');
		element(by.buttonText("OK")).click();
		expect(browser.driver.getCurrentUrl()).toEqual("http://localhost:3000/#/index");
		element(by.repeater("form in forms").row(0)).element(by.css(".link-white")).click();
		expect(browser.driver.getCurrentUrl()).toMatch("http://localhost:3000/#/edit/");
	});

	var checkOptionsCount = function(expectedCount){
		var optionsCount = element.all(by.repeater("option in formData.formOptions")).count();
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
			element(by.repeater("option in formData.formOptions").row(1)).element(by.css(".close")).click();
			checkOptionsCount(1);
		});
		it("should not allow remain form without at least one option", function(){
			checkOptionsCount(1);
			var isCloseBtnExist = element(by.repeater("option in formData.formOptions").row(0)).isElementPresent(by.css(".close"));
			expect(isCloseBtnExist).toBeFalsy();
		});
	});
});