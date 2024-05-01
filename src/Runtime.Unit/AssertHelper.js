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
if (typeof Runtime.Unit == 'undefined') Runtime.Unit = {};
Runtime.Unit.AssertHelper = function(ctx)
{
};
Object.assign(Runtime.Unit.AssertHelper.prototype,
{
});
Object.assign(Runtime.Unit.AssertHelper,
{
	/**
	 * Check equals of types
	 */
	equalValueType: function(ctx, value1, value2, message)
	{
		var __v0 = use("Runtime.rtl");
		var type1 = __v0.getType(ctx, value1);
		var __v1 = use("Runtime.rtl");
		var type2 = __v1.getType(ctx, value2);
		var __v2 = use("Runtime.rtl");
		__v2.assert(ctx, type1 == type2, message);
	},
	/**
	 * Check equals of values
	 */
	equalValue: function(ctx, value1, value2, message)
	{
		this.equalValueType(ctx, value1, value2, message);
		var __v0 = use("Runtime.rtl");
		var value_type1 = __v0.getType(ctx, value1);
		var __v1 = use("Runtime.rtl");
		var value_type2 = __v1.getType(ctx, value2);
		var __v2 = use("Runtime.rtl");
		__v2.assert(ctx, value_type1 == value_type2, message);
		var __v3 = use("Runtime.rtl");
		if (__v3.isScalarValue(ctx, value1))
		{
			var __v4 = use("Runtime.rtl");
			__v4.assert(ctx, value1 === value2, message);
			return ;
		}
		if (value_type1 == "collection")
		{
			this.equalCollection(ctx, value1, value2, message);
			return ;
		}
		if (value_type1 == "dict")
		{
			this.equalDict(ctx, value1, value2, message);
			return ;
		}
		var __v3 = use("Runtime.rtl");
		__v3.assert(ctx, false, message);
	},
	/**
	 * Check equals of two collections
	 */
	equalCollection: function(ctx, c1, c2, message)
	{
		if (c1.count(ctx) != c2.count(ctx))
		{
			var __v0 = use("Runtime.rtl");
			__v0.assert(ctx, false, message);
		}
		for (var i = 0; i < c1.count(ctx); i++)
		{
			var value1 = c1.get(ctx, i);
			var value2 = c2.get(ctx, i);
			this.equalValue(ctx, value1, value2, message);
		}
	},
	/**
	 * Check equals of two dicts
	 */
	equalDict: function(ctx, d1, d2, message)
	{
		var d1_keys = d1.keys(ctx);
		var d2_keys = d2.keys(ctx);
		for (var i = 0; i < d1_keys.count(ctx); i++)
		{
			var key1 = d1_keys.get(ctx, i);
			if (!d2.has(ctx, key1))
			{
				var __v0 = use("Runtime.rtl");
				__v0.assert(ctx, false, message);
			}
			var value1 = d1.get(ctx, key1);
			var value2 = d2.get(ctx, key1);
			this.equalValue(ctx, value1, value2, message);
		}
		for (var i = 0; i < d2_keys.count(ctx); i++)
		{
			var key2 = d2_keys.get(ctx, i);
			if (!d1.has(ctx, key2))
			{
				var __v0 = use("Runtime.rtl");
				__v0.assert(ctx, false, message);
			}
		}
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Unit";
	},
	getClassName: function()
	{
		return "Runtime.Unit.AssertHelper";
	},
	getParentClassName: function()
	{
		return "";
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
});use.add(Runtime.Unit.AssertHelper);
module.exports = Runtime.Unit.AssertHelper;