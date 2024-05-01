"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Bayrell == 'undefined') Bayrell = {};
if (typeof Bayrell.Lang == 'undefined') Bayrell.Lang = {};
if (typeof Bayrell.Lang.Compiler == 'undefined') Bayrell.Lang.Compiler = {};
if (typeof Bayrell.Lang.Compiler.Commands == 'undefined') Bayrell.Lang.Compiler.Commands = {};
Bayrell.Lang.Compiler.Commands.Version = function(ctx)
{
	use("Runtime.Console.BaseCommand").apply(this, arguments);
};
Bayrell.Lang.Compiler.Commands.Version.prototype = Object.create(use("Runtime.Console.BaseCommand").prototype);
Bayrell.Lang.Compiler.Commands.Version.prototype.constructor = Bayrell.Lang.Compiler.Commands.Version;
Object.assign(Bayrell.Lang.Compiler.Commands.Version.prototype,
{
});
Object.assign(Bayrell.Lang.Compiler.Commands.Version, use("Runtime.Console.BaseCommand"));
Object.assign(Bayrell.Lang.Compiler.Commands.Version,
{
	/**
	 * Returns name
	 */
	getName: function(ctx)
	{
		return "version";
	},
	/**
	 * Returns description
	 */
	getDescription: function(ctx)
	{
		return "Show version";
	},
	/**
	 * Run task
	 */
	run: async function(ctx)
	{
		var __v0 = use("Runtime.Callback");
		var runtime_version = new __v0(ctx, "Runtime.ModuleDescription", "getModuleVersion");
		var __v1 = use("Runtime.Callback");
		var lang_version = new __v1(ctx, "Bayrell.Lang.ModuleDescription", "getModuleVersion");
		var __v2 = use("Runtime.io");
		__v2.print(ctx, "Lang version: " + use("Runtime.rtl").toStr(lang_version.apply(ctx)));
		var __v3 = use("Runtime.io");
		__v3.print(ctx, "Runtime version: " + use("Runtime.rtl").toStr(runtime_version.apply(ctx)));
		return Promise.resolve(this.SUCCESS);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.Compiler.Commands";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.Compiler.Commands.Version";
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
});use.add(Bayrell.Lang.Compiler.Commands.Version);
module.exports = Bayrell.Lang.Compiler.Commands.Version;