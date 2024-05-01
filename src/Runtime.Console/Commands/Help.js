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
if (typeof Runtime.Console.Commands == 'undefined') Runtime.Console.Commands = {};
Runtime.Console.Commands.Help = function(ctx)
{
	use("Runtime.Console.BaseCommand").apply(this, arguments);
};
Runtime.Console.Commands.Help.prototype = Object.create(use("Runtime.Console.BaseCommand").prototype);
Runtime.Console.Commands.Help.prototype.constructor = Runtime.Console.Commands.Help;
Object.assign(Runtime.Console.Commands.Help.prototype,
{
});
Object.assign(Runtime.Console.Commands.Help, use("Runtime.Console.BaseCommand"));
Object.assign(Runtime.Console.Commands.Help,
{
	/**
	 * Returns name
	 */
	getName: function(ctx)
	{
		return "help";
	},
	/**
	 * Returns description
	 */
	getDescription: function(ctx)
	{
		return "Show help";
	},
	/**
	 * Run task
	 */
	run: async function(ctx)
	{
		var __v0 = use("Runtime.io");
		__v0.print(ctx, "Methods:");
		var commands = ctx.provider(ctx, "Runtime.Console.CommandsList");
		var keys = commands.getCommands(ctx);
		for (var i = 0; i < keys.count(ctx); i++)
		{
			var command_name = keys.get(ctx, i);
			var class_name = commands.getCommandByName(ctx, command_name);
			var __v1 = use("Runtime.Callback");
			var getDescription = new __v1(ctx, class_name, "getDescription");
			var command_description = getDescription.apply(ctx);
			var __v2 = use("Runtime.io");
			var __v3 = use("Runtime.io");
			__v2.print(ctx, __v3.color(ctx, "yellow", command_name) + use("Runtime.rtl").toStr(" - ") + use("Runtime.rtl").toStr(command_description));
		}
		return Promise.resolve(this.SUCCESS);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Console.Commands";
	},
	getClassName: function()
	{
		return "Runtime.Console.Commands.Help";
	},
	getParentClassName: function()
	{
		return "Runtime.Console.BaseCommand";
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
});use.add(Runtime.Console.Commands.Help);
module.exports = Runtime.Console.Commands.Help;