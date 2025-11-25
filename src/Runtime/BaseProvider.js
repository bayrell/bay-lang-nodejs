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
Runtime.BaseProvider = class extends use("Runtime.BaseObject")
{
	/**
	 * Returns true if started
	 */
	isStarted(){ return this.started; }
	
	
	/**
	 * Return param
	 */
	getParam(param_name, def_value)
	{
		if (this.params == null) return def_value;
		if (this.params.has(param_name)) return def_value;
		return this.params.get(param_name);
	}
	
	
	/**
	 * Constructor
	 */
	constructor(params)
	{
		if (params == undefined) params = null;
		super();
		this.params = params != null ? params.toDict() : null;
	}
	
	
	/**
	 * Init provider
	 */
	async init()
	{
	}
	
	
	/**
	 * Start provider
	 */
	async start()
	{
		this.started = true;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.started = false;
		this.params = null;
	}
	static getClassName(){ return "Runtime.BaseProvider"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.BaseProvider);
module.exports = {
	"BaseProvider": Runtime.BaseProvider,
};