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
if (typeof BayLang.LangPHP == 'undefined') BayLang.LangPHP = {};
BayLang.LangPHP.ParserPHPOperator = class extends BaseObject
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
	 * Read return
	 */
	readReturn(reader)
	{
	}
	
	
	/**
	 * Read delete
	 */
	readDelete(reader)
	{
	}
	
	
	/**
	 * Read throw
	 */
	readThrow(reader)
	{
	}
	
	
	/**
	 * Read try
	 */
	readTry(reader)
	{
	}
	
	
	/**
	 * Read if
	 */
	readIf(reader)
	{
		const OpIfElse = use("BayLang.OpCodes.OpIfElse");
		const OpIf = use("BayLang.OpCodes.OpIf");
		var caret_start = reader.start();
		var if_true = null;
		var if_false = null;
		var if_else = [];
		/* Read condition */
		reader.matchToken("if");
		reader.matchToken("(");
		var condition = this.parser.parser_expression.readExpression(reader);
		reader.matchToken(")");
		/* Read content */
		if_true = this.readContent(reader);
		/* Read content */
		var operations = ["else", "elseif"];
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			var token = reader.readToken();
			if (token == "elseif" || token == "else" && reader.nextToken() == "if")
			{
				/* Read condition */
				if (reader.nextToken() == "if") reader.readToken();
				reader.matchToken("(");
				var if_else_condition = this.parser.parser_expression.readExpression(reader);
				reader.matchToken(")");
				/* Read content */
				var if_else_content = this.readContent(reader);
				/* Add op_code */
				if_else.push(new OpIfElse(Map.create({
					"condition": if_else_condition,
					"content": if_else_content,
					"caret_start": caret_start,
					"caret_end": reader.caret(),
				})));
			}
			else if (token == "else")
			{
				if_false = this.readContent(reader);
			}
		}
		return new OpIf(Map.create({
			"condition": condition,
			"if_true": if_true,
			"if_false": if_false,
			"if_else": if_else,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read For
	 */
	readFor(reader)
	{
		const OpFor = use("BayLang.OpCodes.OpFor");
		var caret_start = reader.start();
		/* Read for */
		reader.matchToken("for");
		reader.matchToken("(");
		/* Read assing */
		var expr1 = this.readAssign(reader);
		reader.matchToken(";");
		/* Read expression */
		var expr2 = this.parser.parser_expression.readExpression(reader);
		reader.matchToken(";");
		/* Read operator */
		var expr3 = this.readInc(reader);
		reader.matchToken(")");
		/* Read content */
		var content = this.readContent(reader);
		/* Returns op_code */
		return new OpFor(Map.create({
			"expr1": expr1,
			"expr2": expr2,
			"expr3": expr3,
			"content": content,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read While
	 */
	readWhile(reader)
	{
		const OpWhile = use("BayLang.OpCodes.OpWhile");
		var caret_start = reader.start();
		/* Read condition */
		reader.matchToken("while");
		reader.matchToken("(");
		var condition = this.parser.parser_expression.readExpression(reader);
		reader.matchToken(")");
		/* Read items */
		var content = null;
		if (reader.nextToken() == "{")
		{
			content = this.parse(reader);
		}
		else
		{
			content = this.readOperator(reader);
		}
		/* Returns op_code */
		return new OpWhile(Map.create({
			"content": content,
			"condition": condition,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read assign
	 */
	readAssign(reader, pattern)
	{
		const OpInc = use("BayLang.OpCodes.OpInc");
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const OpAssignValue = use("BayLang.OpCodes.OpAssignValue");
		const OpEntityName = use("BayLang.OpCodes.OpEntityName");
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpFlags = use("BayLang.OpCodes.OpFlags");
		if (pattern == undefined) pattern = null;
		var caret_start = reader.start();
		var items = [];
		/* Read pattern */
		if (pattern == null)
		{
			pattern = this.parser.parser_base.readTypeIdentifier(reader);
		}
		/* Read increment */
		if (reader.nextToken() == "++" || reader.nextToken() == "--")
		{
			var kind = "";
			var operation = reader.readToken();
			if (operation == "++") kind = OpInc.KIND_INC;
			else if (operation == "--") kind = OpInc.KIND_DEC;
			/* Find identifier */
			if (pattern instanceof OpTypeIdentifier)
			{
				pattern = pattern.entity_name.items.last();
			}
			if (!(pattern instanceof OpIdentifier))
			{
				throw pattern.caret_end.error("Wrong type identifier");
			}
			this.parser.findVariable(pattern);
			/* Returns op_code */
			return new OpInc(Map.create({
				"kind": kind,
				"item": pattern,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		/* Read items */
		if (reader.nextToken() != "=")
		{
			while (!reader.eof())
			{
				var caret_value_start = reader.start();
				/* Read assign value */
				var value = this.parser.parser_base.readIdentifier(reader);
				/* Register variable */
				this.parser.addVariable(value, pattern);
				/* Read expression */
				var expression = null;
				if (reader.nextToken() == "=")
				{
					reader.matchToken("=");
					expression = this.parser.parser_expression.readExpression(reader);
				}
				/* Add op_code */
				items.push(new OpAssignValue(Map.create({
					"value": value,
					"expression": expression,
					"caret_start": caret_value_start,
					"caret_end": reader.caret(),
				})));
				/* Read next token */
				if (reader.nextToken() != ",") break;
				reader.readToken();
			}
		}
		else
		{
			/* Get value */
			var value = pattern;
			pattern = null;
			/* Find identifier */
			if (value instanceof OpTypeIdentifier)
			{
				value = value.entity_name.items.last();
			}
			if (!(value instanceof OpIdentifier))
			{
				throw value.caret_end.error("Wrong type identifier");
			}
			var find = this.parser.findVariable(value);
			if (!find)
			{
				pattern = new OpTypeIdentifier(Map.create({
					"entity_name": new OpEntityName(Map.create({
						"items": [
							new OpIdentifier(Map.create({
								"value": "var",
							})),
						],
					})),
				}));
				this.parser.addVariable(value, pattern);
			}
			/* Read expression */
			reader.matchToken("=");
			var expression = this.parser.parser_expression.readExpression(reader);
			items.push(new OpAssignValue(Map.create({
				"value": value,
				"expression": expression,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			})));
		}
		/* Returns op_code */
		return new OpAssign(Map.create({
			"flags": new OpFlags(),
			"pattern": pattern,
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read operator
	 */
	readInc(reader)
	{
		const OpInc = use("BayLang.OpCodes.OpInc");
		var caret_start = reader.start();
		/* Read identifier */
		var item = this.parser.parser_base.readIdentifier(reader);
		/* Read kind */
		var kind = reader.readToken();
		if (kind == "++") kind = OpInc.KIND_INC;
		else if (kind == "--") kind = OpInc.KIND_DEC;
		else throw reader.expected("++ or --");
		/* Returns op_code */
		return new OpInc(Map.create({
			"kind": kind,
			"item": item,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read operator
	 */
	readOperator(reader)
	{
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpBreak = use("BayLang.OpCodes.OpBreak");
		const OpContinue = use("BayLang.OpCodes.OpContinue");
		var next_token = reader.nextToken();
		var caret_start = reader.start();
		/* Comment */
		if (next_token == "/")
		{
			return this.parser.parser_base.readComment(reader);
		}
		else if (next_token == "#switch" || next_token == "#ifcode")
		{
			return this.parser.parser_preprocessor.readPreprocessor(reader);
		}
		else if (next_token == "#ifdef")
		{
			return this.parser.parser_preprocessor.readPreprocessorIfDef(reader, OpPreprocessorIfDef.KIND_OPERATOR);
		}
		else if (next_token == "break")
		{
			return new OpBreak(Map.create({
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		else if (next_token == "continue")
		{
			return new OpContinue(Map.create({
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		else if (next_token == "delete")
		{
			return this.readDelete(reader);
		}
		else if (next_token == "return")
		{
			return this.readReturn(reader);
		}
		else if (next_token == "throw")
		{
			return this.readThrow(reader);
		}
		else if (next_token == "try")
		{
			return this.readTry(reader);
		}
		else if (next_token == "if")
		{
			return this.readIf(reader);
		}
		else if (next_token == "for")
		{
			return this.readFor(reader);
		}
		else if (next_token == "while")
		{
			return this.readWhile(reader);
		}
		/* Save caret */
		var save_caret = reader.caret();
		/* Try to read call function */
		var op_code = this.parser.parser_function.readCallFunction(reader);
		if (op_code) return op_code;
		/* Restore reader */
		reader.init(save_caret);
		/* Assign operator */
		return this.readAssign(reader);
	}
	
	
	/**
	 * Read content
	 */
	readContent(reader)
	{
		if (reader.nextToken() == "{")
		{
			return this.parse(reader);
		}
		var content = this.readOperator(reader);
		reader.matchToken(";");
		return content;
	}
	
	
	/**
	 * Read operators
	 */
	parse(reader)
	{
		const OpItems = use("BayLang.OpCodes.OpItems");
		var caret_start = reader.start();
		var items = [];
		/* Read begin tag */
		reader.matchToken("{");
		/* Read operators */
		while (!reader.eof() && reader.nextToken() != "}")
		{
			var op_code = this.readOperator(reader);
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
		/* Read end tag */
		reader.matchToken("}");
		/* Returns value */
		return new OpItems(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangPHP.ParserPHPOperator"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangPHP.ParserPHPOperator);
module.exports = {
	"ParserPHPOperator": BayLang.LangPHP.ParserPHPOperator,
};