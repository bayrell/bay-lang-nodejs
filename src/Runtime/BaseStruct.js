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
Runtime.BaseStruct = function(obj)
{
	if (obj == undefined) obj = null;
	use("Runtime.BaseObject").call(this);
	this._assign_values(obj);
	if (this.__uq__ == undefined || this.__uq__ == null) this.__uq__ = Symbol();
		Object.freeze(this);
};
Runtime.BaseStruct.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.BaseStruct.prototype.constructor = Runtime.BaseStruct;
Object.assign(Runtime.BaseStruct.prototype,
{
	/**
	 * Clone this struct with new values
	 * @param Map obj = null
	 * @return BaseStruct
	 */
	clone: function(obj)
	{
		if (obj == undefined) obj = null;
		if (obj == null)
		{
			return this;
		}
		var proto = Object.getPrototypeOf(this);
		var item = Object.create(proto);
		item = Object.assign(item, this);
		
		item._assign_values(obj);
		
		Object.freeze(item);
		
		return item;
		return this;
	},
	/**
	 * Copy this struct with new values
	 * @param Map obj = null
	 * @return BaseStruct
	 */
	copy: function(obj)
	{
		if (obj == undefined) obj = null;
		return this.clone(obj);
	},
	/**
	 * Returns struct as Map
	 * @return Map
	 */
	toMap: function()
	{
		var __v0 = use("Runtime.Map");
		var values = new __v0();
		var __v1 = use("Runtime.rtl");
		var names = __v1.getFields(this.constructor.getClassName());
		for (var i = 0; i < names.count(); i++)
		{
			var variable_name = names.item(i);
			var value = this.get(variable_name, null);
			values.set(variable_name, value);
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
	newInstance: function(items)
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
});use.add(Runtime.BaseStruct);
module.exports = Runtime.BaseStruct;
Runtime.BaseStruct.prototype.get = function(k, v)
{
	if (v == undefined) v = null;
	return this[k] != undefined ? this[k] : v;
};