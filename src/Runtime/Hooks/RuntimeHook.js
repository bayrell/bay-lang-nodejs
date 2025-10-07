"use strict;"
const use = require('bay-lang').use;
const BaseHook = use("Runtime.BaseHook");
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
if (typeof Runtime.Hooks == 'undefined') Runtime.Hooks = {};
Runtime.Hooks.RuntimeHook = class extends BaseHook
{
	static INIT = "runtime::init";
	static START = "runtime::start";
	static LAUNCHED = "runtime::launched";
	static RUN = "runtime::run";
	static ENV = "runtime::env";
	
	
	/**
	 * Returns method name by hook name
	 */
	getMethodName(hook_name)
	{
		if (hook_name == this.constructor.INIT) return "init";
		if (hook_name == this.constructor.START) return "start";
		if (hook_name == this.constructor.LAUNCHED) return "launched";
		if (hook_name == this.constructor.RUN) return "run";
		if (hook_name == this.constructor.ENV) return "env";
		return "";
	}
	
	
	/**
	 * Init context
	 */
	async init(d)
	{
		return d;
	}
	
	
	/**
	 * Start context
	 */
	async start(d)
	{
		return d;
	}
	
	
	/**
	 * Launched context
	 */
	async launched(d)
	{
		return d;
	}
	
	
	/**
	 * Run entry point
	 */
	async run(d)
	{
		return d;
	}
	
	
	/**
	 * Init context
	 */
	env(d)
	{
		return d;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.Hooks.RuntimeHook"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.Hooks.RuntimeHook);
module.exports = {
	"RuntimeHook": Runtime.Hooks.RuntimeHook,
};