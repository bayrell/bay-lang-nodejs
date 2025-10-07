"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const Entity = use("Runtime.Entity.Entity");
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
if (typeof Runtime.Entity == 'undefined') Runtime.Entity = {};
Runtime.Entity.Provider = class extends Entity
{
	/* Provider class name */
	
	/* Factory params */
	
	
	/**
	 * Constructor
	 */
	constructor(name, value, params)
	{
		if (value == undefined) value = null;
		if (params == undefined) params = null;
		super(Map.create({
			"name": name,
			"value": value,
			"params": params,
		}));
	}
	
	
	/**
	 * Create provider
	 */
	createInstance()
	{
		const BaseProvider = use("Runtime.BaseProvider");
		var provider = null;
		var class_name = this.value;
		if (class_name == null) class_name = this.name;
		if (class_name instanceof BaseProvider)
		{
			provider = class_name;
		}
		else if (rtl.isString(class_name))
		{
			provider = rtl.newInstance(class_name, [this.params]);
		}
		return provider;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.value = null;
		this.params = null;
	}
	static getClassName(){ return "Runtime.Entity.Provider"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return ["Runtime.FactoryInterface"]; }
};
use.add(Runtime.Entity.Provider);
module.exports = {
	"Provider": Runtime.Entity.Provider,
};