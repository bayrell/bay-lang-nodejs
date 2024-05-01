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
Runtime.Callback = function(ctx, obj, name, tag)
{
	if (tag == undefined) tag = null;
	/* Init object */
	this._init(ctx);
	/* Set variables */
	this.obj = obj;
	this.name = name;
	this.tag = tag;
};
Object.assign(Runtime.Callback.prototype,
{
	/**
	 * Check if method exists
	 */
	exists: function(ctx)
	{
		var __v0 = use("Runtime.rtl");
		if (!__v0.method_exists(ctx, this.obj, this.name))
		{
			return false;
		}
		return true;
	},
	/**
	 * Apply
	 */
	apply: function(ctx, args)
	{
		var __v0 = use("Runtime.rtl");
		return __v0.apply(ctx, this, args);
	},
	_init: function(ctx)
	{
		this.obj = null;
		this.name = null;
		this.tag = null;
	},
});
Object.assign(Runtime.Callback,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Callback";
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
});use.add(Runtime.Callback);
module.exports = Runtime.Callback;