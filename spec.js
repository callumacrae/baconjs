$.describe('Bacon test tests', function() {
	$.it('should work .toEqual correctly', function() {
		$.expect(4).toEqual(4);
		$.expect(2.5).toEqual(2.5);
		$.expect('example string').toEqual('example string');
	});
});