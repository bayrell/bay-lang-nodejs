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
if (typeof Runtime.Console.Annotations == 'undefined') Runtime.Console.Annotations = {};
Runtime.Console.Annotations.ConsoleCommand = function(api_name)
{
	use("Runtime.Entity.Entity").call(this, use("Runtime.Map").from({"name":api_name}));
};
Runtime.Console.Annotations.ConsoleCommand.prototype = Object.create(use("Runtime.Entity.Entity").prototype);
Runtime.Console.Annotations.ConsoleCommand.prototype.constructor = Runtime.Console.Annotations.ConsoleCommand;
Object.assign(Runtime.Console.Annotations.ConsoleCommand.prototype,
{
});
Object.assign(Runtime.Console.Annotations.ConsoleCommand, use("Runtime.Entity.Entity"));
Object.assign(Runtime.Console.Annotations.ConsoleCommand,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Console.Annotations";
	},
	getClassName: function()
	{
		return "Runtime.Console.Annotations.ConsoleCommand";
	},
	getParentClassName: function()
	{
		return "Runtime.Entity.Entity";
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
});use.add(Runtime.Console.Annotations.ConsoleCommand);
module.exports = Runtime.Console.Annotations.ConsoleCommand;