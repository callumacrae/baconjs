bacon._testData = [];
bacon._asyncTestTimeout = 400;

var url = window.location.search.split('=');
url = (url.length > 1) ? url[1].replace(/%20/g, ' ') : false;

bacon.describe = function(desc, fn) {
	if (!url || url === desc) {
		bacon._testData.push([desc, fn]);
	}
};

bacon.it = function(desc, fn, async) {
	if (typeof async === 'undefined') {
		async = false;
	}
	bacon._currentTestData.push([desc, fn, async]);
};

bacon.expect = function(input) {
	return new BaconTest(input);
};

bacon.runTests = function(output_div) {
	bacon._testResults = [];
	var i = -1, j, interval2, contin = true, contin2 = true;
	var interval = setInterval(function() {
		if (!contin) {
			return;
		}
		if (++i >= bacon._testData.length) {
			clearInterval(interval);
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
			$('.testgroup h2').on('click', function() {
				window.location = '?test=' + this.innerHTML.replace(/ /g, '%20');
			});
			return;
		}

		bacon._currentTestData = [];
		bacon._testData[i][1].call();

		j = -1;

		contin = false;

		interval2 = setInterval(function() {
			if (!contin2) {
				return;
			}

			bacon._testErrorType = false;
			if (++j >= bacon._currentTestData.length) {
				clearInterval(interval2);
				contin = true;
				return;
			}

			bacon._currentTest = [];

			if (bacon._currentTestData[j][2]) {
				contin2 = false;
				var time = bacon._currentTestData[j][2];
				var time2 = setTimeout(function() {
					bacon._currentTest.push('Timeout');
					contin2 = true;
				}, typeof time === 'number' ? time : bacon._asyncTestTimeout);
			}

			try {
				bacon._currentTestData[j][1].call(null, function() {
					clearInterval(time2);
					contin2 = true;
				});
			} catch (err) {
				if (err.type === bacon._testErrorType) {
					bacon._currentTest.push(true);
				} else {
					bacon._currentTest.push(err.message);
				}
				clearInterval(time2);
				contin2 = true;
			}

			bacon._testResults.push({
				desc: bacon._testData[i][0],
				it: bacon._currentTestData[j][0],
				results: bacon._currentTest
			});
		}, 1);
	}, 1);
};

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
};

BaconTest.prototype.toEqual = function(value) {
	var new_value = BaconTest.prototype._compare(this.input, value);
	value = new_value ? true : 'Expected ' + value + ' to equal ' + this.input;
	bacon._currentTest.push(value);
};

BaconTest.prototype.toNotEqual = function(value) {
	var new_value = !BaconTest.prototype._compare(this.input, value);
	value = new_value ? true : 'Expected ' + value + ' to not equal ' + this.input;
	bacon._currentTest.push(value);
};

BaconTest.prototype.toBe = function(value) {
	value = (this.input === value) ? true : 'Expected ' + value + ' to be ' + this.input + '.';
	bacon._currentTest.push(value);
};

BaconTest.prototype.toNotBe = function(value) {
	value = (this.input === value) ? 'Expected ' + value + ' to not be ' + this.input + '.' : true;
	bacon._currentTest.push(value);
};

BaconTest.prototype.toMatch = function(value) {
	if (!(value instanceof RegExp)) {
		value = new RegExp(value);
	}

	value = value.test(this.input) ? true : 'Expected ' + this.input + ' to match ' + value + '.';
	bacon._currentTest.push(value);
};

BaconTest.prototype.toNotMatch = function(value) {
	if (!(value instanceof RegExp)) {
		value = new RegExp(value);
	}

	value = value.test(this.input) ? 'Expected ' + this.input + ' to not match ' + value + '.' : true;
	bacon._currentTest.push(value);
};

BaconTest.prototype.toContain = function(value) {
	value = (this.input.indexOf(value) < 0) ? 'Expected ' + this.input + ' to contain ' + value + '.' : true;
	bacon._currentTest.push(value);
};

BaconTest.prototype.toNotContain = function(value) {
	value = (this.input.indexOf(value) < 0) ? true : 'Expected ' + this.input + ' to not contain ' + value + '.';
	bacon._currentTest.push(value);
};

BaconTest.prototype.toBeLessThan = function(value) {
	value = (this.input < value) ? true : 'Expected ' + this.input + ' to be less than ' + value + '.';
	bacon._currentTest.push(value);
};

BaconTest.prototype.toBeGreaterThan = function(value) {
	value = (this.input > value) ? true : 'Expected ' + this.input + ' to be less than ' + value + '.';
	bacon._currentTest.push(value);
};

BaconTest.prototype.toBeDefined = function() {
	bacon._currentTest.push((this.input === undefined) ? 'Expected var to be defined' : true);
};

BaconTest.prototype.toBeUndefined = function() {
	bacon._currentTest.push((this.input === undefined) ? true : 'Expected var to be undefined');
};

BaconTest.prototype.toBeNull = function() {
	bacon._currentTest.push((this.input === null) ? true : 'Expected var to be null');
};

BaconTest.prototype.toBeTruthy = function() {
	bacon._currentTest.push((this.input) ? true : 'Expected ' + this.input + ' to be truthy');
};

BaconTest.prototype.toBeFalsy = function() {
	bacon._currentTest.push((this.input) ? 'Expected ' + this.input + ' to be falsy' : true);
};

BaconTest.prototype.toThrow = function(type) {
	bacon._testErrorType = type;
	this.input.call();
};
