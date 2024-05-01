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
Runtime.Console.App = function(ctx)
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
	init: async function(ctx)
	{
	},
	/**
	 * Start app
	 */
	start: async function(ctx)
	{
	},
	/**
	 * Returns exit code from command
	 */
	getExitCode: function(ctx, command_error)
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
	main: async function(ctx)
	{
		var command_error = -1;
		/* Run console command */
		var commands = ctx.provider(ctx, "Runtime.Console.CommandsList");
		var cmd = Runtime.rtl.attr(ctx, ctx.cli_args, 1);
		if (cmd == null)
		{
			cmd = "help";
		}
		/* Find class name */
		var class_name = commands.getCommandByName(ctx, cmd);
		var __v0 = use("Runtime.rtl");
		if (!__v0.class_exists(ctx, class_name))
		{
			var __v1 = use("Runtime.io");
			__v1.print_error(ctx, "Command " + use("Runtime.rtl").toStr(cmd) + use("Runtime.rtl").toStr(" not found"));
			return Promise.resolve(this.getExitCode(ctx, -1));
		}
		/* Find command */
		var __v0 = use("Runtime.Callback");
		var command_run = new __v0(ctx, class_name, "run");
		if (!command_run.exists(ctx))
		{
			var __v1 = use("Runtime.Callback");
			var __v2 = use("Runtime.rtl");
			command_run = new __v1(ctx, __v2.newInstance(ctx, class_name), "run");
			if (!command_run.exists(ctx))
			{
				var __v3 = use("Runtime.io");
				__v3.print_error(ctx, "Command " + use("Runtime.rtl").toStr(cmd) + use("Runtime.rtl").toStr(" not found"));
				return Promise.resolve(this.getExitCode(ctx, -1));
			}
		}
		/* Run command */
		command_error = await command_run.apply(ctx);
		return Promise.resolve(this.getExitCode(ctx, command_error));
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
	getClassInfo: function(ctx)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function(ctx)
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Runtime.Console.App);
module.exports = Runtime.Console.App;