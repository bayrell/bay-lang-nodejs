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
BayLang.Compiler.Commands.MakeAll = function()
{
	use("Runtime.Console.BaseCommand").apply(this, arguments);
};
BayLang.Compiler.Commands.MakeAll.prototype = Object.create(use("Runtime.Console.BaseCommand").prototype);
BayLang.Compiler.Commands.MakeAll.prototype.constructor = BayLang.Compiler.Commands.MakeAll;
Object.assign(BayLang.Compiler.Commands.MakeAll.prototype,
{
});
Object.assign(BayLang.Compiler.Commands.MakeAll, use("Runtime.Console.BaseCommand"));
Object.assign(BayLang.Compiler.Commands.MakeAll,
{
	/**
	 * Returns name
	 */
	getName: function()
	{
		return "make_all";
	},
	/**
	 * Returns description
	 */
	getDescription: function()
	{
		return "Make all modules";
	},
	/**
	 * Run task
	 */
	run: async function()
	{
		var result = true;
		var lang = Runtime.rtl.attr(use("Runtime.rtl").getContext().cli_args, 2);
		/* Get modules */
		var settings = use("Runtime.rtl").getContext().provider("BayLang.Compiler.SettingsProvider");
		var modules = settings.getModules();
		/* Compile modules */
		var modules_names = modules.keys().sort();
		for (var i = 0; i < modules_names.count(); i++)
		{
			var module_name = Runtime.rtl.attr(modules_names, i);
			var __v0 = use("Runtime.io");
			var __v1 = use("Runtime.io");
			__v0.print(__v1.color("yellow", "Compile " + use("Runtime.rtl").toStr(module_name)));
			result = result & await settings.compileModule(module_name, lang);
		}
		/* Result */
		if (!result)
		{
			return Promise.resolve(this.FAIL);
		}
		return Promise.resolve(this.SUCCESS);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Compiler.Commands";
	},
	getClassName: function()
	{
		return "BayLang.Compiler.Commands.MakeAll";
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
});use.add(BayLang.Compiler.Commands.MakeAll);
module.exports = BayLang.Compiler.Commands.MakeAll;