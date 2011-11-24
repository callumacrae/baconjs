$.describe('bacon DOM tests', function() {
	$.it('should select elements using tagname', function() {
		$.expect($('p').length).toEqual(4);
		$.expect($('a').length).toEqual(2);
	});

	$.it('should select elements using parameters', function() {
		$.expect($('a[href="#"]').length).toEqual(2);
		$.expect($('[style]').length).toEqual(1);
	});

	$.it('should use the select method correctly', function() {
		$.expect($(document).select('p').length).toEqual(4);
	});

	$.it('should set the .selector property correctly', function() {
		$.expect($('p').selector).toEqual('p');
		$.expect($('non').selector).toEqual('non');
		$.expect($(document).select('p').selector).toEqual('p');
		$.expect($(document).select('non').selector).toEqual('non');
	});

	$.it('should use the select method on multiple elements', function() {
		$.expect($(document).select('p').select('a').length).toEqual(2);
	});

	$.it('should use .each correctly', function(done) {
		var total = 0;
		$('p').each(function() {
			$.expect(this.tagName).toEqual('P');
			total++;
		});
		setTimeout(function() {
			$.expect(total).toEqual(4);
			done();
		}, 1);
	}, true);

	$.it('should use .matches correctly', function() {
		$.expect($('#test').matches('p')).toEqual(true);
		$.expect($('.thediv').matches('div')).toEqual(true);
	});

	$.it('should use .next correctly', function() {
		$.expect($('#test').next().elements[0]).toBe($('h2').elements[0]);
		$.expect($('#test').next('div').elements[0]).toBe($('div').elements[1]);
	});

	$.it('should use .previous correctly', function() {
		$.expect($('h2').previous().elements[0]).toBe($('#test').elements[0]);
		$.expect($('h2').previous('h1').elements[0]).toBe($('h1').elements[0]);
	});

	$.it('should use .children correctly', function() {
		$.expect($('.thediv').children().length).toEqual(4);
		$.expect($('.thediv').children('span').length).toEqual(1);
		$.expect($('.thediv').children('p').length).toEqual(3);
		$.expect($('body').children('h1').length).toEqual(1);
	});

	$.it('should use .parent correctly', function() {
		$.expect($('a').parent().elements[0]).toBe($('p').elements[0]);
		$.expect($('a').parent('body').elements[0]).toBe($('body').elements[0]);
	});

	$.it('should use .siblings correctly', function() {
		$.expect($('.thediv p').siblings().length).toEqual(3);
		$.expect($('.thediv p').siblings('p').length).toEqual(2);
		$.expect($('.thediv p').siblings('span').length).toEqual(1);
	});

	$.it('should use .get correctly', function() {
		$.expect($('.thediv').get(0).elements[0]).toBe($('.thediv').elements[0]);
		$.expect($('.thediv').get(1).elements[0]).toBe($('.thediv').elements[1]);
	});

	$.it('should append from HTMLElement properly', function() {
		var div = document.createElement('div');
		div.innerHTML = 'test';
		$('.thediv').append(div);
		$.expect($('.thediv div').length).toEqual(1);
	});

	$.it('should append from BaconObj properly', function() {
		$('.thediv').append($('h1'));
		$.expect($('.thediv h1').length).toEqual(1);
	});

	$.it('should append from HTML string correctly', function() {
		$('.thediv').append('<i>test</i>');
		$.expect($('.thediv i').length).toEqual(1);
	});

	$.it('should appendTo correctly', function() {
		$('.testp').appendTo('form');
		$.expect($('form .testp').length).toEqual(1);
	});

	$.it('should prependTo correctly', function() {
		$('.testp').prependTo('form');
		$.expect($('form .testp').length).toEqual(3);
	});

	$.it('should insertBefore correctly', function() {
		$('.testp').insertBefore('<span class="lololol">t</span>');
		$.expect($('.testp .lololol').length).toEqual(0);
		$.expect($('.lololol').length).toEqual(4);
	});

	$.it('should prepend from HTMLElement properly', function() {
		var div = document.createElement('strong');
		div.innerHTML = 'test';
		$('.thediv').prepend(div);
		$.expect($('.thediv strong').length).toEqual(2);
	});

	$.it('should prepend from BaconObj properly', function() {
		$('.thediv').prepend($('.thediv strong').get(0));
		$.expect($('.thediv strong').length).toEqual(3);
	});

	$.it('should prepend from HTML string properly', function() {
		$('.thediv').prepend('<strong>test</strong>');
		$.expect($('.thediv strong').length).toEqual(4);
	});

	$.it('should move elements successfully', function() {
		$('strong', 1).moveTo($('#test', 1));
		$.expect($('#test strong').length).toEqual(1);
		$.expect($('#test').children().elements[1]).toBe($('strong').elements[0]);
	});

	$.it('should move elements successfully with prepend', function() {
		$('strong', 1).moveTo($('#test', 1), true);
		$.expect($('#test strong').length).toEqual(1);
		$.expect($('#test').children().elements[0]).toBe($('strong').elements[0]);
	});

	$.it('should copy elements successfully', function() {
		$('strong', 1).copyTo($('#test', 1));
		$.expect($('#test strong').length).toEqual(2);
		$.expect($('#test').children().elements[2].tagName).toEqual('STRONG');
	});

	$.it('should copy elements successfully with prepend', function() {
		$('strong', 1).copyTo($('span', 1), true);
		$.expect($('span strong').length).toEqual(2);
		$.expect($('span', 1).children().elements[0].tagName).toEqual('STRONG');
	});

	$.it('shouid retrieve html successfully', function() {
		$('#test').elements[0].innerHTML = 'test';
		$.expect($('#test').html()).toEqual('test');
	});

	$.it('should set html successfully', function() {
		$('#test').html('hello');
		$.expect($('#test').html()).toEqual('hello');
	});

	$.it('should retrieve values correctly', function() {
		$.expect($('[name="foo"]').value()).toEqual('bar');
	});

	$.it('should retrieve text successfully', function() {
		var text = bacon._toBaconObj('<div><s>w</s>or<p>ti<i>s<u></u>t</i></p></div>').text();
		$.expect(text).toEqual('wortist');
	});

	$.it('should set text successfully', function() {
		$('#test').text('he<b>llo</b>');
		console.log($('#test').text());
		$.expect($('#test').text()).toEqual('he&lt;b&gt;llo&lt;/b&gt;');
		$('#test').text('hello');
	});

	$.it('should retrieve values correctly', function() {
		$('[name="foo"]').value('test');
		$.expect($('[name="foo"]').value()).toEqual('test');
		$('[name="foo"]').value('bar');
	});
});
