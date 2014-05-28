describe('Login page >', function(){
	var index = {
		url: ['http://localhost:3000/', 'http://localhost:3000/#/index'],
		title: 'Tula Votes!'
	};
	var login = {
		url: ['http://localhost:3000/login'],
		title: 'Enter to vote please'
	}

	browser.ignoreSynchronization = true;

	it('should be represented instead of index if not authorized', function(){
		for(var i = 0; i < index.url.length; i++){
			browser.driver.get(index.url[i]);
			expect(browser.driver.getCurrentUrl()).toMatch(login.url[0]);
			expect(browser.driver.getTitle()).toEqual(login.title);
		}
	});

	it('should redirect user to the index page after submit email', function(){
		browser.driver.get(index.url[0]);
		element(by.name('email')).sendKeys('test@mail.com');
		element(by.buttonText('OK')).click();
		expect(browser.driver.getCurrentUrl()).toEqual(index.url[1]);
		expect(browser.driver.getTitle()).toEqual(index.title);
	});
});