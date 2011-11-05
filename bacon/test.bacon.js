bacon._testData = [];

bacon.describe = function(desc, fn) {
	bacon._testData.push([desc, fn]);
}

bacon.it = function(desc, fn) {
	bacon._currentTestData.push([desc, fn]);
}

bacon.expect = function(input) {
	return new BaconTest(input);
}

bacon.runTests = function(output_div) {
	bacon._testResults = [];
	for (var i = 0, j; i < bacon._testData.length; i++) {
		bacon._currentTestData = [];
		bacon._testData[i][1].call();
		for (j = 0; j < bacon._currentTestData.length; j++) {
			bacon._currentTest = [];
			bacon._currentTestData[j][1].call();
			bacon._testResults.push({
				desc: bacon._testData[i][0],
				it: bacon._currentTestData[j][0],
				results: bacon._currentTest
			});
		}
	}
	
	var errors, html = '', lastTestDesc = bacon._testResults[0].desc, lastDiv = '',
		result, results = bacon._testResults, success;
		
	for (i = 0; i < bacon._testResults.length; i++) {
		result = bacon._testResults[i];
		
		// If different group of tests, output the previous one and start a new one
		if (result.desc !== lastTestDesc) {
			html += '<div class="testgroup"><h2>' + lastTestDesc + '</h2>' + lastDiv + '</div>';
			lastTestDesc = result.desc;
			lastDiv = '';
		}
		
		success = true;
		errors = [];
		
		for (j = 0; j < result.results.length; j++) {
			if (result.results[j] !== true) {
				success = false;
				errors.push('<strong>' + result.results[j] + '</strong>');
			}
		}
		
		success = (success) ? 'success' : 'failure';
		errors = errors.join('<br />');
		lastDiv += '<div class="test ' + success + '"><p>' + result.it + '</p>' + errors + '</div>';
	}
	html += '<div class="testgroup"><h2>' + lastTestDesc + '</h2>' + lastDiv + '</div>';
	output_div.elements[0].innerHTML = html;
	return bacon._testResults;
}

function BaconTest(input) {
	this.input = input;
}

BaconTest.prototype.toEqual = function(value) {
	value = (this.input === value) ? true : 'Expected ' + value + ' to equal ' + this.input + '.';
	bacon._currentTest.push(value);
}

BaconTest.prototype.toNotEqual = function(value) {
	value = (this.input === value) ? 'Expected ' + value + ' to not equal ' + this.input + '.' : true;
	bacon._currentTest.push(value);
}
