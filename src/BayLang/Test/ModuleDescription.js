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
if (typeof BayLang.Test == 'undefined') BayLang.Test = {};
BayLang.Test.ModuleDescription = function()
{
};
Object.assign(BayLang.Test.ModuleDescription.prototype,
{
});
Object.assign(BayLang.Test.ModuleDescription,
{
	/**
	 * Returns module name
	 * @return string
	 */
	getModuleName: function()
	{
		return "BayLang.Test";
	},
	/**
	 * Returns module name
	 * @return string
	 */
	getModuleVersion: function()
	{
		var __v0 = use("BayLang.ModuleDescription");
		return __v0.getModuleVersion();
	},
	/**
	 * Returns required modules
	 * @return Map<string>
	 */
	requiredModules: function()
	{
		return use("Runtime.Map").from({"BayLang":">=0.12"});
	},
	/**
	 * Returns enities
	 */
	entities: function()
	{
		var __v0 = use("Runtime.Unit.UnitTest");
		var __v1 = use("Runtime.Unit.UnitTest");
		var __v2 = use("Runtime.Unit.UnitTest");
		var __v3 = use("Runtime.Unit.UnitTest");
		var __v4 = use("Runtime.Unit.UnitTest");
		var __v5 = use("Runtime.Unit.UnitTest");
		return use("Runtime.Vector").from([new __v0("BayLang.Test.LangBay.Base"),new __v1("BayLang.Test.LangBay.Expression"),new __v2("BayLang.Test.LangBay.Html"),new __v3("BayLang.Test.LangBay.Operator"),new __v4("BayLang.Test.LangBay.Program"),new __v5("BayLang.Test.LangBay.Style")]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Test";
	},
	getClassName: function()
	{
		return "BayLang.Test.ModuleDescription";
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
});use.add(BayLang.Test.ModuleDescription);
module.exports = BayLang.Test.ModuleDescription;