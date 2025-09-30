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
if (typeof Runtime.Unit.Commands == 'undefined') Runtime.Unit.Commands = {};
Runtime.Unit.Commands.TestRun = function()
{
	use("Runtime.Console.BaseCommand").apply(this, arguments);
};
Runtime.Unit.Commands.TestRun.prototype = Object.create(use("Runtime.Console.BaseCommand").prototype);
Runtime.Unit.Commands.TestRun.prototype.constructor = Runtime.Unit.Commands.TestRun;
Object.assign(Runtime.Unit.Commands.TestRun.prototype,
{
});
Object.assign(Runtime.Unit.Commands.TestRun, use("Runtime.Console.BaseCommand"));
Object.assign(Runtime.Unit.Commands.TestRun,
{
	/**
	 * Returns name
	 */
	getName: function()
	{
		return "test::run";
	},
	/**
	 * Returns description
	 */
	getDescription: function()
	{
		return "Run test";
	},
	/**
	 * Run task
	 */
	run: async function()
	{
		var test_name = Runtime.rtl.attr(use("Runtime.rtl").getContext().cli_args, 2);
		var error_code = this.SUCCESS;
		if (test_name == null)
		{
			/* List all tests */
			var __v0 = use("Runtime.io");
			__v0.print("List of all tests:");
			var tests = use("Runtime.rtl").getContext().provider("Runtime.Unit.TestProvider");
			for (var i = 0; i < tests.count(); i++)
			{
				var test = tests.get(i);
				var __v1 = use("Runtime.io");
				var __v2 = use("Runtime.io");
				__v1.print(i + 1 + use("Runtime.rtl").toStr(") ") + use("Runtime.rtl").toStr(__v2.color("yellow", test.name)));
			}
		}
		else
		{
			/* Run current test */
			var tests = use("Runtime.rtl").getContext().provider("Runtime.Unit.TestProvider");
			error_code = await tests.runTestByName(test_name);
			if (error_code == 1)
			{
				var __v1 = use("Runtime.io");
				var __v2 = use("Runtime.io");
				__v1.print(__v2.color("green", "OK"));
			}
			else
			{
				var __v3 = use("Runtime.io");
				var __v4 = use("Runtime.io");
				__v3.print(__v4.color("red", "Fail"));
			}
		}
		return Promise.resolve(error_code);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Unit.Commands";
	},
	getClassName: function()
	{
		return "Runtime.Unit.Commands.TestRun";
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
});use.add(Runtime.Unit.Commands.TestRun);
module.exports = Runtime.Unit.Commands.TestRun;