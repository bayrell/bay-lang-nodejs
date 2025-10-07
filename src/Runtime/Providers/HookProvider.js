"use strict;"
const use = require('bay-lang').use;
const BaseProvider = use("Runtime.BaseProvider");
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
Runtime.Providers.HookProvider = class extends BaseProvider
{
	
	
	/**
	 * Init provider
	 */
	async init()
	{
		const Vector = use("Runtime.Vector");
		var hooks = Runtime.rtl.getContext().getEntities("Runtime.Entity.Hook");
		this.base_hooks = new Vector();
		for (var i = 0; i < hooks.count(); i++)
		{
			var hook = hooks[i];
			var base_hook = hook.createHook();
			base_hook.hook = hook;
			base_hook.provider = this;
			base_hook.register_hooks();
			this.base_hooks.push(base_hook);
		}
	}
	
	
	/**
	 * Start provider
	 */
	async start()
	{
		await super.start();
	}
	
	
	/**
	 * Register hook
	 */
	register(hook_name, obj, method_name, priority)
	{
		const Vector = use("Runtime.Vector");
		const Callback = use("Runtime.Callback");
		if (priority == undefined) priority = 100;
		if (!this.hooks.has(hook_name)) this.hooks.set(hook_name, new Map());
		var priorities = this.hooks[hook_name];
		if (!priorities.has(priority)) priorities.set(priority, new Vector());
		var methods_list = priorities.get(priority);
		methods_list.push(new Callback(obj, method_name));
	}
	
	
	/**
	 * Remove hook
	 */
	remove(hook_name, obj, method_name, priority)
	{
		const Vector = use("Runtime.Vector");
		if (priority == undefined) priority = 100;
		if (!this.hooks.has(hook_name)) this.hooks.setValue(hook_name, new Map());
		var priorities = this.hooks[hook_name];
		if (!priorities.has(priority)) priorities.setValue(priority, new Vector());
		var methods_list = priorities.get(priority);
		var index = methods_list.find((info) =>
		{
			return info.obj == obj && info.name == method_name;
		});
		if (index > -1)
		{
			methods_list.removePosition(index);
		}
	}
	
	
	/**
	 * Returns method list
	 */
	getMethods(hook_name)
	{
		const Vector = use("Runtime.Vector");
		const lib = use("Runtime.lib");
		if (!this.hooks.has(hook_name)) return [];
		var res = new Vector();
		var priorities = this.hooks[hook_name];
		var priorities_keys = priorities.keys().sort(lib.compareInt());
		for (var i = 0; i < priorities_keys.count(); i++)
		{
			var priority = priorities_keys[i];
			var methods_list = priorities.get(priority);
			res.appendItems(methods_list);
		}
		return res.toCollection();
	}
	
	
	/**
	 * Apply hook
	 */
	apply(hook_name, params)
	{
		if (params == undefined) params = null;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.base_hooks = [];
		this.hooks = new Map();
	}
	static getClassName(){ return "Runtime.Providers.HookProvider"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.Providers.HookProvider);
module.exports = {
	"HookProvider": Runtime.Providers.HookProvider,
};