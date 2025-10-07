"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const BaseCommand = use("Runtime.Console.BaseCommand");
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2025 "Ildar Bikmamatov" <support@bayrell.org>
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
BayLang.Compiler.Commands.Compile = class extends BaseCommand
{
	/**
	 * Returns name
	 */
	static getName(){ return "compile"; }
	
	
	/**
	 * Returns description
	 */
	static getDescription(){ return "Compile file"; }
	
	
	/**
	 * Run task
	 */
	static async run()
	{
		const LangUtils = use("BayLang.LangUtils");
		const fs = use("Runtime.fs");
		const ParserError = use("BayLang.Exceptions.ParserError");
		var command = Runtime.rtl.getContext().cli_args[2];
		var src_file_name = Runtime.rtl.getContext().cli_args[3];
		var dest_file_name = Runtime.rtl.getContext().cli_args[4];
		/* Check command */
		if (!command)
		{
			rtl.print("Print <command> <src> <dest>");
			rtl.print("Command: bay_to_php, bay_to_es6, php_to_bay, php_to_es6, es6_to_bay, es6_to_php");
			return this.FAIL;
		}
		/* Check src */
		if (!src_file_name)
		{
			rtl.print_error("Print src file name");
			return this.FAIL;
		}
		/* Check dest */
		if (!dest_file_name)
		{
			rtl.print_error("Print dest file name");
			return this.FAIL;
		}
		rtl.print("Convert " + String(src_file_name) + String(" to ") + String(dest_file_name));
		var res = LangUtils.parseCommand(command);
		var parser = LangUtils.createParser(res.get("from"));
		var translator = LangUtils.createTranslator(res.get("to"));
		/* Check file exists */
		if (!await fs.isFile(src_file_name))
		{
			rtl.print_error("File not found");
			return this.FAIL;
		}
		/* Read file name */
		var op_code = null;
		var content = await fs.readFile(src_file_name);
		var output = "";
		/* Translate file */
		try
		{
			parser.setContent(content);
			op_code = parser.parse();
			output = translator.translate(op_code);
		}
		catch (_ex)
		{
			if (_ex instanceof ParserError)
			{
				var error = _ex;
				rtl.print_error(error.toString());
				return this.FAIL;
			}
			else
			{
				throw _ex;
			}
		}
		/* Save file */
		await fs.saveFile(dest_file_name, output);
		/* Return result */
		rtl.print("Ok");
		return this.SUCCESS;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.Compiler.Commands.Compile"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.Compiler.Commands.Compile);
module.exports = {
	"Compile": BayLang.Compiler.Commands.Compile,
};