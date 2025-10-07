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
Runtime.Console.App = class extends BaseProvider
{
	/**
	 * Init app
	 */
	async init()
	{
	}
	
	
	/**
	 * Start app
	 */
	async start()
	{
	}
	
	
	/**
	 * Returns exit code from command
	 */
	getExitCode(command_error)
	{
		if (command_error == 0) return 1;
		if (command_error > 0) return 0;
		return 0 - command_error;
	}
	
	
	/**
	 * Main entry point
	 */
	async main()
	{
		const Callback = use("Runtime.Callback");
		var command_error = -1;
		/* Run console command */
		var commands = Runtime.rtl.getContext().provider("Runtime.Console.CommandsList");
		var cmd = Runtime.rtl.getContext().cli_args[1];
		if (cmd == null) cmd = "help";
		/* Find class name */
		var class_name = commands.getCommandByName(cmd);
		if (!rtl.classExists(class_name))
		{
			rtl.error("Command " + String(cmd) + String(" not found"));
			return this.getExitCode(-1);
		}
		/* Find command */
		var command_run = new Callback(class_name, "run");
		if (!command_run.exists())
		{
			command_run = new Callback(rtl.newInstance(class_name), "run");
			if (!command_run.exists())
			{
				rtl.error("Command " + String(cmd) + String(" not found"));
				return this.getExitCode(-1);
			}
		}
		/* Run command */
		command_error = await command_run.apply();
		return this.getExitCode(command_error);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.Console.App"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.Console.App);
module.exports = {
	"App": Runtime.Console.App,
};