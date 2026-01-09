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
if (typeof BayLang == 'undefined') BayLang = {};
BayLang.ModuleDescription = class
{
	/**
	 * Returns module name
	 * @return string
	 */
	static getModuleName(){ return "BayLang"; }
	
	
	/**
	 * Returns module name
	 * @return string
	 */
	static getModuleVersion(){ return "1.2"; }
	
	
	/**
	 * Returns required modules
	 * @return Map<string>
	 */
	static requiredModules()
	{
		const Map = use("Runtime.Map");
		return Map.create({
			"Runtime": ">=0.11 <1.0",
		});
	}
	
	
	/**
	 * Returns enities
	 */
	static entities(){ return null; }
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "BayLang.ModuleDescription"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.ModuleDescription);
module.exports = {
	"ModuleDescription": BayLang.ModuleDescription,
};