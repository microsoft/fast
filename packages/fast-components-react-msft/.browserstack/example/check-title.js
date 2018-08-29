module.exports = function helloBrowserStack(browser, next) {
    /*
	next must be called by this method somewhere. 
	in case test fails next can be passed some error message.
	
	eg:
	
	if (title === 'Google') {
      	     next(null);
        } else {
            next(new Error('UH OH Title is not ok! Are you on google.com?'));
        }
    */

    browser.title(function(err, title) {
        console.log("Title for the page: "+title)
        browser.elementByName('q', function(err, el) {
            el.sendKeys("BrowserStack", function() {
                browser.elementByName("btnG", function(err,el) {
                    el.click(function() {
                        next(null);
                    })
                })
            })
        })
    })
}
