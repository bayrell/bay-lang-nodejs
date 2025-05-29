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
if (typeof BayLang.Compiler.Commands == 'undefined') BayLang.Compiler.Commands = {};
BayLang.Compiler.Commands.Compile = function(ctx)
{
	use("Runtime.Console.BaseCommand").apply(this, arguments);
};
BayLang.Compiler.Commands.Compile.prototype = Object.create(use("Runtime.Console.BaseCommand").prototype);
BayLang.Compiler.Commands.Compile.prototype.constructor = BayLang.Compiler.Commands.Compile;
Object.assign(BayLang.Compiler.Commands.Compile.prototype,
{
});
Object.assign(BayLang.Compiler.Commands.Compile, use("Runtime.Console.BaseCommand"));
Object.assign(BayLang.Compiler.Commands.Compile,
{
	/**
	 * Returns name
	 */
	getName: function(ctx)
	{
		return "compile";
	},
	/**
	 * Returns description
	 */
	getDescription: function(ctx)
	{
		return "Compile file";
	},
	/**
	 * Run task
	 */
	run: async function(ctx)
	{
		var command = Runtime.rtl.attr(ctx, ctx.cli_args, 2);
		var src_file_name = Runtime.rtl.attr(ctx, ctx.cli_args, 3);
		var dest_file_name = Runtime.rtl.attr(ctx, ctx.cli_args, 4);
		/* Check command */
		if (!command)
		{
			var __v0 = use("Runtime.io");
			__v0.print(ctx, "Print <command> <src> <dest>");
			var __v1 = use("Runtime.io");
			__v1.print(ctx, "Command: bay_to_php, bay_to_es6, php_to_bay, php_to_es6, es6_to_bay, es6_to_php");
			return Promise.resolve(this.FAIL);
		}
		/* Check src */
		if (!src_file_name)
		{
			var __v0 = use("Runtime.io");
			__v0.print_error(ctx, "Print src file name");
			return Promise.resolve(this.FAIL);
		}
		/* Check dest */
		if (!dest_file_name)
		{
			var __v0 = use("Runtime.io");
			__v0.print_error(ctx, "Print dest file name");
			return Promise.resolve(this.FAIL);
		}
		var __v0 = use("Runtime.io");
		__v0.print(ctx, "Convert " + use("Runtime.rtl").toStr(src_file_name) + use("Runtime.rtl").toStr(" to ") + use("Runtime.rtl").toStr(dest_file_name));
		var __v1 = use("BayLang.LangUtils");
		var res = __v1.parseCommand(ctx, command);
		var __v2 = use("BayLang.LangUtils");
		var parser = __v2.createParser(ctx, res.get(ctx, "from"));
		var __v3 = use("BayLang.LangUtils");
		var translator = __v3.createTranslator(ctx, res.get(ctx, "to"));
		/* Check file exists */
		var __v4 = use("Runtime.fs");
		if (!await __v4.isFile(ctx, src_file_name))
		{
			var __v5 = use("Runtime.io");
			__v5.print_error(ctx, "File not found");
			return Promise.resolve(this.FAIL);
		}
		/* Read file name */
		var op_code = null;
		var __v4 = use("Runtime.fs");
		var content = await __v4.readFile(ctx, src_file_name);
		var output = "";
		/* Translate file */
		var __v5 = use("BayLang.Exceptions.ParserError");
		try
		{
			parser.setContent(ctx, content);
			op_code = parser.parse(ctx);
			output = translator.translate(ctx, op_code);
		}
		catch (_ex)
		{
			if (_ex instanceof __v5)
			{
				var error = _ex;
				
				var __v6 = use("Runtime.io");
				__v6.print_error(ctx, error.toString(ctx));
				return Promise.resolve(this.FAIL);
			}
			else
			{
				throw _ex;
			}
		}
		/* Save file */
		var __v5 = use("Runtime.fs");
		await __v5.saveFile(ctx, dest_file_name, output);
		/* Return result */
		var __v6 = use("Runtime.io");
		__v6.print(ctx, "Ok");
		return Promise.resolve(this.SUCCESS);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Compiler.Commands";
	},
	getClassName: function()
	{
		return "BayLang.Compiler.Commands.Compile";
	},
	getParentClassName: function()
	{
		return "Runtime.Console.BaseCommand";
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
});use.add(BayLang.Compiler.Commands.Compile);
module.exports = BayLang.Compiler.Commands.Compile;