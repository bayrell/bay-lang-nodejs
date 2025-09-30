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
Runtime.Console.Commands.Help = function()
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
	getName: function()
	{
		return "help";
	},
	/**
	 * Returns description
	 */
	getDescription: function()
	{
		return "Show help";
	},
	/**
	 * Run task
	 */
	run: async function()
	{
		var __v0 = use("Runtime.io");
		__v0.print("Methods:");
		var commands = use("Runtime.rtl").getContext().provider("Runtime.Console.CommandsList");
		var keys = commands.getCommands();
		for (var i = 0; i < keys.count(); i++)
		{
			var command_name = keys.get(i);
			var class_name = commands.getCommandByName(command_name);
			var __v1 = use("Runtime.Callback");
			var getDescription = new __v1(class_name, "getDescription");
			var command_description = getDescription.apply();
			var __v2 = use("Runtime.io");
			var __v3 = use("Runtime.io");
			__v2.print(__v3.color("yellow", command_name) + use("Runtime.rtl").toStr(" - ") + use("Runtime.rtl").toStr(command_description));
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
});use.add(Runtime.Console.Commands.Help);
module.exports = Runtime.Console.Commands.Help;