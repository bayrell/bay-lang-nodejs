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
if (typeof BayLang.LangES6 == 'undefined') BayLang.LangES6 = {};
BayLang.LangES6.ParserES6Operator = class extends use("Runtime.BaseObject")
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
		const Vector = use("Runtime.Vector");
		const OpIfElse = use("BayLang.OpCodes.OpIfElse");
		const Map = use("Runtime.Map");
		const OpIf = use("BayLang.OpCodes.OpIf");
		let caret_start = reader.start();
		let if_true = null;
		let if_false = null;
		let if_else = new Vector();
		/* Read condition */
		reader.matchToken("if");
		reader.matchToken("(");
		let condition = this.parser.parser_expression.readExpression(reader);
		reader.matchToken(")");
		/* Read content */
		if_true = this.readContent(reader);
		/* Read content */
		let operations = new Vector("else", "elseif");
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			let token = reader.readToken();
			if (token == "elseif" || token == "else" && reader.nextToken() == "if")
			{
				/* Read condition */
				if (reader.nextToken() == "if") reader.readToken();
				reader.matchToken("(");
				let if_else_condition = this.parser.parser_expression.readExpression(reader);
				reader.matchToken(")");
				/* Read content */
				let if_else_content = this.readContent(reader);
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
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		/* Read for */
		reader.matchToken("for");
		reader.matchToken("(");
		/* Read assing */
		let expr1 = this.readAssign(reader);
		reader.matchToken(";");
		/* Read expression */
		let expr2 = this.parser.parser_expression.readExpression(reader);
		reader.matchToken(";");
		/* Read operator */
		let expr3 = this.readInc(reader);
		reader.matchToken(")");
		/* Read content */
		let content = this.readContent(reader);
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
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		/* Read condition */
		reader.matchToken("while");
		reader.matchToken("(");
		let condition = this.parser.parser_expression.readExpression(reader);
		reader.matchToken(")");
		/* Read items */
		let content = null;
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
		const Vector = use("Runtime.Vector");
		const OpInc = use("BayLang.OpCodes.OpInc");
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const Map = use("Runtime.Map");
		const OpAssignValue = use("BayLang.OpCodes.OpAssignValue");
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpFlags = use("BayLang.OpCodes.OpFlags");
		if (pattern == undefined) pattern = null;
		let caret_start = reader.start();
		let items = new Vector();
		/* Read pattern */
		if (pattern == null)
		{
			pattern = this.parser.parser_base.readTypeIdentifier(reader);
		}
		/* Read increment */
		if (reader.nextToken() == "++" || reader.nextToken() == "--")
		{
			let kind = "";
			let operation = reader.readToken();
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
		let operations = new Vector("=", "+=", "-=", "~=");
		let next_token = reader.nextToken();
		if (operations.indexOf(next_token) == -1)
		{
			while (!reader.eof())
			{
				let caret_value_start = reader.start();
				/* Read assign value */
				let value = this.parser.parser_base.readIdentifier(reader);
				/* Register variable */
				this.parser.addVariable(value, pattern);
				/* Read expression */
				let expression = null;
				if (reader.nextToken() == "=")
				{
					reader.matchToken("=");
					expression = this.parser.parser_expression.readExpression(reader);
				}
				/* Add op_code */
				items.push(new OpAssignValue(Map.create({
					"op": "=",
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
			let value = pattern;
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
			this.parser.findVariable(value);
			/* Read expression */
			let op = reader.readToken();
			let expression = this.parser.parser_expression.readExpression(reader);
			items.push(new OpAssignValue(Map.create({
				"op": op,
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
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		/* Read identifier */
		let item = this.parser.parser_base.readIdentifier(reader);
		/* Read kind */
		let kind = reader.readToken();
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
		const OpBreak = use("BayLang.OpCodes.OpBreak");
		const Map = use("Runtime.Map");
		const OpContinue = use("BayLang.OpCodes.OpContinue");
		let next_token = reader.nextToken();
		let caret_start = reader.start();
		/* Comment */
		if (next_token == "/")
		{
			return this.parser.parser_base.readComment(reader);
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
		let save_caret = reader.caret();
		/* Try to read call function */
		let op_code = this.parser.parser_function.readCallFunction(reader);
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
		let content = this.readOperator(reader);
		reader.matchToken(";");
		return content;
	}
	
	
	/**
	 * Read operators
	 */
	parse(reader)
	{
		const Vector = use("Runtime.Vector");
		const OpItems = use("BayLang.OpCodes.OpItems");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let items = new Vector();
		/* Read begin tag */
		reader.matchToken("{");
		/* Read operators */
		while (!reader.eof() && reader.nextToken() != "}")
		{
			let op_code = this.readOperator(reader);
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
	static getClassName(){ return "BayLang.LangES6.ParserES6Operator"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangES6.ParserES6Operator);
module.exports = {
	"ParserES6Operator": BayLang.LangES6.ParserES6Operator,
};