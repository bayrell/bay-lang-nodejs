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
Runtime.BaseHook = function(ctx, params)
{
	if (params == undefined) params = null;
	use("Runtime.BaseObject").call(this, ctx);
	/* Setup hook params */
	this.setup(ctx, params);
};
Runtime.BaseHook.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.BaseHook.prototype.constructor = Runtime.BaseHook;
Object.assign(Runtime.BaseHook.prototype,
{
	/**
	 * Setup hook params
	 */
	setup: function(ctx, params)
	{
		if (params == null)
		{
			return ;
		}
	},
	/**
	 * Returns method name by hook name
	 */
	getMethodName: function(ctx, hook_name)
	{
		return "";
	},
	/**
	 * Register hook
	 */
	register: function(ctx, hook_name, method_name, priority)
	{
		if (method_name == undefined) method_name = "";
		if (priority == undefined) priority = 100;
		var __v0 = use("Runtime.rtl");
		if (__v0.isInt(ctx, method_name))
		{
			priority = method_name;
			method_name = "";
		}
		if (method_name == "")
		{
			method_name = this.getMethodName(ctx, hook_name);
		}
		if (method_name == "")
		{
			return ;
		}
		this.hook.register(ctx, hook_name, this, method_name, priority);
	},
	/**
	 * Register hooks
	 */
	register_hooks: function(ctx)
	{
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.hook = null;
	},
});
Object.assign(Runtime.BaseHook, use("Runtime.BaseObject"));
Object.assign(Runtime.BaseHook,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.BaseHook";
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
});use.add(Runtime.BaseHook);
module.exports = Runtime.BaseHook;