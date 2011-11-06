$.describe('AJAX tests', function() {
	$.it('should use $.req correctly with params', function(done) {
		$.req('GET', '/ajaxtest', 'foo=bar', function(res) {
			$.expect(res).toEqual({
				method: 'GET',
				GET: $.qs('foo=bar'),
				POST: []
			});
			console.log(res)
			done();
		});
	}, true);
	
	$.it('should use $.req correctly with params and object data', function(done) {
		$.req('GET', '/ajaxtest', {foo:'bar'}, function(res) {
			$.expect(res).toEqual({
				method: 'GET',
				GET: $.qs('foo=bar'),
				POST: []
			});
			done();
		});
	}, true);
	
	$.it('should use $.req correctly with params and no data', function(done) {
		$.req('GET', '/ajaxtest', function(res) {
			$.expect(res).toEqual({
				method: 'GET',
				GET: [],
				POST: []
			});
			done();
		});
	}, true);
	
	$.it('should use $.req correctly with an object', function(done) {
		$.req({
			method: 'GET',
			url: '/ajaxtest',
			data: 'foo=bar',
			callback: function(res) {
				$.expect(res).toEqual({
					method: 'GET',
					GET: $.qs('foo=bar'),
					POST: []
				});
				done();
			}
		});
	}, true);
	
	$.it('should use $.req correctly with an object and no data', function(done) {
		$.req({
			method: 'GET',
			url: '/ajaxtest',
			callback: function(res) {
				$.expect(res).toEqual({
					method: 'GET',
					GET: [],
					POST: []
				});
				done();
			}
		});
	}, true);
	
	$.it('should use $.get correctly with params', function(done) {
		$.get('/ajaxtest', 'foo=bar', function(res) {
			$.expect(res).toEqual({
				method: 'GET',
				GET: $.qs('foo=bar'),
				POST: []
			});
			done();
		});
	}, true);
	
	$.it('should use $.get correctly with params and object data', function(done) {
		$.get('/ajaxtest', {foo:'bar'}, function(res) {
			$.expect(res).toEqual({
				method: 'GET',
				GET: $.qs('foo=bar'),
				POST: []
			});
			done();
		});
	}, true);
	
	$.it('should use $.get correctly with params and no data', function(done) {
		$.get('/ajaxtest', function(res) {
			$.expect(res).toEqual({
				method: 'GET',
				GET: [],
				POST: []
			});
			done();
		});
	}, true);
	
	$.it('should use $.get correctly with an object', function(done) {
		$.get({
			url: '/ajaxtest',
			data: 'foo=bar',
			callback: function(res) {
				$.expect(res).toEqual({
					method: 'GET',
					GET: $.qs('foo=bar'),
					POST: []
				});
				done();
			}
		});
	}, true);
	
	$.it('should use $.get correctly with an object and no data', function(done) {
		$.get({
			url: '/ajaxtest',
			callback: function(res) {
				$.expect(res).toEqual({
					method: 'GET',
					GET: [],
					POST: []
				});
				done();
			}
		});
	}, true);
	
	$.it('should use $.post correctly with params', function(done) {
		$.post('/ajaxtest', 'foo=bar', function(res) {
			$.expect(res).toEqual({
				method: 'POST',
				GET: [],
				POST: $.qs('foo=bar')
			});
			done();
		});
	}, true);
	
	$.it('should use $.post correctly with params and object data', function(done) {
		$.post('/ajaxtest', {foo:'bar'}, function(res) {
			$.expect(res).toEqual({
				method: 'POST',
				GET: [],
				POST: $.qs('foo=bar')
			});
			done();
		});
	}, true);
	
	$.it('should use $.post correctly with params and no data', function(done) {
		$.post('/ajaxtest', function(res) {
			$.expect(res).toEqual({
				method: 'POST',
				GET: [],
				POST: []
			});
			done();
		});
	}, true);
	
	$.it('should use $.post correctly with an object', function(done) {
		$.post({
			url: '/ajaxtest',
			data: 'foo=bar',
			callback: function(res) {
				$.expect(res).toEqual({
					method: 'POST',
					GET: [],
					POST: $.qs('foo=bar')
				});
				done();
			}
		});
	}, true);
	
	$.it('should use $.post correctly with an object and no data', function(done) {
		$.post({
			url: '/ajaxtest',
			callback: function(res) {
				$.expect(res).toEqual({
					method: 'POST',
					GET: [],
				POST: []
				});
				done();
			}
		});
	}, true);
});