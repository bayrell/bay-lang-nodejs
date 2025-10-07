"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const BaseProvider = use("Runtime.BaseProvider");
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
if (typeof Runtime.Console == 'undefined') Runtime.Console = {};
Runtime.Console.CommandsList = class extends BaseProvider
{
	
	
	/**
	 * Start provider
	 */
	async start()
	{
		const Callback = use("Runtime.Callback");
		this.commands_list = new Map();
		var commands = Runtime.rtl.getContext().getEntities("Runtime.Console.Annotations.ConsoleCommand");
		for (var i = 0; i < commands.count(); i++)
		{
			var info = commands.get(i);
			var command_class_name = info.name;
			if (command_class_name)
			{
				/* Get method getRoutes */
				var getName = new Callback(command_class_name, "getName");
				/* Returns command name */
				var name = getName.apply();
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
		this.commands_list = new Map();
	}
	static getClassName(){ return "Runtime.Console.CommandsList"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.Console.CommandsList);
module.exports = {
	"CommandsList": Runtime.Console.CommandsList,
};