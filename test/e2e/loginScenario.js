describe('Application', function(){

	browser.ignoreSynchronization = true;


//	describe('angularjs homepage', function() {
//		it('should greet the named user', function() {
//			browser.get('http://www.angularjs.org');
//
//			element(by.model('yourName')).sendKeys('TheRoks');
//
//			var greeting = element(by.binding('yourName'));
//
//			expect(greeting.getText()).toEqual('Hello TheRoks!');
//		});
//
//		describe('todo list', function() {
//			var todoList;
//
//			beforeEach(function() {
//				browser.get('http://www.angularjs.org');
//
//				todoList = element.all(by.repeater('todo in todos'));
//			});
//
//			it('should list todos', function() {
//				expect(todoList.count()).toEqual(2);
//				expect(todoList.get(1).getText()).toEqual('build an angular app');
//			});
//
//			it('should add a todo', function() {
//				var addTodo = element(by.model('todoText'));
//				var addButton = element(by.css('[value="add"]'));
//
//				addTodo.sendKeys('write a protractor test');
//				addButton.click();
//
//				expect(todoList.count()).toEqual(3);
//				expect(todoList.get(2).getText()).toEqual('write a protractor test');
//			});
//		});
//	});

	var index = {
		url: ['http://localhost:3000/', 'http://localhost:3000/#/index'],
		title: 'Tula Votes!'
	};
	var login = {
		url: ['http://localhost:3000/login'],
		title: 'Enter to vote please'
	}


	it('should redirect to login page instead of index if not authorized', function(){
		for(var i = 0; i < index.url.length; i++){
			browser.driver.get(index.url[i]);
			expect(browser.driver.getCurrentUrl()).toMatch(login.url[0]);
			expect(browser.driver.getTitle()).toEqual(login.title);
		}
	});

	it('should deny authentication for unallowed users and redirect to login page after submit email', function(){
		browser.driver.get(index.url[0]);
		element(by.name('email')).sendKeys('test@mail.com');
		element(by.buttonText('OK')).click();
		expect(browser.driver.getCurrentUrl()).toEqual(login.url[0]);
		expect(browser.driver.getTitle()).toEqual(login.title);
	});

	it('should redirect user to the index page after submit email if user allowed', function(){
		browser.driver.get(index.url[0]);
		element(by.name('email')).sendKeys('master');
		element(by.buttonText('OK')).click();
		expect(browser.driver.getCurrentUrl()).toEqual(index.url[1]);
		expect(browser.driver.getTitle()).toEqual(index.title);
	});
});