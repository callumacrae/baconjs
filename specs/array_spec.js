$.describe('array prototype test', function() {
	$.it('should use .included correctly', function() {
		$.expect(['one', 'two', 'three'].included('one')).toEqual(true);
		$.expect(['one', 'two', 'three'].included('four')).toEqual(false);
	});

	$.it('should use .min correctly with ints', function() {
		$.expect([6,2,7,3].min()).toEqual(2);
		$.expect([6,2,7,-3].min()).toEqual(-3);
	});

	$.it('should use .min correctly with strings', function() {
		$.expect(['one', 'two', 'three'].min()).toEqual('one');
	});

	$.it('should use .min correctly with mixed data', function() {
		$.expect(['one', 2, 'three', 4, 'five'].min()).toEqual('five');
		$.expect(['one', 2, 'three', 4, 'five'].min('string')).toEqual('five');
		$.expect([-1, 2, 'three', 4, 'five'].min('string')).toEqual('five');
		$.expect([2, -2, 'three', 4, 'five'].min('number')).toEqual(-2);
		$.expect([2, -2, 'three', 4, 'five'].min()).toEqual(-2);
	});

	$.it('should use .max correctly with ints', function() {
		$.expect([6,2,7,3].max()).toEqual(7);
		$.expect([-6,-2,-7,-3].max()).toEqual(-2);
	});

	$.it('should use .max correctly with strings', function() {
		$.expect(['one', 'two', 'three'].max()).toEqual('two');
	});

	$.it('should use .max correctly with mixed data', function() {
		$.expect(['one', 2, 'three', 4, 'five'].max()).toEqual('three');
		$.expect(['one', 2, 'three', 4, 'five'].max('string')).toEqual('three');
		$.expect([-1, 2, 'three', 4, 'five'].max('string')).toEqual('three');
		$.expect([2, -2, 'three', 4, 'five'].max('number')).toEqual(4);
		$.expect([2, -2, 'three', 4, 'five'].max()).toEqual(4);
	});

	$.it('should use .range correctly', function() {
		$.expect([5,2,7,1].range()).toEqual(6);
		$.expect([5,-2,7,1].range()).toEqual(9);
		$.expect(['test',-2,7,1].range()).toEqual(9);
	});

	$.it('should use .groupBy correctly', function() {
		var group = [1.5, 2.3, 2.6, 3.3, 3.6].groupBy(function(num) {
			return Math.floor(num);
		});
		$.expect(group).toEqual({1: [1.5], 2: [2.3, 2.6], 3: [3.3, 3.6]});
	})
});
