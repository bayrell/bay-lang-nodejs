"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const BaseObject = use("Runtime.BaseObject");
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
Runtime.BaseHook = class extends BaseObject
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
	}
	
	
	/**
	 * Returns method name by hook name
	 */
	getMethodName(hook_name){ return ""; }
	
	
	/**
	 * Register hook
	 */
	register(hook_name, method_name, priority)
	{
		if (method_name == undefined) method_name = "";
		if (priority == undefined) priority = 100;
		if (rtl.isInt(method_name))
		{
			priority = method_name;
			method_name = "";
		}
		if (method_name == "") method_name = this.getMethodName(hook_name);
		if (method_name == "") return;
		this.provider.register(hook_name, this, method_name, priority);
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
	static getClassName(){ return "Runtime.BaseHook"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.BaseHook);
module.exports = {
	"BaseHook": Runtime.BaseHook,
};