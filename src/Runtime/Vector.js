"use strict;"
var use = require('bay-lang').use;
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
Runtime.Vector = function()
{
	use("Runtime.Collection").apply(this, arguments);
};
Runtime.Vector.prototype = Object.create(use("Runtime.Collection").prototype);
Runtime.Vector.prototype.constructor = Runtime.Vector;
Object.assign(Runtime.Vector.prototype,
{
	/**
	 * Returns new Vector
	 * @param int offset
	 * @param int lenght
	 * @return Vector<T>
	 */
	removeRange: function(offset, length)
	{
		if (length == undefined) length = null;
		if (offset == undefined) offset = 0;
		if (length == undefined)
		{
			var arr = Array.prototype.slice.call(this, offset);
			Object.setPrototypeOf(arr, this.constructor.prototype);
			return arr;
		}
		if (length >= 0)
		{
			length = offset + length;
		}
		Array.prototype.splice.call(this, offset, length);
		return this;
	},
	/**
	 * Remove item
	 */
	remove: function(pos)
	{
		if (pos == -1)
		{
			return this;
		}
		Array.prototype.splice.call(this, pos, 1);
		return this;
	},
	removeItem: function(item)
	{
		return this.remove(this.indexOf(item));
	},
	/**
	 * Append value to the end of array
	 * @param T value
	 */
	append: function(value)
	{
		Array.prototype.push.call(this, value);
		return this;
	},
	push: function(value)
	{
		return this.append(value);
	},
	/**
	 * Insert first value size_to array
	 * @return T value
	 */
	prepend: function(value)
	{
		Array.prototype.unshift.call(this, value);
		return this;
	},
	/**
	 * Extract last value from array
	 * @return T value
	 */
	pop: function()
	{
		return Array.prototype.pop.call(this);
	},
	/**
	 * Extract first value from array
	 * @return T value
	 */
	shift: function()
	{
		return Array.prototype.shift.call(this);
	},
	/**
	 * Insert value to position
	 * @param int pos - position
	 * @param T value
	 */
	insert: function(pos, value)
	{
		Array.prototype.splice.call(this, pos, 0, value);
		return this;
	},
	/**
	 * Add value to position
	 * @param int pos - position
	 * @param T value
	 * @param string kind - after or before
	 */
	add: function(value, pos, kind)
	{
		if (kind == undefined) kind = "before";
		if (pos == -1)
		{
			if (kind == "before")
			{
				this.prepend(value);
				return 0;
			}
			else
			{
				this.append(value);
				return this.count();
			}
		}
		if (kind == "after")
		{
			pos = pos + 1;
		}
		this.insert(pos, value, kind);
		return pos;
	},
	/**
	 * Add value to position
	 * @param int pos - position
	 * @param T value
	 * @param string kind - after or before
	 */
	addItem: function(value, dest_item, kind)
	{
		if (kind == undefined) kind = "before";
		var pos = this.indexOf(dest_item);
		return this.add(value, pos, kind);
	},
	/**
	 * Set value size_to position
	 * @param int pos - position
	 * @param T value 
	 */
	set: function(pos, value)
	{
		pos = pos % this.count();
		this[pos] = value;
		return this;
	},
	/**
	 * Remove value
	 */
	removeValue: function(value)
	{
		var index = this.indexOf(value);
		if (index != -1)
		{
			this.remove(index, 1);
		}
		return this;
	},
	/**
	 * Find value and remove
	 */
	findAndRemove: function(f)
	{
		var index = this.find(f);
		if (index != -1)
		{
			this.remove(index);
		}
		return this;
	},
	/**
	 * Clear all values from vector
	 */
	clear: function()
	{
		Array.prototype.splice.call(this, 0, this.length);
		return this;
	},
	/**
	 * Append vector to the end of the vector
	 * @param Collection<T> arr
	 */
	appendItems: function(items)
	{
		items.each((item) =>
		{
			this.push(item);
		});
	},
	/**
	 * Prepend vector to the end of the vector
	 * @param Collection<T> arr
	 */
	prependItems: function(items)
	{
		items.each((item) =>
		{
			this.prepend(item);
		});
	},
});
Object.assign(Runtime.Vector, use("Runtime.Collection"));
Object.assign(Runtime.Vector,
{
	/**
	 * Returns new Instance
	 * @return Object
	 */
	Instance: function()
	{
		var __v0 = use("Runtime.Vector");
		return new __v0();
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Vector";
	},
	getParentClassName: function()
	{
		return "Runtime.Collection";
	},
	getClassInfo: function()
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function()
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function()
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		return null;
	},
});use.add(Runtime.Vector);
module.exports = Runtime.Vector;