"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Runtime Library
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
Runtime.BaseStruct = function(ctx, obj)
{
	if (obj == undefined) obj = null;
	use("Runtime.BaseObject").call(this, ctx);
	this._assign_values(ctx, obj);
	if (this.__uq__ == undefined || this.__uq__ == null) this.__uq__ = Symbol();
		Object.freeze(this);
};
Runtime.BaseStruct.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.BaseStruct.prototype.constructor = Runtime.BaseStruct;
Object.assign(Runtime.BaseStruct.prototype,
{
	/**
	 * Init struct data
	 */
	_changes: function(ctx, changes)
	{
	},
	/**
	 * Assign new values
	 */
	_assign_values: function(ctx, changes)
	{
		if (changes == undefined) changes = null;
		if (typeof changes == 'object' && !(changes instanceof Runtime.Dict))
		{
			changes = new Runtime.Map(ctx, changes);
		}
		if (changes == null)
		{
			return ;
		}
		if (changes.keys(ctx).count(ctx) == 0)
		{
			return ;
		}
		var __v0 = use("Runtime.Map");
		if (!(changes instanceof __v0))
		{
			changes = changes.toMap(ctx);
		}
		this._changes(ctx, changes);
		var _Dict = use("Runtime.Dict");
		var rtl = use("Runtime.rtl");
		if (changes instanceof _Dict) changes = changes.toObject();
		for (var key in changes)
		{
			var value = changes[key];
			this[key] = value;
		}
	},
	/**
	 * Clone this struct with new values
	 * @param Map obj = null
	 * @return BaseStruct
	 */
	clone: function(ctx, obj)
	{
		if (obj == undefined) obj = null;
		if (obj == null)
		{
			return this;
		}
		var proto = Object.getPrototypeOf(this);
		var item = Object.create(proto);
		item = Object.assign(item, this);
		
		item._assign_values(ctx, obj);
		
		Object.freeze(item);
		
		return item;
		return this;
	},
	/**
	 * Copy this struct with new values
	 * @param Map obj = null
	 * @return BaseStruct
	 */
	copy: function(ctx, obj)
	{
		if (obj == undefined) obj = null;
		return this.clone(ctx, obj);
	},
	/**
	 * Returns struct as Map
	 * @return Map
	 */
	toMap: function(ctx)
	{
		var __v0 = use("Runtime.Map");
		var values = new __v0(ctx);
		var __v1 = use("Runtime.rtl");
		var names = __v1.getFields(ctx, this.constructor.getClassName(ctx));
		for (var i = 0; i < names.count(ctx); i++)
		{
			var variable_name = names.item(ctx, i);
			var value = this.get(ctx, variable_name, null);
			values.set(ctx, variable_name, value);
		}
		return values;
	},
});
Object.assign(Runtime.BaseStruct, use("Runtime.BaseObject"));
Object.assign(Runtime.BaseStruct,
{
	/**
	 * Returns new instance
	 */
	newInstance: function(ctx, items)
	{
		return new (
			Function.prototype.bind.apply(
				this,
				(typeof ctx != "undefined") ? [null, ctx, items] : [null, items]
			)
		);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.BaseStruct";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
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
});use.add(Runtime.BaseStruct);
module.exports = Runtime.BaseStruct;
Runtime.BaseStruct.prototype.get = function(ctx, k, v)
{
	if (v == undefined) v = null;
	return this[k] != undefined ? this[k] : v;
};