"use strict;"
const use = require('bay-lang').use;
/*
!
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
BayLang.LangBay.ParserBayProgram = class extends use("Runtime.BaseObject")
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
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		/* Read module name */
		reader.matchToken("namespace");
		let entity_name = this.parser.parser_base.readEntityName(reader);
		let module_name = entity_name.getName();
		/* Create op_code */
		let op_code = new OpNamespace(Map.create({
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
		const Map = use("Runtime.Map");
		let look = null;
		let name = null;
		let caret_start = reader.start();
		let alias = "";
		/* Read module name */
		reader.matchToken("use");
		let module_name = this.parser.parser_base.readEntityName(reader);
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
	 * Annotation
	 */
	readAnnotation(reader)
	{
		const OpAnnotation = use("BayLang.OpCodes.OpAnnotation");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		reader.matchToken("@");
		let name = this.parser.parser_base.readTypeIdentifier(reader);
		let params = null;
		if (reader.nextToken() == "{")
		{
			params = this.parser.parser_base.readDict(reader);
		}
		return new OpAnnotation(Map.create({
			"name": name,
			"params": params,
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
		let next_token = reader.nextTokenComments();
		/* Namespace */
		if (next_token == "namespace")
		{
			return this.readNamespace(reader);
		}
		else if (next_token == "use")
		{
			return this.readUse(reader);
		}
		else if (next_token == "@")
		{
			return this.readAnnotation(reader);
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
		const Vector = use("Runtime.Vector");
		const OpAnnotation = use("BayLang.OpCodes.OpAnnotation");
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const OpModule = use("BayLang.OpCodes.OpModule");
		const Map = use("Runtime.Map");
		this.parser.current_block = CoreParser.BLOCK_PROGRAM;
		let annotations = new Vector();
		let items = new Vector();
		let caret_start = reader.start();
		/* Read module */
		while (!reader.eof() && reader.nextToken() != "" && reader.nextToken() != "#endswitch" && reader.nextToken() != "#case" && reader.nextToken() != "#endif")
		{
			let next_token = reader.nextToken();
			/* Read module item */
			let op_code = this.readModuleItem(reader);
			if (op_code instanceof OpAnnotation)
			{
				annotations.push(op_code);
			}
			else if (op_code)
			{
				if (op_code instanceof OpDeclareClass)
				{
					op_code.annotations = annotations;
					annotations = new Vector();
				}
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
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangBay.ParserBayProgram);
module.exports = {
	"ParserBayProgram": BayLang.LangBay.ParserBayProgram,
};