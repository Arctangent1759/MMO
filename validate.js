
if( typeof Array.isArray !== 'function' ) {
  Array.isArray = function( arr ) {
	return Object.prototype.toString.call( arr ) === '[object Array]';
  };
}

/**
 * @param attrlist is a list of key-value pairs, of the form key-type.
 * {
 * 	 key:'type',
 * 	 key:'type',
 * 	 key:{
 * 	 	key:'type'
 * 	 	key:'type'
 * 	 },
 * 	 key:[
 * 	 	'type',
 * 	 	{
 * 	 		key:'type',
 * 	 		key:'type',
 * 	 		key:'type',
 * 	 	},
 * 	 ],
 * }
 */
function validate(obj,template){
  //Base case 1: template and obj are both primitives.
  if (typeof(template)=='string'){
	return template==typeof(obj);
  }

  //If the template is not a primitive, then it is either a hash or an array.
  
  //Base case 2: template and obj are not both primitives, but are of different types.
  if (Array.isArray(template) != Array.isArray(obj)){
	return false;
  }

  if (Array.isArray(template)){
	//Case 1: Array
	if (obj.length != template.length){
	  return false;
	}
	for (var i = 0; i < template.length; i++){
	  if (!validate(obj[i],template[i])){
		return false;
	  }
	}
	return true;
  }else{
	//Case 2: Hash
	for (var key in template){
	  if (!validate(obj[key],template[key])){
		return false;
	  }
	}
	return true;
  }
}

exports.validate=validate;
