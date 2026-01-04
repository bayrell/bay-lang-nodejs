"use strict;"
const use = require('bay-lang').use;
/*!
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
Runtime.Hooks.RuntimeHook = class extends use("Runtime.Hooks.BaseHook")
{
	static INIT = "runtime::init";
	static START = "runtime::start";
	static LAUNCHED = "runtime::launched";
	static RUN = "runtime::run";
	static ENV = "runtime::env";
	static MOUNT = "runtime::mount";
	static ASSETS = "runtime::assets";
	static COMPONENTS = "runtime::components";
	static LAYOUT_HEADER = "runtime::header";
	static LAYOUT_FOOTER = "runtime::footer";
	static LAYOUT_NAME = "runtime::layout_name";
	static CREATE_CONTAINER = "runtime::create_container";
	static CREATE_CONTAINER_DATA = "runtime::create_container_data";
	static CREATE_LAYOUT = "runtime::create_layout";
	static CHANGE_LAYOUT = "runtime::change_layout";
	static SEND_API_BEFORE = "runtime::send_api_before";
	static TITLE = "runtime::title";
	
	
	/**
	 * Register hooks
	 */
	register_hooks()
	{
		const Vector = use("Runtime.Vector");
		super.register_hooks();
		this.provider.setAsync(Vector.create([
			this.constructor.INIT,
			this.constructor.START,
			this.constructor.LAUNCHED,
			this.constructor.RUN,
		]));
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.Hooks.RuntimeHook"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Hooks.RuntimeHook);
module.exports = {
	"RuntimeHook": Runtime.Hooks.RuntimeHook,
};