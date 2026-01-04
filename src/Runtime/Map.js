"use strict;"
const use = require('bay-lang').use;
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2025 "Ildar Bikmamatov" <support@bayrell.org>
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

Runtime.Map = class extends Map
{
	/**
	 * Costructor
	 */
	constructor(obj = null)
	{
		super(obj ? Object.entries(obj) : null);
	}
	
	
	/**
	 * Copy map
	 */
	copy()
	{
		return new Runtime.Map(this.toObject());
	}
	
	
	/**
	 * Convert to Object
	 */
	toObject()
	{
		return Object.fromEntries(this);
	}
	
	
	/**
	 * Concat Map
	 */
	concat(map)
	{
		var obj = this.toObject();
		return new Runtime.Map(Object.assign(obj, map.toObject()));
	}
	
	
	/**
	 * Returns value
	 */
	get(key, default_value)
	{
		if (default_value == undefined) default_value = null;
		var value = super.get(key);
		return value != undefined ? value : default_value;
	}
	
	
	/**
	 * Call function map
	 */
	map(f)
	{
		var map = new Runtime.Map();
		for (var key of this.keys())
		{
			map.set(key, f(this.get(key), key, this));
		}
		return map;
	}
	
	
	/**
	 * Call function map
	 */
	mapWithKeys(f)
	{
		var map = new Runtime.Map();
		for (var key of this.keys())
		{
			var item = f(this.get(key), key, this);
			map.set(item[1], item[0]);
		}
		return map;
	}
	
	
	/**
	 * Reduce
	 */
	reduce(f, result)
	{
		for (var key of this.keys())
		{
			result = f(result, this.get(key), key, this);
		}
		return result;
	}
	
	
	/**
	 * Filter
	 */
	filter(f)
	{
		var map = new Runtime.Map();
		for (var key of this.keys())
		{
			var value = this.get(key);
			var flag = f(value, key, this);
			if (flag) map.set(key, value);
		}
		return map;
	}
	
	
	/**
	 * Call function for each item
	 * @param fn f
	 */
	each(f)
	{
		for (var key of this.keys())
		{
			var value = this.get(key);
			f(value, key, this);
		}
	}
	
	
	/**
	 * Transition
	 */
	transition(f)
	{
		const Vector = use("Runtime.Vector");
		var arr = new Vector();
		for (var key of this.keys())
		{
			var value = this.get(key);
			arr.push(f(value, key, this));
		}
		return arr;
	}
	
	
	/**
	 * Intersect
	 */
	intersect(fields)
	{
		const h = fields.transition((value, key) => [key, value]);
		return this.filter((value, key) => h.has(key));
	}
	
	
	/**
	 * Create map from Object
	 */
	static create(obj)
	{
		return new Runtime.Map(obj);
	}
	
	
	/**
	 * Create map from Object
	 */
	static from(obj)
	{
		return new Runtime.Map(obj);
	}
	
	
	/* Returns namespace */
	static getNamespace() { return "Runtime"; }
	
	/* Returns class name */
	static getClassName() { return "Runtime.Map"; }
};
use.add(Runtime.Map);
module.exports = {
	"Map": Runtime.Map,
};