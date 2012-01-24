$.describe('Animation library test', function () {
	$.it('should fade out single elements correctly', function (done) {
		$('p', 1).fadeOut(5, function () {
			$.expect(this.elements[0].style.opacity).toEqual(0);
			done();
		});
	}, true);

	$.it('should fade in single elements correctly', function (done) {
		$('p', 1).fadeIn(5, function () {
			$.expect(this.elements[0].style.opacity).toEqual(1);
			done();
		});
	}, true);

	$.it('should fade out multiple elements correctly', function (done) {
		$('p').fadeOut(5, function () {
			$.expect(this.elements[0].style.opacity).toEqual(0);
			$.expect(this.elements[1].style.opacity).toEqual(0);
			$.expect(this.elements[2].style.opacity).toEqual(0);
			$.expect(this.elements[3].style.opacity).toEqual(0);
			done();
		});
	}, true);

	$.it('should fade in multiple elements correctly', function (done) {
		$('p').fadeIn(5, function () {
			$.expect(this.elements[0].style.opacity).toEqual(1);
			$.expect(this.elements[1].style.opacity).toEqual(1);
			$.expect(this.elements[2].style.opacity).toEqual(1);
			$.expect(this.elements[3].style.opacity).toEqual(1);
			done();
		});
	}, true);
});
