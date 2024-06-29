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
Runtime.RawString = function(ctx, s)
{
	this.s = "";
	var __v0 = use("Runtime.rtl");
	if (__v0.isString(ctx, s))
	{
		this.s = s;
	}
};
Object.assign(Runtime.RawString.prototype,
{
	/**
	 * To string
	 */
	toString: function(ctx)
	{
		return this.s;
	},
	_init: function(ctx)
	{
		this.s = null;
	},
});
Object.assign(Runtime.RawString,
{
	/**
	 * Normalize array
	 */
	normalize: function(ctx, item)
	{
		var __v0 = use("Runtime.rtl");
		var __v1 = use("Runtime.RawString");
		var __v2 = use("Runtime.Collection");
		if (__v0.isString(ctx, item))
		{
			return item;
		}
		else if (item instanceof __v1)
		{
			return item.s;
		}
		else if (item instanceof __v2)
		{
			item = item.map(ctx, (ctx, item) =>
			{
				return this.normalize(ctx, item);
			});
			var __v3 = use("Runtime.rs");
			return __v3.join(ctx, "", item);
		}
		return "";
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.RawString";
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
	__implements__:
	[
		use("Runtime.StringInterface"),
	],
});use.add(Runtime.RawString);
module.exports = Runtime.RawString;