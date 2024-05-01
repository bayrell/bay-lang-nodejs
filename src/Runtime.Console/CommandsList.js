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
Runtime.Console.CommandsList = function(ctx)
{
	use("Runtime.BaseProvider").apply(this, arguments);
};
Runtime.Console.CommandsList.prototype = Object.create(use("Runtime.BaseProvider").prototype);
Runtime.Console.CommandsList.prototype.constructor = Runtime.Console.CommandsList;
Object.assign(Runtime.Console.CommandsList.prototype,
{
	/**
	 * Start provider
	 */
	start: async function(ctx)
	{
		var __v0 = use("Runtime.Map");
		var commands_list = new __v0(ctx);
		var commands = ctx.getEntities(ctx, "Runtime.Console.Annotations.ConsoleCommand");
		for (var i = 0; i < commands.count(ctx); i++)
		{
			var info = commands.get(ctx, i);
			var command_class_name = info.name;
			if (command_class_name)
			{
				/* Get method getRoutes */
				var __v1 = use("Runtime.Callback");
				var getName = new __v1(ctx, command_class_name, "getName");
				/* Returns command name */
				var name = getName.apply(ctx);
				/* Add to list */
				commands_list.set(ctx, name, command_class_name);
			}
		}
		this.commands_list = commands_list.toDict(ctx);
	},
	/**
	 * Returns command by name
	 */
	getCommandByName: function(ctx, name)
	{
		return this.commands_list.get(ctx, name);
	},
	/**
	 * Returns commands list
	 */
	getCommands: function(ctx)
	{
		return this.commands_list.keys(ctx).sort(ctx);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseProvider").prototype._init.call(this,ctx);
		this.commands_list = use("Runtime.Map").from({});
	},
});
Object.assign(Runtime.Console.CommandsList, use("Runtime.BaseProvider"));
Object.assign(Runtime.Console.CommandsList,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Console";
	},
	getClassName: function()
	{
		return "Runtime.Console.CommandsList";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseProvider";
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
});use.add(Runtime.Console.CommandsList);
module.exports = Runtime.Console.CommandsList;