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
Runtime.Vector = function(ctx)
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
	removeRange: function(ctx, offset, length)
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
	remove: function(ctx, pos)
	{
		if (pos == -1)
		{
			return this;
		}
		Array.prototype.splice.call(this, pos, 1);
		return this;
	},
	removeItem: function(ctx, item)
	{
		return this.remove(ctx, this.indexOf(ctx, item));
	},
	/**
	 * Append value to the end of array
	 * @param T value
	 */
	append: function(ctx, value)
	{
		Array.prototype.push.call(this, value);
		return this;
	},
	push: function(ctx, value)
	{
		return this.append(ctx, value);
	},
	/**
	 * Insert first value size_to array
	 * @return T value
	 */
	prepend: function(ctx, value)
	{
		Array.prototype.unshift.call(this, value);
		return this;
	},
	/**
	 * Extract last value from array
	 * @return T value
	 */
	pop: function(ctx)
	{
		return Array.prototype.pop.call(this);
	},
	/**
	 * Extract first value from array
	 * @return T value
	 */
	shift: function(ctx)
	{
		return Array.prototype.shift.call(this);
	},
	/**
	 * Insert value to position
	 * @param int pos - position
	 * @param T value
	 */
	insert: function(ctx, pos, value)
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
	add: function(ctx, value, pos, kind)
	{
		if (kind == undefined) kind = "before";
		if (pos == -1)
		{
			if (kind == "before")
			{
				this.prepend(ctx, value);
				return 0;
			}
			else
			{
				this.append(ctx, value);
				return this.count(ctx);
			}
		}
		if (kind == "after")
		{
			pos = pos + 1;
		}
		this.insert(ctx, pos, value, kind);
		return pos;
	},
	/**
	 * Add value to position
	 * @param int pos - position
	 * @param T value
	 * @param string kind - after or before
	 */
	addItem: function(ctx, value, dest_item, kind)
	{
		if (kind == undefined) kind = "before";
		var pos = this.indexOf(ctx, dest_item);
		return this.add(ctx, value, pos, kind);
	},
	/**
	 * Set value size_to position
	 * @param int pos - position
	 * @param T value 
	 */
	set: function(ctx, pos, value)
	{
		pos = pos % this.count(ctx);
		this[pos] = value;
		return this;
	},
	/**
	 * Remove value
	 */
	removeValue: function(ctx, value)
	{
		var index = this.indexOf(ctx, value);
		if (index != -1)
		{
			this.remove(ctx, index, 1);
		}
		return this;
	},
	/**
	 * Find value and remove
	 */
	findAndRemove: function(ctx, f)
	{
		var index = this.find(ctx, f);
		if (index != -1)
		{
			this.remove(ctx, index);
		}
		return this;
	},
	/**
	 * Clear all values from vector
	 */
	clear: function(ctx)
	{
		Array.prototype.splice.call(this, 0, this.length);
		return this;
	},
	/**
	 * Append vector to the end of the vector
	 * @param Collection<T> arr
	 */
	appendItems: function(ctx, items)
	{
		items.each(ctx, (ctx, item) =>
		{
			this.push(ctx, item);
		});
	},
	/**
	 * Prepend vector to the end of the vector
	 * @param Collection<T> arr
	 */
	prependItems: function(ctx, items)
	{
		items.each(ctx, (ctx, item) =>
		{
			this.prepend(ctx, item);
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
	Instance: function(ctx)
	{
		var __v0 = use("Runtime.Vector");
		return new __v0(ctx);
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
	getClassInfo: function(ctx)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function(ctx)
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Runtime.Vector);
module.exports = Runtime.Vector;