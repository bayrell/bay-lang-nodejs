"use strict;"
const use = require('bay-lang').use;
const BaseObject = use("Runtime.BaseObject");
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
if (typeof BayLang.LangBay == 'undefined') BayLang.LangBay = {};
BayLang.LangBay.ParserBayProgram = class extends BaseObject
{
	
	
	/**
	 * Constructor
	 */
	constructor(parser)
	{
		super();
		this.parser = parser;
	}
	
	
	/**
	 * Read namespace
	 */
	readNamespace(reader)
	{
		const OpNamespace = use("BayLang.OpCodes.OpNamespace");
		var caret_start = reader.start();
		/* Read module name */
		reader.matchToken("namespace");
		var entity_name = this.parser.parser_base.readEntityName(reader);
		var module_name = entity_name.getName();
		/* Create op_code */
		var op_code = new OpNamespace(Map.create({
			"caret_start": caret_start,
			"caret_end": reader.caret(),
			"name": module_name,
		}));
		/* Set current namespace */
		this.parser.current_namespace = op_code;
		this.parser.current_namespace_name = module_name;
		/* Returns op_code */
		return op_code;
	}
	
	
	/**
	 * Read use
	 */
	readUse(reader)
	{
		const OpUse = use("BayLang.OpCodes.OpUse");
		var look = null;
		var name = null;
		var caret_start = reader.start();
		var alias = "";
		/* Read module name */
		reader.matchToken("use");
		var module_name = this.parser.parser_base.readEntityName(reader);
		/* Read alias */
		if (reader.nextToken() == "as")
		{
			reader.readToken();
			alias = reader.readToken();
		}
		else
		{
			alias = module_name.items.last().value;
		}
		/* Add use */
		this.parser.uses.set(alias, module_name.getName());
		return new OpUse(Map.create({
			"name": module_name.getName(),
			"alias": alias,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read module
	 */
	readModuleItem(reader)
	{
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		var next_token = reader.nextTokenComments();
		/* Namespace */
		if (next_token == "namespace")
		{
			return this.readNamespace(reader);
		}
		else if (next_token == "use")
		{
			return this.readUse(reader);
		}
		else if (next_token == "abstract" || next_token == "class" || next_token == "interface")
		{
			return this.parser.parser_class.readClass(reader);
		}
		else if (next_token == "#switch" || next_token == "#ifcode" || next_token == "#ifdef")
		{
			return this.parser.parser_preprocessor.readPreprocessor(reader, OpPreprocessorIfDef.KIND_PROGRAM);
		}
		else if (next_token != "")
		{
			return this.parser.parser_operator.readOperator(reader);
		}
		return null;
	}
	
	
	/**
	 * Parse program
	 */
	parse(reader)
	{
		const CoreParser = use("BayLang.CoreParser");
		const OpModule = use("BayLang.OpCodes.OpModule");
		this.parser.current_block = CoreParser.BLOCK_PROGRAM;
		var items = [];
		var caret_start = reader.start();
		/* Read module */
		while (!reader.eof() && reader.nextToken() != "" && reader.nextToken() != "#endswitch" && reader.nextToken() != "#case" && reader.nextToken() != "#endif")
		{
			var next_token = reader.nextToken();
			/* Read module item */
			var op_code = this.readModuleItem(reader);
			if (op_code)
			{
				items.push(op_code);
			}
			else
			{
				break;
			}
			/* Match semicolon */
			if (reader.nextToken() == ";")
			{
				reader.matchToken(";");
			}
		}
		/* Returns op_code */
		return new OpModule(Map.create({
			"caret_start": caret_start,
			"caret_end": reader.caret(),
			"items": items,
		}));
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangBay.ParserBayProgram"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangBay.ParserBayProgram);
module.exports = {
	"ParserBayProgram": BayLang.LangBay.ParserBayProgram,
};