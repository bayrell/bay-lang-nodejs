"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Runtime Library
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
Runtime.Console.App = function()
{
	use("Runtime.BaseObject").apply(this, arguments);
};
Runtime.Console.App.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Console.App.prototype.constructor = Runtime.Console.App;
Object.assign(Runtime.Console.App.prototype,
{
	/**
	 * Init app
	 */
	init: async function()
	{
	},
	/**
	 * Start app
	 */
	start: async function()
	{
	},
	/**
	 * Returns exit code from command
	 */
	getExitCode: function(command_error)
	{
		if (command_error == 0)
		{
			return 1;
		}
		if (command_error > 0)
		{
			return 0;
		}
		return 0 - command_error;
	},
	/**
	 * Main entry point
	 */
	main: async function()
	{
		var command_error = -1;
		/* Run console command */
		var commands = use("Runtime.rtl").getContext().provider("Runtime.Console.CommandsList");
		var cmd = Runtime.rtl.attr(use("Runtime.rtl").getContext().cli_args, 1);
		if (cmd == null)
		{
			cmd = "help";
		}
		/* Find class name */
		var class_name = commands.getCommandByName(cmd);
		var __v0 = use("Runtime.rtl");
		if (!__v0.class_exists(class_name))
		{
			var __v1 = use("Runtime.io");
			__v1.print_error("Command " + use("Runtime.rtl").toStr(cmd) + use("Runtime.rtl").toStr(" not found"));
			return Promise.resolve(this.getExitCode(-1));
		}
		/* Find command */
		var __v0 = use("Runtime.Callback");
		var command_run = new __v0(class_name, "run");
		if (!command_run.exists())
		{
			var __v1 = use("Runtime.Callback");
			var __v2 = use("Runtime.rtl");
			command_run = new __v1(__v2.newInstance(class_name), "run");
			if (!command_run.exists())
			{
				var __v3 = use("Runtime.io");
				__v3.print_error("Command " + use("Runtime.rtl").toStr(cmd) + use("Runtime.rtl").toStr(" not found"));
				return Promise.resolve(this.getExitCode(-1));
			}
		}
		/* Run command */
		command_error = await command_run.apply();
		return Promise.resolve(this.getExitCode(command_error));
	},
});
Object.assign(Runtime.Console.App, use("Runtime.BaseObject"));
Object.assign(Runtime.Console.App,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Console";
	},
	getClassName: function()
	{
		return "Runtime.Console.App";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
	},
	getClassInfo: function()
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function()
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function()
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		return null;
	},
});use.add(Runtime.Console.App);
module.exports = Runtime.Console.App;