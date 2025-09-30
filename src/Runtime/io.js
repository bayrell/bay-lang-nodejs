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
if (typeof Runtime == 'undefined') Runtime = {};
Runtime.io = function()
{
};
Object.assign(Runtime.io.prototype,
{
});
Object.assign(Runtime.io,
{
	/**
	 * Print message to output
	 */
	print: function(message, new_line, type)
	{
		if (new_line == undefined) new_line = true;
		if (type == undefined) type = "";
		var output = use("Runtime.rtl").getContext().provider("output");
		output.print(message, new_line, type);
	},
	/**
	 * Print error message to output
	 */
	print_error: function(message)
	{
		var output = use("Runtime.rtl").getContext().provider("output");
		output.print_error(message);
	},
	/**
	 * Color message to output
	 */
	color: function(color, message)
	{
		var output = use("Runtime.rtl").getContext().provider("output");
		return output.color(color, message);
	},
	/**
	 * Log message
	 */
	log: function(type, message)
	{
		var p = use("Runtime.rtl").getContext().provider("log");
		p.log(type, message);
	},
	/**
	 * Read line from input
	 */
	input: function()
	{
		var input = use("Runtime.rtl").getContext().provider("input");
		return input.input();
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.io";
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
});use.add(Runtime.io);
module.exports = Runtime.io;