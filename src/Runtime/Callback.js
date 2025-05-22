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
	 * Check callback
	 */
	check: function(ctx)
	{
		if (!this.exists(ctx))
		{
			var __v0 = use("Runtime.Exceptions.RuntimeException");
			var __v1 = use("Runtime.rtl");
			throw new __v0(ctx, "Method '" + use("Runtime.rtl").toStr(this.name) + use("Runtime.rtl").toStr("' not found in ") + use("Runtime.rtl").toStr(__v1.get_class_name(ctx, this.obj)))
		}
	},
	/**
	 * Apply
	 */
	apply: function(ctx, args)
	{
		if (args == undefined) args = null;
		this.check(ctx);
		if (args == null) args = [];
		else args = Array.prototype.slice.call(args);
		if (typeof ctx != "undefined") args.unshift(ctx);
		
		var obj = this.obj;
		if (typeof obj == "string") obj = Runtime.rtl.find_class(obj);
		return obj[this.name].bind(obj).apply(null, args);
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