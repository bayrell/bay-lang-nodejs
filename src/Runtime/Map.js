"use strict;"
const use = require('bay-lang').use;
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2024 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
if (typeof Runtime == 'undefined') Runtime = {};

Runtime.Map = Map;

Object.assign(Map, {

/**
 * Create map from Object
 */
create(obj)
{
	return new Map(Object.entries(obj));
},


/**
 * Create map from Object
 */
from(obj)
{
	return new Map(Object.entries(obj));
},

/* Returns namespace */
getNamespace() { return "Runtime"; },

/* Returns class name */
getClassName() { return "Runtime.Map"; },

});

Object.assign(Map.prototype, {


/**
 * Copy map
 */
copy: function()
{
	return new Map(this);
},


/**
 * Call function for each item
 * @param fn f
 */
each: function(f)
{
	for (var key of this.keys())
	{
		var value = this.get(key);
		f(value, key, this);
	}
},


/**
 * Transition
 */
transition: function(f)
{
	var arr = [];
	for (var key of this.keys())
	{
		var value = this.get(key);
		arr.push(f(value, key, this));
	}
	return arr;
},

});
use.add(Runtime.Map);
module.exports = {
	"Map": Runtime.Map,
};