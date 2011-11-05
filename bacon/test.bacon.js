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

BaconTest.prototype._compare = function(input, value) {
	var pass = false;
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
		return (input == value);
	} else if (value instanceof Array && input instanceof Array) {
		if (value.length !== input.length) {
			return false;
		}

		for (var i = 0; i < value.length; i++) {
			if (!BaconTest.prototype._compare(input[i], value[i])) {
				return false;
			}
		}
		return true;
	} else if (typeof value === 'object' && typeof input === 'object') {
		var prop;
		for (prop in value) {
			if (!BaconTest.prototype._compare(input[prop], value[prop])) {
				return false;
			}
		}
		return true;
	}
	return false;
}

BaconTest.prototype.toEqual = function(value) {
	value = BaconTest.prototype._compare(this.input, value);
	value = value ? true : 'Expected ' + value + ' to equal ' + this.input;
	bacon._currentTest.push(value);
}

BaconTest.prototype.toNotEqual = function(value) {
	value = !BaconTest.prototype._compare(this.input, value);
	value = value ? true : 'Expected ' + value + ' to not equal ' + this.input;
	bacon._currentTest.push(value);
}

BaconTest.prototype.toBe = function(value) {
	value = (this.input === value) ? true : 'Expected ' + value + ' to be ' + this.input + '.';
	bacon._currentTest.push(value);
}

BaconTest.prototype.toNotBe = function(value) {
	value = (this.input === value) ? 'Expected ' + value + ' to not be ' + this.input + '.' : true;
	bacon._currentTest.push(value);
}

BaconTest.prototype.toMatch = function(value) {
	if (!(value instanceof RegExp)) {
		value = new RegExp(value);
	}
	
	value = value.test(this.input) ? true : 'Expected ' + this.input + ' to match ' + value + '.';
	bacon._currentTest.push(value);
}

BaconTest.prototype.toNotMatch = function(value) {
	if (!(value instanceof RegExp)) {
		value = new RegExp(value);
	}
	
	value = value.test(this.input) ? 'Expected ' + this.input + ' to match ' + value + '.' : true;
	bacon._currentTest.push(value);
}
