"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const BaseCommand = use("Runtime.Console.BaseCommand");
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
if (typeof Runtime.Console.Commands == 'undefined') Runtime.Console.Commands = {};
Runtime.Console.Commands.Help = class extends BaseCommand
{
	/**
	 * Returns name
	 */
	static getName(){ return "help"; }
	
	
	/**
	 * Returns description
	 */
	static getDescription(){ return "Show help"; }
	
	
	/**
	 * Run task
	 */
	static async run()
	{
		const Callback = use("Runtime.Callback");
		rtl.print("Methods:");
		var commands = Runtime.rtl.getContext().provider("Runtime.Console.CommandsList");
		var keys = commands.getCommands();
		for (var i = 0; i < keys.count(); i++)
		{
			var command_name = keys.get(i);
			var class_name = commands.getCommandByName(command_name);
			var getDescription = new Callback(class_name, "getDescription");
			var command_description = getDescription.apply();
			rtl.print(rtl.color("yellow", command_name) + String(" - ") + String(command_description));
		}
		return this.SUCCESS;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.Console.Commands.Help"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.Console.Commands.Help);
module.exports = {
	"Help": Runtime.Console.Commands.Help,
};