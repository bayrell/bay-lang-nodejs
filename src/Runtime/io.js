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
Runtime.io = function(ctx)
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
	print: function(ctx, message, new_line, type)
	{
		if (new_line == undefined) new_line = true;
		if (type == undefined) type = "";
		var output = ctx.provider(ctx, "output");
		output.print(ctx, message, new_line, type);
	},
	/**
	 * Print error message to output
	 */
	print_error: function(ctx, message)
	{
		var output = ctx.provider(ctx, "output");
		output.print_error(ctx, message);
	},
	/**
	 * Color message to output
	 */
	color: function(ctx, color, message)
	{
		var output = ctx.provider(ctx, "output");
		return output.color(ctx, color, message);
	},
	/**
	 * Log message
	 */
	log: function(ctx, type, message)
	{
		var p = ctx.provider(ctx, "log");
		p.log(ctx, type, message);
	},
	/**
	 * Read line from input
	 */
	input: function(ctx)
	{
		var input = ctx.provider(ctx, "input");
		return input.input(ctx);
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
});use.add(Runtime.io);
module.exports = Runtime.io;