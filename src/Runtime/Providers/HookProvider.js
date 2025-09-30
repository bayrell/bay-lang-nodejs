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
if (typeof Runtime.Providers == 'undefined') Runtime.Providers = {};
Runtime.Providers.HookProvider = function()
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
	init: async function()
	{
		var hooks = use("Runtime.rtl").getContext().getEntities("Runtime.Entity.Hook");
		var __v0 = use("Runtime.Vector");
		this.base_hooks = new __v0();
		for (var i = 0; i < hooks.count(); i++)
		{
			var hook = Runtime.rtl.attr(hooks, i);
			var base_hook = hook.createHook();
			base_hook.hook = hook;
			base_hook.provider = this;
			base_hook.register_hooks();
			this.base_hooks.push(base_hook);
		}
	},
	/**
	 * Start provider
	 */
	start: async function()
	{
		await use("Runtime.BaseProvider").prototype.start.bind(this)();
	},
	/**
	 * Register hook
	 */
	register: function(hook_name, obj, method_name, priority)
	{
		if (priority == undefined) priority = 0;
		if (!this.hooks.has(hook_name))
		{
			var __v0 = use("Runtime.Map");
			this.hooks.set(hook_name, new __v0());
		}
		var priorities = Runtime.rtl.attr(this.hooks, hook_name);
		if (!priorities.has(priority))
		{
			var __v0 = use("Runtime.Vector");
			priorities.set(priority, new __v0());
		}
		var methods_list = priorities.get(priority);
		var __v0 = use("Runtime.Callback");
		methods_list.push(new __v0(obj, method_name));
	},
	/**
	 * Remove hook
	 */
	remove: function(hook_name, obj, method_name, priority)
	{
		if (priority == undefined) priority = 100;
		if (!this.hooks.has(hook_name))
		{
			var __v0 = use("Runtime.Map");
			this.hooks.setValue(hook_name, new __v0());
		}
		var priorities = Runtime.rtl.attr(this.hooks, hook_name);
		if (!priorities.has(priority))
		{
			var __v0 = use("Runtime.Vector");
			priorities.setValue(priority, new __v0());
		}
		var methods_list = priorities.get(priority);
		var index = methods_list.find((info) =>
		{
			return info.obj == obj && info.name == method_name;
		});
		if (index > -1)
		{
			methods_list.removePosition(index);
		}
	},
	/**
	 * Returns method list
	 */
	getMethods: function(hook_name)
	{
		if (!this.hooks.has(hook_name))
		{
			return use("Runtime.Vector").from([]);
		}
		var __v0 = use("Runtime.Vector");
		var res = new __v0();
		var priorities = Runtime.rtl.attr(this.hooks, hook_name);
		var priorities_keys = priorities.keys().sort();
		for (var i = 0; i < priorities_keys.count(); i++)
		{
			var priority = Runtime.rtl.attr(priorities_keys, i);
			var methods_list = priorities.get(priority);
			res.appendItems(methods_list);
		}
		return res.toCollection();
	},
	_init: function()
	{
		use("Runtime.BaseProvider").prototype._init.call(this);
		var __v0 = use("Runtime.Map");
		this.base_hooks = use("Runtime.Vector").from([]);
		this.hooks = new __v0();
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
});use.add(Runtime.Providers.HookProvider);
module.exports = Runtime.Providers.HookProvider;