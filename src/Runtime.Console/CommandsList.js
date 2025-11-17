"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
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
if (typeof Runtime.Console == 'undefined') Runtime.Console = {};
Runtime.Console.CommandsList = class extends use("Runtime.BaseProvider")
{
	/**
	 * Start provider
	 */
	async start()
	{
		const Map = use("Runtime.Map");
		const Method = use("Runtime.Method");
		this.commands_list = new Map();
		let commands = Runtime.rtl.getContext().getEntities("Runtime.Console.Annotations.ConsoleCommand");
		for (let i = 0; i < commands.count(); i++)
		{
			let info = commands.get(i);
			let command_class_name = info.name;
			if (command_class_name)
			{
				/* Get method getRoutes */
				let getName = new Method(command_class_name, "getName");
				/* Returns command name */
				let name = getName.apply();
				/* Add to list */
				this.commands_list.set(name, command_class_name);
			}
		}
	}
	
	
	/**
	 * Returns command by name
	 */
	getCommandByName(name){ return this.commands_list.get(name); }
	
	
	/**
	 * Returns commands list
	 */
	getCommands(){ return rtl.list(this.commands_list.keys()).sort(); }
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Map = use("Runtime.Map");
		this.commands_list = new Map();
	}
	static getClassName(){ return "Runtime.Console.CommandsList"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Console.CommandsList);
module.exports = {
	"CommandsList": Runtime.Console.CommandsList,
};