"use strict;"
var use = require('bay-lang').use;
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
if (typeof BayLang == 'undefined') BayLang = {};
if (typeof BayLang.Compiler == 'undefined') BayLang.Compiler = {};
if (typeof BayLang.Compiler.Commands == 'undefined') BayLang.Compiler.Commands = {};
BayLang.Compiler.Commands.Modules = function(ctx)
{
	use("Runtime.Console.BaseCommand").apply(this, arguments);
};
BayLang.Compiler.Commands.Modules.prototype = Object.create(use("Runtime.Console.BaseCommand").prototype);
BayLang.Compiler.Commands.Modules.prototype.constructor = BayLang.Compiler.Commands.Modules;
Object.assign(BayLang.Compiler.Commands.Modules.prototype,
{
});
Object.assign(BayLang.Compiler.Commands.Modules, use("Runtime.Console.BaseCommand"));
Object.assign(BayLang.Compiler.Commands.Modules,
{
	/**
	 * Returns name
	 */
	getName: function(ctx)
	{
		return "modules";
	},
	/**
	 * Returns description
	 */
	getDescription: function(ctx)
	{
		return "Show modules";
	},
	/**
	 * Run task
	 */
	run: async function(ctx)
	{
		this.showModules(ctx, true);
		return Promise.resolve(this.SUCCESS);
	},
	/**
	 * Returns modules
	 */
	getModules: function(ctx)
	{
		var settings = ctx.provider(ctx, "BayLang.Compiler.SettingsProvider");
		return settings.modules;
	},
	/**
	 * Show modules
	 */
	showModules: function(ctx, verbose)
	{
		var modules = this.getModules(ctx);
		var modules_names = modules.keys(ctx).sort(ctx);
		for (var i = 0; i < modules_names.count(ctx); i++)
		{
			var module_name = Runtime.rtl.attr(ctx, modules_names, i);
			var module = Runtime.rtl.attr(ctx, modules, module_name);
			if (verbose)
			{
				var __v0 = use("Runtime.io");
				var __v1 = use("Runtime.io");
				__v0.print(ctx, i + 1 + use("Runtime.rtl").toStr(") ") + use("Runtime.rtl").toStr(__v1.color(ctx, "yellow", module_name)) + use("Runtime.rtl").toStr(" - ") + use("Runtime.rtl").toStr(module.path));
			}
			else
			{
				var __v2 = use("Runtime.io");
				__v2.print(ctx, module_name);
			}
		}
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Compiler.Commands";
	},
	getClassName: function()
	{
		return "BayLang.Compiler.Commands.Modules";
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
});use.add(BayLang.Compiler.Commands.Modules);
module.exports = BayLang.Compiler.Commands.Modules;