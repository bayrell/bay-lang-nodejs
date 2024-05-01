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
if (typeof Runtime.Providers == 'undefined') Runtime.Providers = {};
Runtime.Providers.HookProvider = function(ctx)
{
	use("Runtime.BaseProvider").apply(this, arguments);
};
Runtime.Providers.HookProvider.prototype = Object.create(use("Runtime.BaseProvider").prototype);
Runtime.Providers.HookProvider.prototype.constructor = Runtime.Providers.HookProvider;
Object.assign(Runtime.Providers.HookProvider.prototype,
{
	/**
	 * Init provider
	 */
	init: async function(ctx)
	{
		var hooks = ctx.getEntities(ctx, "Runtime.Entity.Hook");
		var __v0 = use("Runtime.Vector");
		this.base_hooks = new __v0(ctx);
		for (var i = 0; i < hooks.count(ctx); i++)
		{
			var hook = Runtime.rtl.attr(ctx, hooks, i);
			var __v1 = use("Runtime.rtl");
			var base_hook = __v1.newInstance(ctx, hook.name, use("Runtime.Vector").from([hook.params]));
			base_hook.hook = this;
			base_hook.register_hooks(ctx);
			this.base_hooks.push(ctx, base_hook);
		}
	},
	/**
	 * Start provider
	 */
	start: async function(ctx)
	{
		await use("Runtime.BaseProvider").prototype.start.bind(this)(ctx);
	},
	/**
	 * Register hook
	 */
	register: function(ctx, hook_name, obj, method_name, priority)
	{
		if (priority == undefined) priority = 0;
		if (!this.hooks.has(ctx, hook_name))
		{
			var __v0 = use("Runtime.Map");
			this.hooks.set(ctx, hook_name, new __v0(ctx));
		}
		var priorities = Runtime.rtl.attr(ctx, this.hooks, hook_name);
		if (!priorities.has(ctx, priority))
		{
			var __v0 = use("Runtime.Vector");
			priorities.set(ctx, priority, new __v0(ctx));
		}
		var methods_list = priorities.get(ctx, priority);
		var __v0 = use("Runtime.Callback");
		methods_list.push(ctx, new __v0(ctx, obj, method_name));
	},
	/**
	 * Remove hook
	 */
	remove: function(ctx, hook_name, obj, method_name, priority)
	{
		if (priority == undefined) priority = 100;
		if (!this.hooks.has(ctx, hook_name))
		{
			var __v0 = use("Runtime.Map");
			this.hooks.setValue(ctx, hook_name, new __v0(ctx));
		}
		var priorities = Runtime.rtl.attr(ctx, this.hooks, hook_name);
		if (!priorities.has(ctx, priority))
		{
			var __v0 = use("Runtime.Vector");
			priorities.setValue(ctx, priority, new __v0(ctx));
		}
		var methods_list = priorities.get(ctx, priority);
		var index = methods_list.find(ctx, (ctx, info) => 
		{
			return info.obj == obj && info.name == method_name;
		});
		if (index > -1)
		{
			methods_list.removePosition(ctx, index);
		}
	},
	/**
	 * Returns method list
	 */
	getMethods: function(ctx, hook_name)
	{
		if (!this.hooks.has(ctx, hook_name))
		{
			return use("Runtime.Vector").from([]);
		}
		var __v0 = use("Runtime.Vector");
		var res = new __v0(ctx);
		var priorities = Runtime.rtl.attr(ctx, this.hooks, hook_name);
		var priorities_keys = priorities.keys(ctx).sort(ctx);
		for (var i = 0; i < priorities_keys.count(ctx); i++)
		{
			var priority = Runtime.rtl.attr(ctx, priorities_keys, i);
			var methods_list = priorities.get(ctx, priority);
			res.appendItems(ctx, methods_list);
		}
		return res.toCollection(ctx);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseProvider").prototype._init.call(this,ctx);
		var __v0 = use("Runtime.Map");
		this.base_hooks = use("Runtime.Vector").from([]);
		this.hooks = new __v0(ctx);
	},
});
Object.assign(Runtime.Providers.HookProvider, use("Runtime.BaseProvider"));
Object.assign(Runtime.Providers.HookProvider,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Providers";
	},
	getClassName: function()
	{
		return "Runtime.Providers.HookProvider";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseProvider";
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
});use.add(Runtime.Providers.HookProvider);
module.exports = Runtime.Providers.HookProvider;