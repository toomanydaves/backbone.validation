Backbone.Validation = (function() {
	var validators = {
		required: function(value, attr, msg) {
			if (_.isNull(value) || _.isUndefined(value) || (_.isString(value) && value.trim() === '')) {
				return msg || attr + ' is required';
			}
		},
        min: function(value, attr, msg, minValue) {
            if(value < minValue) {
                return attr + ' must be equal to or larger than ' + minValue;
            }
        },
        max: function(value, attr, msg, maxValue) {
            if(value > maxValue) {
                return attr + ' must be equal to or less than ' + maxValue;
            }
        }
	};

	var getValidator = function(view, attr) {
		var validation = view.model.validation[attr];

        if (_.isFunction(validation)) {
			return validation;
		} else {
		    var vals = [];
		    for(attr in validation) {
		        if(attr !== 'msg' && validation.hasOwnProperty(attr)) {
    			    vals.push({
    			        fn: validators[attr],
    			        val: validation[attr],
    			        msg: validation['msg']
    		        });   
		        }
		    }
		    return vals;
		}
	};
	
	var validate = function(view, attr, value){
	    var validators = getValidator(view, attr);
	    if(_.isFunction(validators)){
	        return validators(value);
	    } else {
	        var result = '';
	        for (var i=0; i < validators.length; i++) {
	           var validator = validators[i];
	           var res = validator.fn(value, attr, validator.msg, validator.val);
	           if(res){
	               result += res;
	           }
	        };
	        return result;
	    }
	    
	};

	return {
		version: '0.0.1',
		valid: function(view, attr) {
			view.$('#' + attr).removeClass('invalid');
			view.$('#' + attr).removeData('error');
		},
		invalid: function(view, attr, error) {
			view.$('#' + attr).data('error', error);
			view.$('#' + attr).addClass('invalid');
		},

		bind: function(view) {
			var that = this;
			view.model.validate = function(attrs) {
				for (attr in attrs) {
					var result = validate(view, attr, attrs[attr]);

					if (result) {
						that.invalid(view, attr, result);
					} else {
						that.valid(view, attr);
					}
					
					return result;
				}
				return undefined;
			};
		}
	};
} ());
