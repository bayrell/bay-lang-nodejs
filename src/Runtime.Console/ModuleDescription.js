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
if (typeof Runtime.Console == 'undefined') Runtime.Console = {};
Runtime.Console.ModuleDescription = class
{
	/**
	 * Returns module name
	 * @return string
	 */
	static getModuleName(){ return "Runtime.Console"; }
	
	
	/**
	 * Returns module name
	 * @return string
	 */
	static getModuleVersion(){ return "0.12.0"; }
	
	
	/**
	 * Returns required modules
	 * @return Map<string, string>
	 */
	static requiredModules()
	{
		const Map = use("Runtime.Map");
		return Map.create({
			"Runtime": "*",
		});
	}
	
	
	/**
	 * Returns enities
	 */
	static entities()
	{
		const Vector = use("Runtime.Vector");
		const ConsoleCommand = use("Runtime.Console.Annotations.ConsoleCommand");
		const Provider = use("Runtime.Entity.Provider");
		const CommandsList = use("Runtime.Console.CommandsList");
		return new Vector(
			new ConsoleCommand("Runtime.Console.Commands.Help"),
			new Provider("Runtime.Console.CommandsList", new CommandsList()),
		);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "Runtime.Console.ModuleDescription"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Console.ModuleDescription);
module.exports = {
	"ModuleDescription": Runtime.Console.ModuleDescription,
};