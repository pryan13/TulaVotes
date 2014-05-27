describe('homepage >', function(){
	it('should redirect to login page if not authorized', function(){
		browser.driver.get('http://localhost:3000/');
		expect(browser.driver.getTitle().toEqual('Enter to vote please'));
	});
});