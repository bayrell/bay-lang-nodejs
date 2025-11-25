"use strict;"
const use = require('bay-lang').use;
/*
!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2025 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Runtime.Hooks == 'undefined') Runtime.Hooks = {};
Runtime.Hooks.BaseHook = class extends use("Runtime.BaseObject")
{
	/**
	 * Create hook
	 */
	constructor(params)
	{
		if (params == undefined) params = null;
		super();
		/* Setup hook params */
		this.setup(params);
	}
	
	
	/**
	 * Setup hook params
	 */
	setup(params)
	{
		if (params == null) return;
		this.hook = params.get("hook");
		this.provider = params.get("provider");
	}
	
	
	/**
	 * Register hook
	 */
	register(hook_name, method_name, priority)
	{
		const Method = use("Runtime.Method");
		if (method_name == undefined) method_name = "";
		if (priority == undefined) priority = 100;
		let chain = this.provider.getChain(hook_name);
		if (!chain) return;
		chain.add(new Method(this, method_name), priority);
	}
	
	
	/**
	 * Register hooks
	 */
	register_hooks()
	{
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.hook = null;
		this.provider = null;
	}
	static getClassName(){ return "Runtime.Hooks.BaseHook"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Hooks.BaseHook);
module.exports = {
	"BaseHook": Runtime.Hooks.BaseHook,
};