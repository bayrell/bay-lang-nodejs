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
if (typeof Runtime.Console == 'undefined') Runtime.Console = {};
Runtime.Console.BaseCommand = function()
{
	use("Runtime.BaseObject").apply(this, arguments);
};
Runtime.Console.BaseCommand.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Console.BaseCommand.prototype.constructor = Runtime.Console.BaseCommand;
Object.assign(Runtime.Console.BaseCommand.prototype,
{
	/**
	 * Run task
	 */
	runTask: function()
	{
		return this.constructor.UNKNOWN_ERROR;
	},
});
Object.assign(Runtime.Console.BaseCommand, use("Runtime.BaseObject"));
Object.assign(Runtime.Console.BaseCommand,
{
	SUCCESS: 1,
	UNKNOWN_ERROR: -1,
	/**
	 * Returns name
	 */
	getName: function()
	{
		return "";
	},
	/**
	 * Returns description
	 */
	getDescription: function()
	{
		return "";
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Console";
	},
	getClassName: function()
	{
		return "Runtime.Console.BaseCommand";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
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
});use.add(Runtime.Console.BaseCommand);
module.exports = Runtime.Console.BaseCommand;