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
BayLang.Compiler.Commands.Version = function()
{
	use("Runtime.Console.BaseCommand").apply(this, arguments);
};
BayLang.Compiler.Commands.Version.prototype = Object.create(use("Runtime.Console.BaseCommand").prototype);
BayLang.Compiler.Commands.Version.prototype.constructor = BayLang.Compiler.Commands.Version;
Object.assign(BayLang.Compiler.Commands.Version.prototype,
{
});
Object.assign(BayLang.Compiler.Commands.Version, use("Runtime.Console.BaseCommand"));
Object.assign(BayLang.Compiler.Commands.Version,
{
	/**
	 * Returns name
	 */
	getName: function()
	{
		return "version";
	},
	/**
	 * Returns description
	 */
	getDescription: function()
	{
		return "Show version";
	},
	/**
	 * Run task
	 */
	run: async function()
	{
		var __v0 = use("Runtime.Callback");
		var runtime_version = new __v0("Runtime.ModuleDescription", "getModuleVersion");
		var __v1 = use("Runtime.Callback");
		var lang_version = new __v1("BayLang.ModuleDescription", "getModuleVersion");
		var __v2 = use("Runtime.io");
		__v2.print("Lang version: " + use("Runtime.rtl").toStr(lang_version.apply()));
		var __v3 = use("Runtime.io");
		__v3.print("Runtime version: " + use("Runtime.rtl").toStr(runtime_version.apply()));
		return Promise.resolve(this.SUCCESS);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Compiler.Commands";
	},
	getClassName: function()
	{
		return "BayLang.Compiler.Commands.Version";
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
});use.add(BayLang.Compiler.Commands.Version);
module.exports = BayLang.Compiler.Commands.Version;