bacon.template = {};

bacon.template.autoEscape = true;

/**
 * Parses a Django template using the provided data.
 *
 * @param string template The template, or the location to the template.
 * @param object data The data to pass to the parser.
 * @param function callback The function to pass the data to.
 */
bacon.template.parse = function(template, data, callback) {
	template = bacon.template._lexer(template);
	template = bacon.template._parser(template);

	for (var endString = '', i = 0; i < template.length; i++) {
		endString += template[i].parse(data);
	}

	if (typeof callback === 'function') {
		callback(endString, data);
	}
};

var TEXT = 0, VARIABLE = 1, TAG = 2;
bacon.template._lexer = function(template) {
	var end = [];
	template = template.split(/(\{\{ [a-z]+ \}\}|\{% [^\{\}]+ %\})/g);
	for (var i = 0; i < template.length; i++) {
		if (template[i].indexOf('{%') === 0) {
			end.push([TAG, template[i].slice(3, -3)]);
		} else if (template[i].indexOf('{{') === 0) {
			end.push([VARIABLE, template[i].slice(3, -3)]);
		} else {
			end.push([TEXT, template[i]]);
		}
	}
	return end;
};
bacon.template._parser = function(template, nested) {

	var parseItem = function(item, i) {
		switch (item[0]) {
			case TEXT:
				return new BaconTextNode(item[1]);

			case VARIABLE:
				item = item[1].split('|');
				return new BaconVarNode(item[0], item.slice(1));

			case TAG:
				var name = (item[1].indexOf(' ') < 0) ? item[1] : item[1].split(' ')[0];
				var code = (item[1].indexOf(' ') < 0) ? null : item[1].split(' ').slice(1).join(' ');

				if (name.indexOf('end') === 0) {
					return false;
				}

				var contents = bacon.template._parser(template.slice(i + 1), true);
				template.splice(i, contents[1]);
				contents = contents[0];

				return new BaconTagNode(name, code, contents);
		}
	};

	var end = [], i, item;
	for (i = 0; i < template.length; i++) {
		item = parseItem(template[i], i);
		if (item === false) {
			break;
		}
		end.push(item);
	}
	if (typeof nested === 'undefined' || !nested) {
		return end;
	} else {
		return [end, i];
	}
}

function BaconTextNode(text) {
	this.text = text;
}
BaconTextNode.prototype.parse = function() {
	return this.text;
}

function BaconVarNode(name, filters) {
	this.name = name;
	this.filters = filters;
}
BaconVarNode.prototype.parse = function(data) {
	return bacon.template._getVariable(this.name, this.filters, data);
};

function BaconTagNode(name, code, contents) {
	this.name = name;
	this.code = code;
	this.contents = contents;
}
BaconTagNode.prototype.parse = function(data) {
	if (typeof bacon.template.tags[this.name] === 'function') {
		return bacon.template.tags[this.name].call(null, this.code, this.content, data);
	}
	return '';
};

bacon.template._getVariable = function(name, filters, data) {
	if (name.indexOf('.') < 0) {
		var output = (typeof data[name] === 'undefined') ? '{{ ' + name + ' }}' : data[name];
	} else {
		var splitName = name.split('.');
		var output = data[splitName[0]];
		for (var i = 1; i < splitName.length; i++) {
			if (typeof output !== 'object' || typeof output[splitName[i]] === 'undefined') {
				output = '{{ ' + name + ' }}';
				break;
			}
			output = output[splitName[i]];
		}
		delete i;
	}

	for (var e = false, i = 0; i < filters.length; i++) {
		if (typeof bacon.template.filters[filters[i]] === 'function') {
			output = bacon.template.filter[filter[i]].call(null, output);

			if (filter[i] === 'escape') {
				e = true;
			}
		}
	}

	if (bacon.template.autoEscape === true && !e) {
		output = bacon.template.filters.escape(output);
	}
	return output;
};

bacon.template.filters = {};
bacon.template.filters.escape = function(input) {
	if (typeof input !== 'string') {
		return input;
	}
	return input.replace(/&/g, '&amp;')
		.replace(/\</g, '&lt;')
		.replace(/\>/g, '&gt;')
		.replace(/'/g, '&#39;')
		.replace(/"/g, '&quot;');
};


bacon.template.tags = {};
bacon.template.tags.if = function(code, contents, data) {
	if (bacon.template._getVariable(code, false, data)) {
		for (var endString = '', i = 0; i < contents.length; i++) {
			endString += contents[i].parse(data);
		}
		return ensString;
	}
	return '';
};
