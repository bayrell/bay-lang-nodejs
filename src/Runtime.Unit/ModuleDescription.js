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
if (typeof Runtime.Unit == 'undefined') Runtime.Unit = {};
Runtime.Unit.ModuleDescription = function()
{
};
Object.assign(Runtime.Unit.ModuleDescription.prototype,
{
});
Object.assign(Runtime.Unit.ModuleDescription,
{
	/**
	 * Returns module name
	 * @return string
	 */
	getModuleName: function()
	{
		return "Runtime.Unit";
	},
	/**
	 * Returns module name
	 * @return string
	 */
	getModuleVersion: function()
	{
		return "0.12.0";
	},
	/**
	 * Returns required modules
	 * @return Map<string, string>
	 */
	requiredModules: function()
	{
		return use("Runtime.Map").from({"Runtime":"*","Runtime.Console":"*"});
	},
	/**
	 * Returns enities
	 */
	entities: function()
	{
		var __v0 = use("Runtime.Console.Annotations.ConsoleCommand");
		var __v1 = use("Runtime.Console.Annotations.ConsoleCommand");
		var __v2 = use("Runtime.Entity.Provider");
		var __v3 = use("Runtime.Unit.TestProvider");
		return use("Runtime.Vector").from([new __v0("Runtime.Unit.Commands.TestAll"),new __v1("Runtime.Unit.Commands.TestRun"),new __v2("Runtime.Unit.TestProvider", new __v3())]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Unit";
	},
	getClassName: function()
	{
		return "Runtime.Unit.ModuleDescription";
	},
	getParentClassName: function()
	{
		return "";
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
});use.add(Runtime.Unit.ModuleDescription);
module.exports = Runtime.Unit.ModuleDescription;