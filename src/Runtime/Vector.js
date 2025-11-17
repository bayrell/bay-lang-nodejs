"use strict;"
const use = require('bay-lang').use;
/*
!
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

Runtime.Vector = class extends Array
{
	/**
	 * Returns value from position
	 * @param int pos - position
	 */
	get(pos, defaultValue = null)
	{
		return (pos >= 0 && pos < this.length) ? this[pos] : defaultValue;
	}
	
	
	/**
	 * Set value to position
	 * @param int pos - position
	 * @param T value
	 */
	set(pos, value)
	{
		if (pos >= 0 && pos < this.length)
		{
			this[pos] = value;
		}
	}
	
	
	/**
	 * Insert value into array
	 * @param int pos - position
	 * @param T value
	 */
	insert(pos, value)
	{
		this.splice(pos, 0, value);
	}
	
	
	/**
	 * Remove item from array
	 */
	remove(pos)
	{
		this.splice(pos, 1);
	}
	
	
	/**
	 * Flatten Array
	 */
	flatten()
	{
		var res = [];
		for (var i=0; i<this.length; i++)
		{
			if (Array.isArray(this[i]))
				res = res.concat(this[i]);
			else res.push(this[i]);
		}
		return res;
	}
	
	
	/**
	 * Find item
	 */
	find(f)
	{
		var index = this.findIndex(f);
		if (index == -1) return null;
		return this[index];
	}
	
	
	/**
	 * Get first item
	 */
	first(value)
	{
		return (this.length > 0) ? this[0] : (value ? value : null);
	}
	
	
	/**
	 * Get last item
	 */
	last(value)
	{
		return (this.length > 0) ? this[this.length - 1] : (value ? value : null);
	}
	
	
	/**
	 * Each
	 */
	each(f) { super.forEach(f); }
	
	
	/**
	 * Transition
	 */
	transition(f)
	{
		const RuntimeMap = use("Runtime.Map");
		return this.reduce(function(map, value, key){
			if (f) res = f(value, key, this);
			else res = [value, key];
			map.set(res[1], res[0]);
		}, new RuntimeMap());
	}
	
	
	/**
	 * Append items
	 */
	appendItems(arr)
	{
		for (var item of arr) this.push(item);
	}
	
	
	/**
	 * Returns count items in Array
	 */
	count(){ return this.length; }
	
	
	/**
	 * Remove dublicate values
	 */
	removeDuplicates()
	{
		var res = new Runtime.Vector();
		for (var i=0; i<this.length; i++)
		{
			var p = res.indexOf(this[i]);
			if (p == -1)
			{
				res.push(this[i]);
			}
		}
		return res;
	}
	
	static create(arr){ return new Runtime.Vector(...arr); }
	static from(arr){ return new Runtime.Vector(...arr); }
	static getNamespace(){ return "Runtime"; }
	static getClassName(){ return "Runtime.Vector"; }
}
use.add(Runtime.Vector);
module.exports = {
	"Vector": Runtime.Vector,
};