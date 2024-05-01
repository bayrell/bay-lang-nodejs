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
Bayrell.Lang.Compiler.ModuleDescription = function(ctx)
{
};
Object.assign(Bayrell.Lang.Compiler.ModuleDescription.prototype,
{
});
Object.assign(Bayrell.Lang.Compiler.ModuleDescription,
{
	/**
	 * Returns module name
	 * @return string
	 */
	getModuleName: function(ctx)
	{
		return "Bayrell.Lang.Compiler";
	},
	/**
	 * Returns module name
	 * @return string
	 */
	getModuleVersion: function(ctx)
	{
		var __v0 = use("Bayrell.Lang.ModuleDescription");
		return __v0.getModuleVersion(ctx);
	},
	/**
	 * Returns required modules
	 * @return Map<string>
	 */
	requiredModules: function(ctx)
	{
		return use("Runtime.Map").from({"Bayrell.Lang":">=0.12 <1.0","Runtime.Console":">=0.12 <1.0"});
	},
	/**
	 * Returns enities
	 */
	entities: function(ctx)
	{
		var __v0 = use("Runtime.Console.Annotations.ConsoleCommand");
		var __v1 = use("Runtime.Console.Annotations.ConsoleCommand");
		var __v2 = use("Runtime.Console.Annotations.ConsoleCommand");
		var __v3 = use("Runtime.Console.Annotations.ConsoleCommand");
		var __v4 = use("Runtime.Console.Annotations.ConsoleCommand");
		var __v5 = use("Runtime.Entity.Provider");
		return use("Runtime.Vector").from([new __v0(ctx, "Bayrell.Lang.Compiler.Commands.Make"),new __v1(ctx, "Bayrell.Lang.Compiler.Commands.MakeAll"),new __v2(ctx, "Bayrell.Lang.Compiler.Commands.Modules"),new __v3(ctx, "Bayrell.Lang.Compiler.Commands.Version"),new __v4(ctx, "Bayrell.Lang.Compiler.Commands.Watch"),new __v5(ctx, "Bayrell.Lang.Compiler.SettingsProvider")]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.Compiler";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.Compiler.ModuleDescription";
	},
	getParentClassName: function()
	{
		return "";
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
});use.add(Bayrell.Lang.Compiler.ModuleDescription);
module.exports = Bayrell.Lang.Compiler.ModuleDescription;