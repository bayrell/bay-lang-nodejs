"use strict;"
const use = require('bay-lang').use;
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
if (typeof BayLang.LangPHP == 'undefined') BayLang.LangPHP = {};
BayLang.LangPHP.ParserPHPProgram = class extends use("Runtime.BaseObject")
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
		let next_token = reader.nextToken();
		/* Namespace */
		if (next_token == "namespace")
		{
			return this.readNamespace(reader);
		}
		else if (next_token == "use")
		{
			return this.readUse(reader);
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
		const Vector = use("Runtime.Vector");
		const OpModule = use("BayLang.OpCodes.OpModule");
		const Map = use("Runtime.Map");
		let items = Vector.create([]);
		let caret_start = reader.start();
		/* Read PHP token */
		reader.matchToken("<?php");
		/* Read module */
		while (!reader.eof() && reader.nextToken() != "")
		{
			let next_token = reader.nextToken();
			/* Read module item */
			let op_code = this.readModuleItem(reader);
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
	static getClassName(){ return "BayLang.LangPHP.ParserPHPProgram"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangPHP.ParserPHPProgram);
module.exports = {
	"ParserPHPProgram": BayLang.LangPHP.ParserPHPProgram,
};