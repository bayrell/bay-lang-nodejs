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
BayLang.Compiler.ConsoleApp = function(ctx)
{
	use("Runtime.Console.App").apply(this, arguments);
};
BayLang.Compiler.ConsoleApp.prototype = Object.create(use("Runtime.Console.App").prototype);
BayLang.Compiler.ConsoleApp.prototype.constructor = BayLang.Compiler.ConsoleApp;
Object.assign(BayLang.Compiler.ConsoleApp.prototype,
{
	/**
	 * Init
	 */
	init: async function(ctx)
	{
		/*new SettingsProvider();*/
	},
});
Object.assign(BayLang.Compiler.ConsoleApp, use("Runtime.Console.App"));
Object.assign(BayLang.Compiler.ConsoleApp,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Compiler";
	},
	getClassName: function()
	{
		return "BayLang.Compiler.ConsoleApp";
	},
	getParentClassName: function()
	{
		return "Runtime.Console.App";
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
});use.add(BayLang.Compiler.ConsoleApp);
module.exports = BayLang.Compiler.ConsoleApp;