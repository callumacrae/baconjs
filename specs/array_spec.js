$.describe('array prototype test', function() {
	$.it('should not have enabled itself', function() {
		$.expect([].included).toBeUndefined();
	});
	
	$.it('should enable successfully', function() {
		$.expect($.enableArrayFeatures()).toEqual(true);
	});
	
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
	});

	var rand_ary = [0,1,2,3,4,5,6,7,8,9]
	$.it('should use .shuffle correctly', function() {
		$.expect(rand_ary.shuffle()).toNotEqual(rand_ary);
		$.expect(rand_ary.shuffle()).toNotBe(rand_ary);
		$.expect(rand_ary.shuffle().length).toEqual(10);
	});

	$.it('should use .random correctly', function() {
		$.expect(typeof rand_ary.rand()).toEqual('number');
		$.expect(typeof rand_ary.rand(1)[0]).toEqual('number');
		$.expect(rand_ary.rand(3).length).toEqual(3);
	});

	$.it('should use .compact correctly', function() {
		$.expect([0,1,2,false].compact()).toEqual([1,2]);
		$.expect([0,-1,2,false].compact()).toEqual([-1,2]);
		$.expect([false, null].compact()).toEqual([]);
	});

	$.it('should use .flatten correctly', function() {
		$.expect(['one', 'two', 'three']).toEqual(['one', 'two', 'three']);
		$.expect(['one', [['two'], 'three', [[[['four']]]]]].flatten()).toEqual(['one', 'two', 'three', 'four']);
		$.expect(['one', [{}]].flatten()).toEqual(['one', {}]);
	});
	
	var without = ['one', 'one', 'one', 'two', 'one'];
	$.it('should use .without correctly', function() {
		$.expect(without.without()).toEqual(without);
		$.expect(without.without('two').length).toEqual(4);
		$.expect(without.without('two').indexOf('two')).toEqual(-1);
		$.expect(without.without('one').length).toEqual(1);
	});
	
	$.it('should use .without with an array correctly', function() {
		$.expect(without.without(['one'], true)).toEqual(['two']);
		$.expect(without.without(['one', 'two'], true)).toEqual([]);
	});
	
	$.it('should use .unique correctly', function() {
		$.expect(without.unique()).toEqual(['one', 'two']);
		$.expect(['one', 'one'].unique()).toEqual('one');
	});
});
