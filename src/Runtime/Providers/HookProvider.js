"use strict;"
const use = require('bay-lang').use;
/*
!
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
Runtime.Providers.HookProvider = class extends use("Runtime.BaseProvider")
{
	/**
	 * Init provider
	 */
	async init()
	{
		const Vector = use("Runtime.Vector");
		const Map = use("Runtime.Map");
		let hooks = Runtime.rtl.getContext().getEntities("Runtime.Entity.Hook");
		this.base_hooks = new Vector();
		for (let i = 0; i < hooks.count(); i++)
		{
			let hook = hooks[i];
			let base_hook = hook.createInstance(Map.create({
				"hook": hook,
				"provider": this,
			}));
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
	 * Set async
	 */
	setAsync(arr)
	{
		for (let i = 0; i < arr.count(); i++)
		{
			let hook_name = arr.get(i);
			this.async_hooks.set(hook_name, true);
		}
	}
	
	
	/**
	 * Returns if chain is async
	 */
	isAsync(name)
	{
		if (!this.async_hooks.has(name)) return false;
		return this.async_hooks.get(name);
	}
	
	
	/**
	 * Create chain
	 */
	createChain(name, is_async)
	{
		const ChainAsync = use("Runtime.ChainAsync");
		const Chain = use("Runtime.Chain");
		if (this.chains.has(name)) return;
		if (is_async) this.chains.set(name, new ChainAsync());
		else this.chains.set(name, new Chain());
	}
	
	
	/**
	 * Returns chain
	 */
	getChain(name)
	{
		if (!this.chains.has(name)) this.createChain(name, this.isAsync(name));
		return this.chains.get(name);
	}
	
	
	/**
	 * Apply hook
	 */
	apply(hook_name, params)
	{
		const ChainAsync = use("Runtime.ChainAsync");
		const Vector = use("Runtime.Vector");
		if (params == undefined) params = null;
		let chain = this.chains.get(hook_name);
		if (!chain) return params;
		if (chain instanceof ChainAsync)
		{
			let f = async () =>
			{
				const Vector = use("Runtime.Vector");
				await chain.apply(new Vector(params));
				return params;
			};
			return f();
		}
		chain.apply(new Vector(params));
		return params;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Vector = use("Runtime.Vector");
		const Map = use("Runtime.Map");
		this.base_hooks = new Vector();
		this.chains = new Map();
		this.async_hooks = new Map();
	}
	static getClassName(){ return "Runtime.Providers.HookProvider"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Providers.HookProvider);
module.exports = {
	"HookProvider": Runtime.Providers.HookProvider,
};