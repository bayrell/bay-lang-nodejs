"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
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
BayLang.LangBay.ParserBayPreprocessor = class extends BaseObject
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
	 * Read preprocessor switch
	 */
	readSwitch(reader, current_block)
	{
		const OpPreprocessorSwitch = use("BayLang.OpCodes.OpPreprocessorSwitch");
		if (current_block == undefined) current_block = "";
		var caret_start = reader.start();
		var items = [];
		reader.matchToken("#switch");
		while (!reader.eof() && reader.nextToken() != "#endswitch")
		{
			reader.matchToken("#case");
			var op_code_item = null;
			if (reader.nextToken() == "ifdef")
			{
				op_code_item = this.readIfDef(reader, current_block);
			}
			else
			{
				op_code_item = this.readIfCode(reader);
			}
			items.push(op_code_item);
		}
		reader.matchToken("#endswitch");
		return new OpPreprocessorSwitch(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read preprocessor ifcode
	 */
	readIfCode(reader)
	{
		const OpPreprocessorIfCode = use("BayLang.OpCodes.OpPreprocessorIfCode");
		var caret_start = reader.start();
		var is_switch = false;
		if (reader.nextToken() == "#ifcode") reader.matchToken("#ifcode");
		else
		{
			is_switch = true;
			reader.matchToken("ifcode");
		}
		var save_find_variable = this.parser.find_variable;
		this.parser.find_variable = false;
		var expression = this.parser.parser_expression.readExpression(reader);
		this.parser.find_variable = save_find_variable;
		reader.matchToken("then");
		/* Read content */
		var content = [];
		var caret = reader.caret();
		while (!caret.eof() && !(caret.isNextString("#endif") || caret.isNextString("#case") || caret.isNextString("#endswitch")))
		{
			content.push(caret.readChar());
		}
		reader.init(caret);
		if (!is_switch) reader.matchToken("#endif");
		return new OpPreprocessorIfCode(Map.create({
			"condition": expression,
			"content": rs.trim(rs.join("", content)),
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read preprocessor ifdef
	 */
	readIfDef(reader, current_block)
	{
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpItems = use("BayLang.OpCodes.OpItems");
		var caret_start = reader.start();
		var is_switch = false;
		if (reader.nextToken() == "#ifdef") reader.matchToken("#ifdef");
		else
		{
			is_switch = true;
			reader.matchToken("ifdef");
		}
		/* Read expression */
		var save_find_variable = this.parser.find_variable;
		this.parser.find_variable = false;
		var expression = this.parser.parser_expression.readExpression(reader);
		this.parser.find_variable = save_find_variable;
		reader.matchToken("then");
		/* Read content */
		var content = null;
		if (current_block == OpPreprocessorIfDef.KIND_PROGRAM)
		{
			content = this.parser.parser_program.parse(reader);
		}
		else if (current_block == OpPreprocessorIfDef.KIND_CLASS_BODY)
		{
			content = this.parser.parser_class.readBody(reader, false);
		}
		else if (current_block == OpPreprocessorIfDef.KIND_OPERATOR)
		{
			content = this.parser.parser_operator.parse(reader, false);
		}
		else if (current_block == OpPreprocessorIfDef.KIND_COLLECTION)
		{
			var items = [];
			while (!reader.eof() && reader.nextToken() != "#endif")
			{
				var op_code_item = this.parser.parser_expression.readExpression(reader);
				items.push(op_code_item);
				if (reader.nextToken() == "," || reader.nextToken() != "#endif")
				{
					reader.matchToken(",");
				}
			}
			content = new OpItems(Map.create({
				"items": items,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		else if (current_block == OpPreprocessorIfDef.KIND_EXPRESSION)
		{
			content = this.parser.parser_expression.readExpression(reader);
			if (reader.nextToken() == ",") reader.matchToken(",");
		}
		else
		{
			throw reader.error("Unknown block '" + String(current_block) + String("'"));
		}
		if (!is_switch) reader.matchToken("#endif");
		return new OpPreprocessorIfDef(Map.create({
			"condition": expression,
			"content": content,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read namespace
	 */
	readPreprocessor(reader, current_block)
	{
		if (current_block == undefined) current_block = "";
		if (reader.nextToken() == "#switch")
		{
			return this.readSwitch(reader, current_block);
		}
		else if (reader.nextToken() == "#ifcode")
		{
			return this.readIfCode(reader);
		}
		else if (reader.nextToken() == "#ifdef")
		{
			return this.readIfDef(reader, current_block);
		}
		return null;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangBay.ParserBayPreprocessor"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangBay.ParserBayPreprocessor);
module.exports = {
	"ParserBayPreprocessor": BayLang.LangBay.ParserBayPreprocessor,
};