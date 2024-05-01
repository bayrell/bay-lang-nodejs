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
Bayrell.Lang.Compiler.ConsoleApp = function(ctx)
{
	use("Runtime.Console.App").apply(this, arguments);
};
Bayrell.Lang.Compiler.ConsoleApp.prototype = Object.create(use("Runtime.Console.App").prototype);
Bayrell.Lang.Compiler.ConsoleApp.prototype.constructor = Bayrell.Lang.Compiler.ConsoleApp;
Object.assign(Bayrell.Lang.Compiler.ConsoleApp.prototype,
{
	/**
	 * Init
	 */
	init: async function(ctx)
	{
		/*new SettingsProvider();*/
	},
});
Object.assign(Bayrell.Lang.Compiler.ConsoleApp, use("Runtime.Console.App"));
Object.assign(Bayrell.Lang.Compiler.ConsoleApp,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.Compiler";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.Compiler.ConsoleApp";
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
});use.add(Bayrell.Lang.Compiler.ConsoleApp);
module.exports = Bayrell.Lang.Compiler.ConsoleApp;