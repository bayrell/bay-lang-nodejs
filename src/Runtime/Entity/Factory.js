"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
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
if (typeof Runtime.Entity == 'undefined') Runtime.Entity = {};
Runtime.Entity.Factory = class extends use("Runtime.Entity.Entity")
{
	/**
	 * Create factory
	 */
	constructor(name, value, params)
	{
		const Map = use("Runtime.Map");
		if (value == undefined) value = null;
		if (params == undefined) params = null;
		super(Map.create({
			"name": name,
			"value": value,
			"params": params,
		}));
	}
	
	
	/**
	 * Create new object
	 */
	createInstance(params)
	{
		const BaseObject = use("Runtime.BaseObject");
		const Vector = use("Runtime.Vector");
		if (params == undefined) params = null;
		let instance = null;
		let class_name = this.value;
		let factory_params = this.params;
		if (params)
		{
			if (factory_params) factory_params = factory_params.concat(params);
			else factory_params = params;
		}
		if (class_name == null) class_name = this.name;
		if (class_name instanceof BaseObject)
		{
			instance = class_name;
		}
		else if (rtl.isString(class_name))
		{
			instance = rtl.newInstance(class_name, new Vector(factory_params));
		}
		return instance;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.value = null;
		this.params = null;
	}
	static getClassName(){ return "Runtime.Entity.Factory"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.FactoryInterface"]; }
};
use.add(Runtime.Entity.Factory);
module.exports = {
	"Factory": Runtime.Entity.Factory,
};